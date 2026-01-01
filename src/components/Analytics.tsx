import { Dispatch, SetStateAction } from 'react';
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
  remote: string;
  salary: string;
  postedDate: string;
  description: string;
  type: string;
  level: string;
  url?: string;
  status: 'not applied' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  dateApplied?: string;
  dateAdded?: string;
}


interface AnalyticsProps {
  jobs: Job[];
  setJobs: Dispatch<SetStateAction<Job[]>>;
}

export function Analytics({ jobs, setJobs }: AnalyticsProps) {
  
  // Generate chart data from actual job applications
  const generateChartData = () => {
    // Filter jobs that have been applied to (not 'not applied')
    const appliedJobs = jobs.filter(job => job.status !== 'not applied');
    
    if (appliedJobs.length === 0) {
      return [];
    }

    // Parse dates and sort by application date
    const jobsWithDates = appliedJobs.map(job => {
      // Use dateApplied if available, otherwise fall back to dateAdded
      const dateStr = job.dateApplied || job.dateAdded;
      return {
        ...job,
        parsedDate: dateStr ? new Date(dateStr) : new Date()
      };
    }).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    // Group by date and create cumulative count
    const dateMap: { [key: string]: number } = {};
    let cumulativeCount = 0;

    jobsWithDates.forEach(job => {
      const dateKey = job.parsedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = 0;
      }
      dateMap[dateKey]++;
    });

    // Convert to chart data array with cumulative values
    const chartDataArray = Object.keys(dateMap).map(dateKey => {
      cumulativeCount += dateMap[dateKey];
      return {
        date: dateKey,
        applications: cumulativeCount
      };
    });

    // If we have less than 7 data points, pad with earlier dates showing 0
    if (chartDataArray.length > 0 && chartDataArray.length < 7) {
      const firstDate = jobsWithDates[0].parsedDate;
      const paddedData = [];
      
      for (let i = 6; i >= chartDataArray.length; i--) {
        const date = new Date(firstDate);
        date.setDate(date.getDate() - i);
        paddedData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          applications: 0
        });
      }
      
      return [...paddedData, ...chartDataArray];
    }

    return chartDataArray;
  };

  const chartData = generateChartData();

  const metrics = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interviewing').length,
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
      case 'interviewing':
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
        <h1 className="text-gray-900 mb-2">Analytics</h1>
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
            {chartData.length > 1 && (
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {chartData[chartData.length - 1].applications - 
                   (chartData.length > 1 ? chartData[chartData.length - 2].applications : 0)} 
                  {' '}recent applications
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
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
                  stroke="#51355a" 
                  strokeWidth={2}
                  dot={{ fill: '#51355a', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No application data yet</p>
                <p className="text-sm">Start applying to jobs to see your progress</p>
              </div>
            </div>
          )}
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
              <TabsTrigger value="interviewing">Interview ({metrics.interview})</TabsTrigger>
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

            <TabsContent value="interviewing" className="space-y-4 mt-6">
              {getJobsByStatus('interviewing').map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                />
              ))}
              {getJobsByStatus('interviewing').length === 0 && (
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
            {job.dateApplied 
              ? `Applied on ${new Date(job.dateApplied).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}`
              : `Posted ${job.postedDate}`
            }
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
              <SelectItem value="interviewing">Interview</SelectItem>
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
