import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Upload, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from './firebase';
import { saveUserData } from '../functions/save_user_data';
import { getUserData } from '../functions/get_user_data';
import { UserCache } from '../utils/userCache';
import { rateLimiter, RATE_LIMITS } from '../utils/rateLimiter';

// Main component for user profile management
export function MyProfile() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    
    // Work Authorization
    authorizedToWorkInUS: false,
    requireVisa: false,
    over18: false,
    willingToRelocate: false,
    relocationDistance: '',
    
    // Professional Information
    expectedIncome: '',
    workExperiences: [] as Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      currentlyWorking: boolean;
      description: string;
      achievements: string;
    }>,
    projects: [] as Array<{
      id: string;
      name: string;
      description: string;
      technologies: string;
      link: string;
      startDate: string;
      endDate: string;
    }>,
    education: '',
    
    // Education Details
    major: '',
    gpa: '',
    collegeBeginYear: '',
    graduationYear: '',
    
    // Documents
    resumeFile: null as File | null,
    defaultCoverLetter: '',
    
    // Diversity & Demographics
    gender: 'prefer-not-to-say',
    ethnicity: 'prefer-not-to-say',
    hispanicOrLatino: 'prefer-not-to-say',
    veteranStatus: 'prefer-not-to-say',
    diversityDisclosure: 'prefer-not-to-say',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);

  // Helper functions for work experience
  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      achievements: '',
    };
    setFormData({ ...formData, workExperiences: [...formData.workExperiences, newExperience] });
  };

  const removeWorkExperience = (id: string) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.filter(exp => exp.id !== id)
    });
  };

  const updateWorkExperience = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  // Helper functions for projects
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
    };
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
  };

  const removeProject = (id: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter(proj => proj.id !== id)
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      projects: formData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  // Loads user profile data when component mounts or user changes
  useEffect(() => {
    loadUserProfile();
  }, [auth.currentUser]);

  const loadUserProfile = async () => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check cache first
      const cachedProfile = UserCache.get<any>(currentUser.uid, 'profile');
      if (cachedProfile && cachedProfile.formData) {
        // Merge cached data properly, ensuring all fields are set
        const mergedData = { ...formData };
        Object.keys(cachedProfile.formData).forEach(key => {
          const value = cachedProfile.formData[key];
          if (value !== undefined && value !== null) {
            mergedData[key] = value;
          }
        });
        setFormData(mergedData);
        
        if (cachedProfile.resumeUrl) {
          setExistingResumeUrl(cachedProfile.resumeUrl);
        }
        setIsLoading(false);
        toast.success('Profile loaded from cache!');
        return;
      }
      
      // Uses user_id from firebase to fetch user data
      const result = await getUserData(currentUser.uid);
      
      if (result.success && result.data) {
        const userData = result.data;
        console.log('Loaded user data:', userData);
        
        // Parses profile_data - handle both string and object formats
        let profileData = userData.profile_data;
        if (typeof profileData === 'string') {
          try {
            profileData = JSON.parse(profileData);
          } catch (parseError) {
            console.error('Error parsing profile_data:', parseError);
            profileData = {};
          }
        }
        
        // Store existing resume URL if available
        if (userData.resume_file_url) {
          setExistingResumeUrl(userData.resume_file_url);
          console.log('Existing resume URL:', userData.resume_file_url);
        }
        
        // Updates form with existing data
        setFormData(prev => ({
          ...prev,
          ...profileData,
          // Note: resumeFile is handled separately since it's a File object
        }));
        
        // Cache the loaded data
        UserCache.set(currentUser.uid, 'profile', {
          formData: profileData,
          resumeUrl: userData.resume_file_url
        });
        
        toast.success('Profile loaded successfully!');
      } else {
        console.log('No existing profile data found, starting with empty form');
        toast.info('No saved profile found. Please fill out your information.');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Handles when the user clicks "Save Profile", saves data to backend
  const handleSave = async () => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast.error('You must be logged in to save your profile');
      return;
    }

    // Validates required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    // Rate limit check
    const rateLimitKey = `${currentUser.uid}:save-profile`;
    const rateLimitResult = rateLimiter.check(rateLimitKey, RATE_LIMITS.SAVE_PROFILE);
    
    if (!rateLimitResult.allowed) {
      toast.error(rateLimitResult.message || 'Please wait before saving again');
      return;
    }

    setIsSaving(true);

    try {
      // Prepare profile data
      const { resumeFile, ...profileData } = formData;

      let resumeFileBase64 = null;
      
      // Convert file to base64 if a new resume is uploaded
      if (resumeFile) {
        try {
          console.log('Converting resume file to base64...');
          resumeFileBase64 = await fileToBase64(resumeFile);
          console.log('Resume converted to base64, size:', resumeFileBase64.length);
        } catch (error) {
          console.error('Error converting file to base64:', error);
          toast.error('Failed to process resume file');
          return;
        }
      }

      const result = await saveUserData({
        user_id: currentUser.uid,
        profile: profileData,
        resume_file: resumeFileBase64, // Send as base64 data
        resume_file_name: resumeFile?.name, // Send file name
      });

      if (result.success) {
        // Update existing resume URL if a new one was uploaded
        if (resumeFile && result.data?.resume_file_url) {
          setExistingResumeUrl(result.data.resume_file_url);
        }
        
        // Update cache
        UserCache.set(currentUser.uid, 'profile', {
          formData: profileData,
          resumeUrl: result.data?.resume_file_url || existingResumeUrl
        });
        
        toast.success('Profile saved successfully!');
      } else {
        toast.error(`Failed to save profile: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An unexpected error occurred while saving your profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, resumeFile: file });
      toast.success(`Resume uploaded: ${file.name}`);
    }
  };

  const handleDownloadResume = () => {
    if (existingResumeUrl) {
      window.open(existingResumeUrl, '_blank');
    }
  };

  const handleRemoveResume = () => {
    setFormData({ ...formData, resumeFile: null });
    setExistingResumeUrl(null);
    toast.info('Resume removed from form');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences for job applications
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Basic contact information for job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                placeholder="Johnny"
              />
              <p className="text-sm text-gray-500">The name you prefer to be called (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                >
                  <SelectTrigger id="countryCode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+91">+91 (India)</SelectItem>
                    <SelectItem value="+61">+61 (Australia)</SelectItem>
                    <SelectItem value="+49">+49 (Germany)</SelectItem>
                    <SelectItem value="+33">+33 (France)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>
              Your current residence address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="California"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal/Zip Code *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="94102"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Resume Display */}
            {existingResumeUrl && !formData.resumeFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">Resume already saved</p>
                      <p className="text-green-600 text-sm">Your resume is securely stored</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResume}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveResume}
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  {formData.resumeFile ? (
                    <>
                      <FileText className="h-12 w-12 text-green-600" />
                      <div>
                        <p className="text-green-600 font-medium">{formData.resumeFile.name}</p>
                        <p className="text-gray-500 mt-1">Ready to upload - click to change</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          {existingResumeUrl ? 'Upload new resume' : 'Upload your resume'}
                        </p>
                        <p className="text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Uploaded file actions */}
            {formData.resumeFile && (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, resumeFile: null })}
                >
                  Cancel
                </Button>
                <p className="text-sm text-gray-500 flex items-center">
                  File will be uploaded when you save your profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>
              Add your work history - the more detailed, the better we can tailor your resumes and cover letters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Pro Tip:</strong> The more work experiences you add with detailed achievements, 
                the better our AI can customize your resumes and cover letters for each specific job application.
              </p>
            </div>

            {formData.workExperiences.map((experience, index) => (
              <div key={experience.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Experience #{index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkExperience(experience.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      value={experience.title}
                      onChange={(e) => updateWorkExperience(experience.id, 'title', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateWorkExperience(experience.id, 'company', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={experience.location}
                    onChange={(e) => updateWorkExperience(experience.id, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateWorkExperience(experience.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateWorkExperience(experience.id, 'endDate', e.target.value)}
                      disabled={experience.currentlyWorking}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`currently-working-${experience.id}`}
                    checked={experience.currentlyWorking}
                    onCheckedChange={(checked) =>
                      updateWorkExperience(experience.id, 'currentlyWorking', checked as boolean)
                    }
                  />
                  <Label htmlFor={`currently-working-${experience.id}`} className="cursor-pointer font-normal">
                    I currently work here
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Achievements</Label>
                  <Textarea
                    value={experience.achievements}
                    onChange={(e) => updateWorkExperience(experience.id, 'achievements', e.target.value)}
                    placeholder="• Increased system performance by 40%&#10;• Led a team of 5 developers&#10;• Implemented new feature that generated $500K in revenue"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">Use bullet points for best results</p>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addWorkExperience}
              className="w-full border-dashed border-2"
            >
              <span className="text-xl mr-2">+</span>
              Add Work Experience
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Showcase your personal or professional projects - helps tailor applications for technical roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Pro Tip:</strong> Adding detailed projects demonstrates your practical skills and 
                passion, making your AI-generated resumes and cover letters more compelling and specific.
              </p>
            </div>

            {formData.projects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Project #{index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and inventory management..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    placeholder="React, Node.js, PostgreSQL, AWS"
                  />
                  <p className="text-sm text-gray-500">Separate with commas</p>
                </div>

                <div className="space-y-2">
                  <Label>Project Link (Optional)</Label>
                  <Input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date (or Expected)</Label>
                    <Input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addProject}
              className="w-full border-dashed border-2"
            >
              <span className="text-xl mr-2">+</span>
              Add Project
            </Button>
          </CardContent>
        </Card>

        {/* Education Information */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>
              Your educational background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Degree & University</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Bachelor of Science in Computer Science - University of California"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="3.5"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="collegeBeginYear">College Start Year</Label>
                <Input
                  id="collegeBeginYear"
                  type="text"
                  value={formData.collegeBeginYear}
                  onChange={(e) => setFormData({ ...formData, collegeBeginYear: e.target.value })}
                  placeholder="2014"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="2018"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedIncome">Expected Annual Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="expectedIncome"
                  type="text"
                  value={formData.expectedIncome}
                  onChange={(e) => setFormData({ ...formData, expectedIncome: e.target.value })}
                  placeholder="100,000"
                  className="pl-7"
                />
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Demographics & EEO Information */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics & EEO Information</CardTitle>
            <CardDescription>
              Optional demographic information for Equal Employment Opportunity reporting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hispanicOrLatino">Hispanic or Latino</Label>
                <Select
                  value={formData.hispanicOrLatino}
                  onValueChange={(value) => setFormData({ ...formData, hispanicOrLatino: value })}
                >
                  <SelectTrigger id="hispanicOrLatino">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Select
                value={formData.ethnicity}
                onValueChange={(value) => setFormData({ ...formData, ethnicity: value })}
              >
                <SelectTrigger id="ethnicity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american-indian">American Indian or Alaska Native (United States of America)</SelectItem>
                  <SelectItem value="asian">Asian (United States of America)</SelectItem>
                  <SelectItem value="black">Black or African American (United States of America)</SelectItem>
                  <SelectItem value="hawaiian">Native Hawaiian or Other Pacific Islander (United States of America)</SelectItem>
                  <SelectItem value="two-or-more">Two or More Races (United States of America)</SelectItem>
                  <SelectItem value="white">White (United States of America)</SelectItem>
                  <SelectItem value="prefer-not-to-say">I do not wish to answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="veteranStatus">Veteran Status</Label>
              <Select
                value={formData.veteranStatus}
                onValueChange={(value) => setFormData({ ...formData, veteranStatus: value })}
              >
                <SelectTrigger id="veteranStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protected-veteran">I identify as one or more of the classifications of protected veterans listed above</SelectItem>
                  <SelectItem value="veteran-not-protected">I identify as a veteran, just not a protected veteran</SelectItem>
                  <SelectItem value="not-veteran">I am not a veteran</SelectItem>
                  <SelectItem value="prefer-not-to-say">I do not wish to self-identify</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Work Authorization */}
        <Card>
          <CardHeader>
            <CardTitle>Work Authorization</CardTitle>
            <CardDescription>
              Legal work status and company relations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="over18"
                  checked={formData.over18}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, over18: checked as boolean })
                  }
                />
                <Label htmlFor="over18" className="cursor-pointer font-normal">
                  I am 18 years of age or older
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="authorizedToWork"
                  checked={formData.authorizedToWorkInUS}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, authorizedToWorkInUS: checked as boolean })
                  }
                />
                <Label htmlFor="authorizedToWork" className="cursor-pointer font-normal">
                  I am authorized to work in the United States
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireVisa"
                  checked={formData.requireVisa}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requireVisa: checked as boolean })
                  }
                />
                <Label htmlFor="requireVisa" className="cursor-pointer font-normal">
                  I require visa sponsorship
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="willingToRelocate"
                  checked={formData.willingToRelocate}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, willingToRelocate: checked as boolean })
                  }
                />
                <Label htmlFor="willingToRelocate" className="cursor-pointer font-normal">
                  I am willing to relocate
                </Label>
              </div>

              {formData.willingToRelocate && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="relocationDistance">Maximum relocation distance (miles)</Label>
                  <Input
                    id="relocationDistance"
                    type="text"
                    value={formData.relocationDistance}
                    onChange={(e) => setFormData({ ...formData, relocationDistance: e.target.value })}
                    placeholder="50"
                  />
                </div>
              )}
            </div>

            {/* Removed relativesEmployed and formerEmployee checkboxes */}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            style={{ backgroundColor: isSaving ? '#3e2846' : '#51355A', color: '#fff', border: 'none' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3e2846')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#51355A')}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}