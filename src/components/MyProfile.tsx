import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MyProfile() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
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
    
    // Company Relations
    relativesEmployed: false,
    formerEmployee: false,
    
    // Professional Information
    expectedIncome: '',
    workExperience: '',
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

  const handleSave = () => {
    toast.success('Profile saved successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resumeFile: file });
      toast.success(`Resume uploaded: ${file.name}`);
    }
  };

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
            <div className="grid gap-4 md:grid-cols-2">
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
            <CardDescription>
              Upload your resume - we'll parse it to auto-fill applications
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        <p className="text-green-600">{formData.resumeFile.name}</p>
                        <p className="text-gray-500 mt-1">Click to upload a different file</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-700">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Your work experience and education background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workExperience">Work Experience</Label>
              <Textarea
                id="workExperience"
                value={formData.workExperience}
                onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                placeholder="Software Engineer at Tech Corp (2020-Present)&#10;Junior Developer at StartupXYZ (2018-2020)&#10;&#10;Describe your work history..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Bachelor of Science in Computer Science&#10;University of California, 2018&#10;&#10;List your educational background..."
                rows={4}
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

        {/* Cover Letter Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter Template</CardTitle>
            <CardDescription>
              Create a default cover letter that will be customized for each application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Default Cover Letter</Label>
              <Textarea
                id="coverLetter"
                value={formData.defaultCoverLetter}
                onChange={(e) => setFormData({ ...formData, defaultCoverLetter: e.target.value })}
                placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the [Position] role at [Company]...&#10;&#10;Use [Position] and [Company] as placeholders that will be auto-filled."
                rows={8}
              />
            </div>
            <p className="text-gray-600">
              Tip: Use [Position] and [Company] as placeholders that will be automatically replaced
            </p>
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

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relativesEmployed"
                  checked={formData.relativesEmployed}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, relativesEmployed: checked as boolean })
                  }
                />
                <Label htmlFor="relativesEmployed" className="cursor-pointer font-normal">
                  I have relatives currently employed at companies I'm applying to
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="formerEmployee"
                  checked={formData.formerEmployee}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, formerEmployee: checked as boolean })
                  }
                />
                <Label htmlFor="formerEmployee" className="cursor-pointer font-normal">
                  I am a former employee of companies I'm applying to
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
