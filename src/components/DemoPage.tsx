import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle2, Upload, Settings, Zap, BarChart3, MousePointerClick } from 'lucide-react';

interface DemoPageProps {
  onGetStarted: () => void;
}

export function DemoPage({ onGetStarted }: DemoPageProps) {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold" style={{ color: '#2A0C4E' }}>
            See ApplyApply in Action
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#51355A' }}>
            Watch how ApplyApply automates your entire job search process—from finding jobs to submitting applications.
          </p>
        </div>

        {/* Step-by-Step Demo */}
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Step 1 */}
          <Card className="overflow-hidden border-2 rounded-3xl" style={{ borderColor: '#51355A' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 flex flex-col justify-center space-y-6" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white text-2xl"
                       style={{ backgroundColor: '#9E2B25' }}>
                    1
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: '#2A0C4E' }}>Create Your Profile</h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: '#51355A' }}>
                  Set up your profile with your work experience, education, skills, and job preferences. 
                  Our AI learns what makes you unique and tailors applications accordingly.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Add work experience & education</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Upload resume & portfolio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Set job preferences & filters</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-10 flex items-center justify-center" style={{ backgroundColor: '#51355A' }}>
                <div className="relative w-full aspect-square max-w-sm">
                  <Upload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 opacity-20 text-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <Settings className="h-20 w-20 mx-auto" />
                      <p className="text-xl font-semibold">Profile Setup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="overflow-hidden border-2 rounded-3xl" style={{ borderColor: '#51355A' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-white p-10 flex items-center justify-center order-2 md:order-1" style={{ backgroundColor: '#9E2B25' }}>
                <div className="relative w-full aspect-square max-w-sm">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <MousePointerClick className="h-20 w-20 mx-auto" />
                      <p className="text-xl font-semibold">One-Click Install</p>
                      <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                        <div className="h-3 w-3 rounded-full bg-white"></div>
                        <div className="h-3 w-3 rounded-full bg-white opacity-60"></div>
                        <div className="h-3 w-3 rounded-full bg-white opacity-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 flex flex-col justify-center space-y-6 order-1 md:order-2" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white text-2xl"
                       style={{ backgroundColor: '#9E2B25' }}>
                    2
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: '#2A0C4E' }}>Install the Extension</h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: '#51355A' }}>
                  Add our powerful Chrome extension with a single click. It integrates seamlessly with job boards 
                  and automatically fills out applications based on your profile.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Works on 100+ job boards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Automatic form detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Smart field mapping</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="overflow-hidden border-2 rounded-3xl" style={{ borderColor: '#51355A' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 flex flex-col justify-center space-y-6" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white text-2xl"
                       style={{ backgroundColor: '#9E2B25' }}>
                    3
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: '#2A0C4E' }}>Automate Applications</h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: '#51355A' }}>
                  ApplyApply finds relevant jobs and applies automatically. Watch applications submit while you 
                  focus on interview prep. Our AI customizes each application for maximum success.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Automatic job discovery (Pro)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Smart form filling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Custom resumes & cover letters (Pro)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-10 flex items-center justify-center" style={{ backgroundColor: '#51355A' }}>
                <div className="relative w-full aspect-square max-w-sm">
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 opacity-20 text-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <Zap className="h-20 w-20 mx-auto animate-pulse" />
                      <p className="text-xl font-semibold">Automation Active</p>
                      <div className="text-sm opacity-90">47 applications this week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="overflow-hidden border-2 rounded-3xl" style={{ borderColor: '#51355A' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-white p-10 flex items-center justify-center order-2 md:order-1" style={{ backgroundColor: '#9E2B25' }}>
                <div className="relative w-full aspect-square max-w-sm">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-6">
                      <BarChart3 className="h-20 w-20 mx-auto" />
                      <div className="space-y-2">
                        <p className="text-xl font-semibold">Track Your Progress</p>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div>
                            <div className="text-3xl font-bold">47</div>
                            <div className="text-xs opacity-80">Applied</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">12</div>
                            <div className="text-xs opacity-80">Interviews</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">3</div>
                            <div className="text-xs opacity-80">Offers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 flex flex-col justify-center space-y-6 order-1 md:order-2" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white text-2xl"
                       style={{ backgroundColor: '#9E2B25' }}>
                    4
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: '#2A0C4E' }}>Track & Optimize</h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: '#51355A' }}>
                  Monitor all your applications in one dashboard. See what's working, track interview invites, 
                  and optimize your strategy with powerful analytics.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Centralized dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Application status tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span style={{ color: '#51355A' }}>Success analytics (Pro)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2A0C4E' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl" style={{ color: '#51355A' }}>
            Join thousands of job seekers who've automated their way to success.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="text-lg px-10 py-7 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all text-white"
            style={{ backgroundColor: '#9E2B25' }}
          >
            Start Free Today
          </Button>
        </div>
      </div>
    </div>
  );
}
