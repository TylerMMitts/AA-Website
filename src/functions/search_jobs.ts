import axios from 'axios';
import { JobSearchCache } from '../utils/jobSearchCache';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimiter';

export interface JobListingInput {
  country?: string;
  title?: string;
  location?: string;
  limit?: number;
  datePosted?: string;
  userId?: string; // Add userId for rate limiting
  isPro?: boolean; // Add isPro flag for different limits
}

// TODO: Replace with your actual API Gateway URL after deploying the Lambda function
const API_ENDPOINT = import.meta.env.VITE_SEARCH_JOBS_API_URL || 'MOCK';

export async function searchJobs(input: JobListingInput): Promise<any[]> {
  // Check cache first (cached results don't count against rate limit)
  const cached = JobSearchCache.get(input);
  if (cached) {
    console.log('Returning cached job search results');
    return cached;
  }

  // Only check rate limit if NOT using cache (actual API call)
  if (input.userId) {
    const rateLimitKey = getRateLimitKey(input.userId, 'job-search');
    const limit = input.isPro ? RATE_LIMITS.JOB_SEARCH_PRO : RATE_LIMITS.JOB_SEARCH_FREE;
    const rateLimitResult = checkRateLimit(rateLimitKey, limit);

    if (!rateLimitResult.allowed) {
      throw new Error(rateLimitResult.message || 'Rate limit exceeded');
    }

    // Log remaining requests for debugging
    console.log(`Job search rate limit: ${rateLimitResult.remaining} requests remaining`);
  }

  // TEMPORARY: Mock data for testing UI (remove after Lambda deployment)
  if (API_ENDPOINT === 'MOCK') {
    console.warn('Using mock data - deploy Lambda and set VITE_SEARCH_JOBS_API_URL');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock job data
    const mockData = [
      {
        key: '1',
        title: `${input.title || 'Software'} Engineer`,
        employer: { name: 'Tech Corp' },
        location: { city: input.location || 'San Francisco', admin1Code: 'CA' },
        jobUrl: 'https://example.com/job1',
        baseSalary: { min: 120000, max: 180000 },
        jobTypes: { CF3CP: 'Full-time' },
        attributes: { UB7SC: 'Mid-Senior level' },
        description: { text: 'Exciting opportunity to work on cutting-edge technology in a remote-first environment.' },
        datePublished: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        key: '2',
        title: `Senior ${input.title || 'Software'} Developer`,
        employer: { name: 'Innovation Labs' },
        location: { city: input.location || 'New York', admin1Code: 'NY' },
        jobUrl: 'https://example.com/job2',
        baseSalary: { min: 140000, max: 200000 },
        jobTypes: { CF3CP: 'Full-time' },
        attributes: { UB7SC: 'Senior level' },
        description: { text: 'Join our team building next-generation applications. Hybrid work environment available.' },
        datePublished: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        key: '3',
        title: `${input.title || 'Software'} Architect`,
        employer: { name: 'Digital Solutions Inc' },
        location: { city: input.location || 'Austin', admin1Code: 'TX' },
        jobUrl: 'https://example.com/job3',
        baseSalary: { min: 160000, max: 220000 },
        jobTypes: { CF3CP: 'Full-time' },
        attributes: { UB7SC: 'Executive' },
        description: { text: 'Lead technical architecture for enterprise solutions. On-site position with great benefits.' },
        datePublished: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Cache mock data too
    JobSearchCache.set(input, mockData);
    return mockData;
  }

  // Production: Call Lambda function via API Gateway
  try {
    const response = await axios.post(
      API_ENDPOINT,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      const jobs = response.data.data || [];
      // Cache the results
      JobSearchCache.set(input, jobs);
      return jobs;
    } else {
      throw new Error(response.data.error || 'Failed to search jobs');
    }
  } catch (error: any) {
    console.error('Error calling search jobs API:', error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to search jobs');
  }
}
