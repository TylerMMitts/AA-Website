import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Slider } from './ui/slider';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface JobSearchProps {
  onSearch: (searchParams: any) => void;
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: '',
    company: '',
    experienceLevels: {
      entry: false,
      mid: false,
      senior: false,
      executive: false,
    },
    jobTypes: {
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
    },
    remotePolicy: 'any',
    salaryRange: [0, 200],
    postedDate: 'any',
  });

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Job Search</h1>
        <p className="text-gray-600">
          Define your ideal job criteria and let AI find the perfect matches
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
        {/* Basic Search */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keywords">Job Title or Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g., Software Engineer, Product Manager"
                value={searchParams.keywords}
                onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <Button onClick={handleSearch} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            <Search className="mr-2 h-5 w-5" />
            Search Jobs
          </Button>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Advanced Filters</span>
              {isAdvancedOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-6">
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Google, Microsoft"
                value={searchParams.company}
                onChange={(e) => setSearchParams({ ...searchParams, company: e.target.value })}
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label>Experience Level</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="entry"
                    checked={searchParams.experienceLevels.entry}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        experienceLevels: { ...searchParams.experienceLevels, entry: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="entry" className="cursor-pointer">
                    Entry Level
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mid"
                    checked={searchParams.experienceLevels.mid}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        experienceLevels: { ...searchParams.experienceLevels, mid: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="mid" className="cursor-pointer">
                    Mid Level
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="senior"
                    checked={searchParams.experienceLevels.senior}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        experienceLevels: { ...searchParams.experienceLevels, senior: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="senior" className="cursor-pointer">
                    Senior
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="executive"
                    checked={searchParams.experienceLevels.executive}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        experienceLevels: { ...searchParams.experienceLevels, executive: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="executive" className="cursor-pointer">
                    Executive
                  </Label>
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-3">
              <Label>Job Type</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fullTime"
                    checked={searchParams.jobTypes.fullTime}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        jobTypes: { ...searchParams.jobTypes, fullTime: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="fullTime" className="cursor-pointer">
                    Full-time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partTime"
                    checked={searchParams.jobTypes.partTime}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        jobTypes: { ...searchParams.jobTypes, partTime: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="partTime" className="cursor-pointer">
                    Part-time
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contract"
                    checked={searchParams.jobTypes.contract}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        jobTypes: { ...searchParams.jobTypes, contract: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="contract" className="cursor-pointer">
                    Contract
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internship"
                    checked={searchParams.jobTypes.internship}
                    onCheckedChange={(checked) =>
                      setSearchParams({
                        ...searchParams,
                        jobTypes: { ...searchParams.jobTypes, internship: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="internship" className="cursor-pointer">
                    Internship
                  </Label>
                </div>
              </div>
            </div>

            {/* Remote Policy */}
            <div className="space-y-2">
              <Label htmlFor="remote">Remote Policy</Label>
              <Select
                value={searchParams.remotePolicy}
                onValueChange={(value) => setSearchParams({ ...searchParams, remotePolicy: value })}
              >
                <SelectTrigger id="remote">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="onsite">On-Site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div className="space-y-3">
              <Label>Salary Range (in thousands)</Label>
              <div className="px-2">
                <Slider
                  min={0}
                  max={300}
                  step={10}
                  value={searchParams.salaryRange}
                  onValueChange={(value) => setSearchParams({ ...searchParams, salaryRange: value })}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">${searchParams.salaryRange[0]}k</span>
                <span className="text-gray-600">${searchParams.salaryRange[1]}k+</span>
              </div>
            </div>

            {/* Posted Date */}
            <div className="space-y-2">
              <Label htmlFor="posted">Posted Date</Label>
              <Select
                value={searchParams.postedDate}
                onValueChange={(value) => setSearchParams({ ...searchParams, postedDate: value })}
              >
                <SelectTrigger id="posted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="3d">Last 3 days</SelectItem>
                  <SelectItem value="7d">Last week</SelectItem>
                  <SelectItem value="30d">Last month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
