import { useState, useEffect, useRef } from 'react';
import { saveUserData } from '../functions/save_user_data';
import { getUserData } from '../functions/get_user_data';
import { UserCache } from '../utils/userCache';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { MapPin, Building2, DollarSign, ExternalLink, CheckCircle2, Loader2, Plus, Sparkles, TrendingUp, Calendar, Briefcase, FileText } from 'lucide-react';
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
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
}

interface JobResultsProps {
  onJobApplied: (job: Job) => void;
}





interface JobResultsProps {
  onJobApplied: (job: Job) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  user?: any;
}

export function JobResults({ onJobApplied, jobs, setJobs, user }: JobResultsProps) {
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load applications from database on mount
  useEffect(() => {
    const loadApplications = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      // Check cache first using UserCache utility
      const cachedJobs = UserCache.get<Job[]>(user.uid, 'applications');
      if (cachedJobs) {
        setJobs(cachedJobs);
        setIsLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      // Load from database
      try {
        const response = await getUserData(user.uid);
        if (response.success && response.data?.applications_txt) {
          const applications = JSON.parse(response.data.applications_txt);
          setJobs(applications);
          
          // Update cache
          UserCache.set(user.uid, 'applications', applications);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    };

    loadApplications();
  }, [user?.uid]);

  // Save applications to database whenever jobs change
  useEffect(() => {
    const saveApplications = async () => {
      // Skip save if not loaded yet, or if loading, or already saving
      if (!hasLoadedRef.current || !user?.uid || isLoading || isSaving) return;

      setIsSaving(true);
      try {
        const applicationsJson = JSON.stringify(jobs);
        
        // Fetch current user data to get existing profile_data
        const currentData = await getUserData(user.uid);
        let existingProfile = {};
        
        if (currentData.success && currentData.data?.profile_data) {
          existingProfile = typeof currentData.data.profile_data === 'string' 
            ? JSON.parse(currentData.data.profile_data)
            : currentData.data.profile_data;
        }
        
        // Save with existing profile to satisfy NOT NULL constraint
        await saveUserData({
          user_id: user.uid,
          profile: existingProfile,
          applications_txt: applicationsJson
        });
        
        // Update cache
        UserCache.set(user.uid, 'applications', jobs);
      } catch (error) {
        console.error('Error saving applications:', error);
      } finally {
        setIsSaving(false);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveApplications, 1000);
    return () => clearTimeout(timeoutId);
  }, [jobs, user?.uid, isLoading]);

    // Redesigned stats as an array for easier mapping
    const stats = [
      {
        label: 'Total',
        value: jobs.length,
        icon: <Briefcase className="h-6 w-6" style={{ color: '#51355A', opacity: 0.3 }} />, 
        color: '#2A0C4E',
      },
      {
        label: 'Applied',
        value: jobs.filter(j => j.status === 'applied').length,
        icon: <FileText className="h-6 w-6" style={{ color: '#9E2B25', opacity: 0.3 }} />, 
        color: '#9E2B25',
      },
      {
        label: 'Interviews',
        value: jobs.filter(j => j.status === 'interviewing').length,
        icon: <TrendingUp className="h-6 w-6" style={{ color: '#51355A', opacity: 0.3 }} />, 
        color: '#51355A',
      },
      {
        label: 'Offers',
        value: jobs.filter(j => j.status === 'offer').length,
        icon: <CheckCircle2 className="h-6 w-6" style={{ color: '#9E2B25', opacity: 0.3 }} />, 
        color: '#9E2B25',
      },
    ];

    const handleAddJob = () => {
      // Add a new empty job in edit mode
      const newId = Date.now().toString();
      setJobs([
        {
          id: newId,
          title: '',
          company: '',
          location: '',
          salary: '',
          type: 'Full-time',
          level: 'Mid',
          remote: 'Hybrid',
          url: '',
          description: '',
          postedDate: 'Just now',
          status: 'applied',
        },
        ...jobs,
      ]);
      setEditingJobId(newId);
    };

    const handleSaveJob = (job: Job) => {
      if (!job.title || !job.company) {
        toast.error('Please fill in required fields (Title and Company)');
        return;
      }
      setJobs(jobs.map(j => (j.id === job.id ? { ...job, postedDate: 'Just now' } : j)));
      setEditingJobId(null);
      toast.success(`Added ${job.title} at ${job.company} to your dashboard!`);
    };

    const handleEditJobField = (id: string, field: keyof Job, value: string) => {
      setJobs(jobs.map(j => (j.id === id ? { ...j, [field]: value } : j)));
    };

    const handleStartAutomation = () => {
      toast.success(`Job search automation started! We'll find and add jobs matching: ${searchKeywords}`);
      setIsAutomationOpen(false);
      setSearchKeywords('');
    };

    const handleAutoApply = async (job: Job) => {
      // Simulate applying
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Applied to ${job.title} at ${job.company}`);
      onJobApplied(job);
    };

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2A0C4E' }}>
              Dashboard
            </h1>
            {/* Redesigned Compact Stats Cards */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm border border-solid"
                  style={{
                    borderColor: stat.color,
                    background: 'white',
                    minWidth: 120,
                    minHeight: 60,
                  }}
                >
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-xs font-medium mb-0.5" style={{ color: '#51355A' }}>{stat.label}</span>
                    <span className="text-2xl font-bold leading-tight" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <div className="ml-2">{stat.icon}</div>
                </div>
              ))}
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg"
                className="text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#9E2B25' }}
                onClick={handleAddJob}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Job Application
              </Button>
              {/* Job Search Automation - Pro Feature */}
              <Dialog open={isAutomationOpen} onOpenChange={setIsAutomationOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="font-semibold rounded-xl border-2"
                    style={{ borderColor: '#51355A', color: '#51355A' }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" style={{ color: '#9E2B25' }} />
                    Job Search Automation
                    <Badge className="ml-2 text-xs" style={{ backgroundColor: '#9E2B25', color: 'white' }}>PRO</Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-2 max-w-md" style={{ borderColor: '#51355A', backgroundColor: '#FFF8F0' }}>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6" style={{ color: '#9E2B25' }} />
                      <DialogTitle className="text-2xl" style={{ color: '#2A0C4E' }}>Job Search Automation</DialogTitle>
                    </div>
                    <DialogDescription style={{ color: '#51355A' }}>
                      Let AI find and add relevant jobs to your dashboard automatically.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keywords" style={{ color: '#51355A' }}>
                        Job Titles / Keywords
                      </Label>
                      <Input
                        id="keywords"
                        placeholder="e.g. Software Engineer, Product Manager"
                        value={searchKeywords}
                        onChange={(e) => setSearchKeywords(e.target.value)}
                        className="rounded-xl"
                      />
                      <p className="text-xs" style={{ color: '#51355A', opacity: 0.7 }}>
                        Separate multiple keywords with commas
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 space-y-2 border" style={{ borderColor: '#51355A', borderWidth: '1px' }}>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 mt-0.5" style={{ color: '#9E2B25' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#2A0C4E' }}>How it works</p>
                          <p className="text-xs" style={{ color: '#51355A' }}>
                            Our AI scans 100+ job boards daily, finds matching positions, and adds them to your dashboard ready for one-click applications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleStartAutomation}
                      disabled={!searchKeywords}
                      className="w-full text-white font-semibold rounded-xl"
                      style={{ backgroundColor: '#9E2B25' }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Automation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Job Listings or Empty State */}
          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#51355A', opacity: 0.1 }}>
                  <Briefcase className="h-10 w-10" style={{ color: '#51355A' }} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold" style={{ color: '#2A0C4E' }}>No applications yet</h2>
                  <p className="text-lg" style={{ color: '#51355A' }}>
                    Get started by adding your first job application or enabling automation.
                  </p>
                </div>
                <Button
                  onClick={handleAddJob}
                  className="text-white font-semibold rounded-xl"
                  style={{ backgroundColor: '#9E2B25' }}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Job
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow rounded-2xl border-2" style={{ borderColor: '#51355A' }}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {editingJobId === job.id ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="Job Title *"
                              value={job.title}
                              onChange={e => handleEditJobField(job.id, 'title', e.target.value)}
                              className="rounded-xl mb-2"
                            />
                            <Input
                              placeholder="Company *"
                              value={job.company}
                              onChange={e => handleEditJobField(job.id, 'company', e.target.value)}
                              className="rounded-xl mb-2"
                            />
                            <Input
                              placeholder="Location"
                              value={job.location}
                              onChange={e => handleEditJobField(job.id, 'location', e.target.value)}
                              className="rounded-xl mb-2"
                            />
                            <Input
                              placeholder="Salary"
                              value={job.salary}
                              onChange={e => handleEditJobField(job.id, 'salary', e.target.value)}
                              className="rounded-xl mb-2"
                            />
                            <Input
                              placeholder="Job URL"
                              value={job.url}
                              onChange={e => handleEditJobField(job.id, 'url', e.target.value)}
                              className="rounded-xl mb-2"
                            />
                            <Textarea
                              placeholder="Description (Optional)"
                              value={job.description}
                              onChange={e => handleEditJobField(job.id, 'description', e.target.value)}
                              className="rounded-xl min-h-[60px] mb-2"
                            />
                            <div className="flex gap-2">
                              <Select value={job.type} onValueChange={v => handleEditJobField(job.id, 'type', v)}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Full-time">Full-time</SelectItem>
                                  <SelectItem value="Part-time">Part-time</SelectItem>
                                  <SelectItem value="Contract">Contract</SelectItem>
                                  <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select value={job.level} onValueChange={v => handleEditJobField(job.id, 'level', v)}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Level" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Entry">Entry</SelectItem>
                                  <SelectItem value="Mid">Mid</SelectItem>
                                  <SelectItem value="Senior">Senior</SelectItem>
                                  <SelectItem value="Lead">Lead</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select value={job.remote} onValueChange={v => handleEditJobField(job.id, 'remote', v)}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Remote" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Remote">Remote</SelectItem>
                                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                                  <SelectItem value="On-Site">On-Site</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select value={job.status} onValueChange={v => handleEditJobField(job.id, 'status', v)}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="applied">Applied</SelectItem>
                                  <SelectItem value="interviewing">Interviewing</SelectItem>
                                  <SelectItem value="offer">Offer</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="mt-2 text-white font-semibold rounded-xl"
                              style={{ backgroundColor: '#9E2B25' }}
                              onClick={() => handleSaveJob(job)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <>
                            <CardTitle className="text-2xl mb-3" style={{ color: '#2A0C4E' }}>
                              {job.url ? (
                                <a 
                                  href={job.url} 
                                  className="hover:underline transition-all"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {job.title}
                                </a>
                              ) : (
                                job.title
                              )}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="rounded-full" style={{ backgroundColor: '#51355A', color: 'white' }}>{job.type}</Badge>
                              <Badge variant="outline" className="rounded-full" style={{ borderColor: '#51355A', color: '#51355A' }}>{job.level}</Badge>
                              {job.remote === 'Remote' && (
                                <Badge className="rounded-full" style={{ backgroundColor: '#9E2B25', color: 'white' }}>
                                  {job.remote}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col gap-3" style={{ color: '#51355A' }}>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              {job.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                  {job.remote !== 'On-Site' && (
                                    <span style={{ opacity: 0.7 }}>• {job.remote}</span>
                                  )}
                                </div>
                              )}
                              {job.salary && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{job.salary}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Added {job.postedDate}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <Badge 
                          className="rounded-full px-4 py-1 w-fit"
                          style={{ 
                            backgroundColor: job.status === 'offer' ? '#9E2B25' : '#51355A', 
                            color: 'white' 
                          }}
                        >
                          {job.status === 'applied' && 'Applied'}
                          {job.status === 'interviewing' && 'Interviewing'}
                          {job.status === 'offer' && 'Offer Received'}
                          {job.status === 'rejected' && 'Not Selected'}
                        </Badge>
                        {editingJobId !== job.id && job.url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="rounded-xl"
                            style={{ borderColor: '#51355A', color: '#51355A' }}
                          >
                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View Job
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {editingJobId !== job.id && job.description && (
                    <CardContent>
                      <p className="line-clamp-2" style={{ color: '#51355A' }}>
                        {job.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
    
