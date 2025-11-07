import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Send, 
  Calendar, 
  Award, 
  XCircle, 
  Building2, 
  MapPin,
  ExternalLink,
  TrendingUp 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
}

const mockAppliedJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    dateApplied: '2025-11-01',
    status: 'interview',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    dateApplied: '2025-11-02',
    status: 'applied',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    dateApplied: '2025-10-28',
    status: 'offer',
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'DesignFirst Co.',
    location: 'Seattle, WA',
    dateApplied: '2025-10-25',
    status: 'rejected',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Boston, MA',
    dateApplied: '2025-10-30',
    status: 'interview',
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Chicago, IL',
    dateApplied: '2025-10-29',
    status: 'applied',
  },
];

const chartData = [
  { date: 'Oct 25', applications: 5 },
  { date: 'Oct 26', applications: 8 },
  { date: 'Oct 27', applications: 12 },
  { date: 'Oct 28', applications: 15 },
  { date: 'Oct 29', applications: 18 },
  { date: 'Oct 30', applications: 22 },
  { date: 'Oct 31', applications: 25 },
  { date: 'Nov 1', applications: 30 },
  { date: 'Nov 2', applications: 35 },
  { date: 'Nov 3', applications: 40 },
  { date: 'Nov 4', applications: 45 },
  { date: 'Nov 5', applications: 52 },
];

export function Analytics() {
  const [jobs, setJobs] = useState(mockAppliedJobs);

  const metrics = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus as Job['status'] } : job
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'offer':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track your job application journey
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Applications Sent</CardTitle>
            <Send className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{metrics.applied + metrics.interview + metrics.offer + metrics.rejected}</div>
            <p className="text-gray-500 mt-1">Total applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Interviews</CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{metrics.interview}</div>
            <p className="text-gray-500 mt-1">Scheduled interviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Offers</CardTitle>
            <Award className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{metrics.offer}</div>
            <p className="text-gray-500 mt-1">Job offers received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Rejections</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{metrics.rejected}</div>
            <p className="text-gray-500 mt-1">Not selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applications Over Time</CardTitle>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+15% this week</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
              <TabsTrigger value="applied">Applied ({metrics.applied})</TabsTrigger>
              <TabsTrigger value="interview">Interview ({metrics.interview})</TabsTrigger>
              <TabsTrigger value="offer">Offer ({metrics.offer})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({metrics.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
            </TabsContent>

            <TabsContent value="applied" className="space-y-4 mt-6">
              {getJobsByStatus('applied').map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
              {getJobsByStatus('applied').length === 0 && (
                <p className="text-center text-gray-500 py-8">No applications in this status</p>
              )}
            </TabsContent>

            <TabsContent value="interview" className="space-y-4 mt-6">
              {getJobsByStatus('interview').map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
              {getJobsByStatus('interview').length === 0 && (
                <p className="text-center text-gray-500 py-8">No applications in this status</p>
              )}
            </TabsContent>

            <TabsContent value="offer" className="space-y-4 mt-6">
              {getJobsByStatus('offer').map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
              {getJobsByStatus('offer').length === 0 && (
                <p className="text-center text-gray-500 py-8">No applications in this status</p>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-6">
              {getJobsByStatus('rejected').map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
              {getJobsByStatus('rejected').length === 0 && (
                <p className="text-center text-gray-500 py-8">No applications in this status</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, status: string) => void;
  getStatusColor: (status: string) => string;
}

function JobCard({ job, onStatusChange, getStatusColor }: JobCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{job.title}</h3>
              <div className="flex flex-col gap-1 text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Applied on {new Date(job.dateApplied).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <Select
            value={job.status}
            onValueChange={(value) => onStatusChange(job.id, value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                <Badge className={getStatusColor(job.status)} variant="secondary">
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <a 
            href="#" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Posting</span>
          </a>
        </div>
      </div>
    </div>
  );
}
