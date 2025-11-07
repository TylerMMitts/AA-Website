import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Building2, DollarSign, Clock, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
}

interface JobResultsProps {
  onJobApplied: (job: Job) => void;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    remote: 'Hybrid',
    salary: '$150k - $200k',
    postedDate: '2 days ago',
    description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and implementing scalable solutions...',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    remote: 'Remote',
    salary: '$120k - $160k',
    postedDate: '1 day ago',
    description: 'Join our product team to drive innovation and deliver exceptional user experiences. You will work cross-functionally with engineering, design...',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    remote: 'Hybrid',
    salary: '$100k - $140k',
    postedDate: '3 days ago',
    description: 'Looking for a passionate Full Stack Developer to help us build the next generation of our platform. Experience with React and Node.js required...',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'DesignFirst Co.',
    location: 'Seattle, WA',
    remote: 'On-Site',
    salary: '$110k - $150k',
    postedDate: '5 days ago',
    description: 'We need a talented Frontend Engineer who is passionate about creating beautiful, performant user interfaces. Strong React and TypeScript skills...',
    type: 'Full-time',
    level: 'Mid',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Boston, MA',
    remote: 'Remote',
    salary: '$130k - $170k',
    postedDate: '1 week ago',
    description: 'Join our DevOps team to build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines is essential...',
    type: 'Full-time',
    level: 'Senior',
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Chicago, IL',
    remote: 'Hybrid',
    salary: '$140k - $180k',
    postedDate: '4 days ago',
    description: 'We are seeking a Data Scientist to help us derive insights from large datasets and build predictive models. Strong Python and ML skills required...',
    type: 'Full-time',
    level: 'Senior',
  },
];

export function JobResults({ onJobApplied }: JobResultsProps) {
  const [jobStates, setJobStates] = useState<{ [key: string]: 'idle' | 'loading' | 'applied' }>(
    mockJobs.reduce((acc, job) => ({ ...acc, [job.id]: 'idle' }), {})
  );

  const handleAutoApply = async (job: Job) => {
    setJobStates({ ...jobStates, [job.id]: 'loading' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setJobStates({ ...jobStates, [job.id]: 'applied' });
    onJobApplied(job);
    toast.success(`Applied to ${job.title} at ${job.company}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Job Results</h1>
        <p className="text-gray-600">
          Found {mockJobs.length} matching positions
        </p>
      </div>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 mb-2">
                        <a 
                          href="#" 
                          className="hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {job.title}
                        </a>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{job.type}</Badge>
                        <Badge variant="outline">{job.level}</Badge>
                        {job.remote === 'Remote' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {job.remote}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                      {job.remote !== 'On-Site' && (
                        <span className="text-gray-500">• {job.remote}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 md:items-end">
                  {jobStates[job.id] === 'idle' && (
                    <Button
                      onClick={() => handleAutoApply(job)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Auto-Apply
                    </Button>
                  )}
                  {jobStates[job.id] === 'loading' && (
                    <Button disabled className="bg-blue-600">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </Button>
                  )}
                  {jobStates[job.id] === 'applied' && (
                    <Button disabled className="bg-green-600">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Applied!
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      View Original
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-2">
                {job.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" size="lg">
          Load More Results
        </Button>
      </div>
    </div>
  );
}
