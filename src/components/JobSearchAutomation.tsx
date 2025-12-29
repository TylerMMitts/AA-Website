import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { searchJobs, JobListingInput } from '../functions/search_jobs';
import { Search, Plus, Building2, MapPin, DollarSign, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  salary: string;
  postedDate: string;
  description: string;
  type: string;
  level: string;
  url?: string;
  status: 'not applied' | 'applied' | 'interviewing' | 'offer' | 'rejected';
}

interface JobSearchAutomationProps {
  onAddJob: (job: Job) => void;
  onBack: () => void;
}

export function JobSearchAutomation({ onAddJob, onBack }: JobSearchAutomationProps) {
  const [searchParams, setSearchParams] = useState<JobListingInput>({
    country: 'us',
    title: '',
    location: '',
    limit: 20,
    datePosted: '7'
  });
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchParams.title && !searchParams.location) {
      toast.error('Please enter a job title or location');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const jobs = await searchJobs(searchParams);
      setResults(jobs || []);
      
      if (!jobs || jobs.length === 0) {
        toast.info('No jobs found matching your criteria');
      } else {
        toast.success(`Found ${jobs.length} job postings`);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const parseJobFromAPI = (apiJob: any): Job => {
    // Extract location string
    const locationParts = [];
    if (apiJob.location?.city) locationParts.push(apiJob.location.city);
    if (apiJob.location?.admin1Code) locationParts.push(apiJob.location.admin1Code);
    const location = locationParts.join(', ') || 'Location not specified';

    // Extract salary
    let salary = 'Not specified';
    if (apiJob.baseSalary?.min && apiJob.baseSalary?.max) {
      const min = (apiJob.baseSalary.min / 1000).toFixed(0);
      const max = (apiJob.baseSalary.max / 1000).toFixed(0);
      salary = `$${min}k - $${max}k`;
    }

    // Extract job type
    const jobType = apiJob.jobTypes?.CF3CP || Object.values(apiJob.jobTypes || {})[0] || 'Full-time';

    // Extract level from attributes
    let level = 'Mid';
    if (apiJob.attributes?.UB7SC === 'Senior level') level = 'Senior';
    else if (Object.values(apiJob.attributes || {}).some((v: any) => v?.toLowerCase().includes('entry'))) level = 'Entry';
    else if (Object.values(apiJob.attributes || {}).some((v: any) => v?.toLowerCase().includes('executive'))) level = 'Executive';

    // Determine remote status
    let remote = 'On-site';
    const descLower = (apiJob.description?.text || '').toLowerCase();
    if (descLower.includes('remote')) remote = 'Remote';
    else if (descLower.includes('hybrid')) remote = 'Hybrid';

    // Format posted date
    let postedDate = 'Recently';
    if (apiJob.datePublished) {
      const date = new Date(apiJob.datePublished);
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo === 0) postedDate = 'Today';
      else if (daysAgo === 1) postedDate = 'Yesterday';
      else if (daysAgo < 7) postedDate = `${daysAgo} days ago`;
      else if (daysAgo < 30) postedDate = `${Math.floor(daysAgo / 7)} weeks ago`;
      else postedDate = `${Math.floor(daysAgo / 30)} months ago`;
    }

    return {
      id: apiJob.key || Date.now().toString(),
      title: apiJob.title || 'Untitled Position',
      company: apiJob.employer?.name || 'Company not specified',
      location,
      salary,
      type: jobType,
      level,
      remote,
      url: apiJob.jobUrl || apiJob.url,
      description: (apiJob.description?.text || '').substring(0, 500),
      postedDate,
      status: 'not applied'
    };
  };

  const handleAddJob = (apiJob: any) => {
    const parsedJob = parseJobFromAPI(apiJob);
    onAddJob(parsedJob);
    toast.success(`Added ${parsedJob.title} to your dashboard!`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
            style={{ color: '#51355A' }}
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#2A0C4E' }}>
            Job Search Automation
          </h1>
          <p className="text-lg" style={{ color: '#51355A' }}>
            Find relevant jobs and add them to your dashboard with one click
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 rounded-2xl border-2" style={{ borderColor: '#51355A' }}>
          <CardHeader>
            <CardTitle style={{ color: '#2A0C4E' }}>Search Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" style={{ color: '#51355A' }}>Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer, Product Manager"
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" style={{ color: '#51355A' }}>Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, San Francisco"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="limit" style={{ color: '#51355A' }}>Number of Results</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="100"
                  value={searchParams.limit}
                  onChange={(e) => setSearchParams({ ...searchParams, limit: parseInt(e.target.value) || 20 })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePosted" style={{ color: '#51355A' }}>Posted Within (days)</Label>
                <Input
                  id="datePosted"
                  type="number"
                  min="1"
                  max="30"
                  value={searchParams.datePosted}
                  onChange={(e) => setSearchParams({ ...searchParams, datePosted: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full text-white font-semibold rounded-xl"
              style={{ backgroundColor: '#9E2B25' }}
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {isSearching && (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#9E2B25' }} />
            <p className="text-lg" style={{ color: '#51355A' }}>Searching for jobs...</p>
          </div>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#51355A', opacity: 0.3 }} />
            <p className="text-lg" style={{ color: '#51355A' }}>No jobs found. Try adjusting your search criteria.</p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2A0C4E' }}>
              {results.length} Jobs Found
            </h2>
            {results.map((job) => {
              const parsed = parseJobFromAPI(job);
              return (
                <Card key={job.key} className="hover:shadow-lg transition-shadow rounded-2xl border-2" style={{ borderColor: '#51355A' }}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 flex items-start justify-between" style={{ color: '#2A0C4E' }}>
                          <span>{parsed.title}</span>
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="h-4 w-4" style={{ color: '#51355A' }} />
                          <span className="font-semibold" style={{ color: '#51355A' }}>{parsed.company}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4" style={{ color: '#51355A' }}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{parsed.location}</span>
                          </div>
                          {parsed.salary !== 'Not specified' && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>{parsed.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{parsed.postedDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="rounded-full" style={{ backgroundColor: '#51355A', color: 'white' }}>{parsed.type}</Badge>
                          <Badge variant="outline" className="rounded-full" style={{ borderColor: '#51355A', color: '#51355A' }}>{parsed.level}</Badge>
                          {parsed.remote === 'Remote' && (
                            <Badge className="rounded-full" style={{ backgroundColor: '#9E2B25', color: 'white' }}>Remote</Badge>
                          )}
                        </div>
                        {parsed.description && (
                          <p className="text-sm line-clamp-3" style={{ color: '#51355A' }}>
                            {parsed.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <Button
                          onClick={() => handleAddJob(job)}
                          className="text-white font-semibold rounded-xl"
                          style={{ backgroundColor: '#9E2B25' }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Dashboard
                        </Button>
                        {parsed.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl"
                            style={{ borderColor: '#51355A', color: '#51355A' }}
                          >
                            <a href={parsed.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View Job
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
