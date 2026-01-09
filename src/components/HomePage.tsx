import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Chrome, Zap, Target, TrendingUp, Sparkles, Award, Shield } from 'lucide-react';
import logo from '../assets/logo.png';
import showcaseVideo from '../assets/applyapplydemo.mp4';

interface HomePageProps {
  onGetStarted: () => void;
  onNavigate?: (page: string) => void;
}

export function HomePage({ onGetStarted, onNavigate }: HomePageProps) {
  return (
    <div className="w-full" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Hero Section with Organic Wavy Background */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: '#FFF8F0' }}>
        {/* Organic Wavy Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path 
              d="M0,320 C320,380 420,220 720,280 C1020,340 1120,180 1440,240 L1440,0 L0,0 Z" 
              fill="#51355A" 
              fillOpacity="0.05"
              className="animate-wave"
            />
            <path 
              d="M0,480 C360,420 540,540 840,480 C1140,420 1320,540 1440,480 L1440,800 L0,800 Z" 
              fill="#9E2B25" 
              fillOpacity="0.03"
            />
          </svg>
          
          {/* Floating Accent Circles */}
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full" 
               style={{ background: 'radial-gradient(circle, rgba(158,43,37,0.1) 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full" 
               style={{ background: 'radial-gradient(circle, rgba(81,53,90,0.08) 0%, transparent 70%)' }}></div>
        </div>

        {/* Logo and Hero Title at the very top */}
        <div className="w-full flex flex-col items-center z-20 relative pt-8 space-y-6" style={{ marginBottom: '14rem', marginTop: '-4rem' }}>
          <img src={logo} alt="ApplyApply Logo" style={{ height: '8em', width: 'auto' }} />
          <h2 className="text-3xl md:text-4xl font-medium mt-0 mb-4" style={{ color: '#2A0C4E', fontStyle: 'italic', fontFamily: 'Inter', fontSize: '2.5em', marginTop: '-2rem' }}>
            Make applying for jobs{' '}
            <span style={{ fontFamily: 'Great Vibes, cursive', fontStyle: 'italic', color: '#9E2B25', fontSize: '2.5em' }}>
              effortless
            </span>
          </h2>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-7xl mx-auto">
            {/* Left: Hero Content */}
            <div className="space-y-8" style={{ marginTop: '-22rem', fontSize: '1.35em', lineHeight: 1.25 }}>
              <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}
              </style>
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border-2" 
                   style={{ backgroundColor: '#FFF8F0', borderColor: '#9E2B25', color: '#9E2B25' }}>
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold text-sm">Automate your job search today</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight" style={{ color: '#2A0C4E' }}>
                Land your dream job <span style={{ color: '#9E2B25' }}>faster.</span>
              </h1>
              
              <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#51355A' }}>
                ApplyApply automates job applications so you can focus on what matters—preparing for interviews.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#9E2B25', color: '#FFF8F0' }}
                >
                  Get Started Free
                </Button>
              </div>

              {/* Extension CTA */}
              <div className="flex items-center gap-3 pt-4">
                <Chrome className="h-6 w-6" style={{ color: '#51355A' }} />
                <a 
                  href="https://chromewebstore.google.com/detail/mkgkcelaeaehnhoobgnpmhaoeonhlegf?utm_source=item-share-cb" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href="https://chromewebstore.google.com/detail/mkgkcelaeaehnhoobgnpmhaoeonhlegf?utm_source=item-share-cb" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lg font-medium hover:underline"
                  style={{ color: '#51355A' }}
                >
                  Install Chrome Extension →
                </a>
              </div>
            </div>

            {/* Right: Video demo*/}
            <div className="relative flex items-center justify-center">
              <video 
                src={showcaseVideo}
                className="rounded-3xl" 
                style={{ borderColor: '#51355A', borderStyle: 'solid', borderWidth: '3px', maxWidth: '100%', height: 'auto', background: '#fff', transform: 'translateY(-10em)' }}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-white min-h-[900px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2A0C4E' }}>
              Choose Your Plan
            </h2>
            <p className="text-xl" style={{ color: '#51355A' }}>
              Start free. Upgrade when you're ready.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="rounded-3xl border-2 overflow-hidden hover:shadow-xl transition-shadow" style={{ borderColor: '#51355A' }}>
              <CardHeader className="space-y-4 pb-8" style={{ backgroundColor: '#FFF8F0' }}>
                <div className="space-y-2">
                  <CardTitle className="text-3xl" style={{ color: '#51355A', fontWeight: 'bold' }}>Free</CardTitle>
                  <CardDescription className="text-base" style={{ color: '#51355A', opacity: 0.7 }}>
                    Perfect for getting started
                  </CardDescription>
                </div>
                <div>
                  <span className="text-5xl font-bold" style={{ color: '#2A0C4E' }}>$0</span>
                  <span className="text-xl ml-2" style={{ color: '#51355A' }}>/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-8 pb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg" style={{ color: '#51355A' }}>Basic application management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg" style={{ color: '#51355A' }}>Chrome extension with basic automation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg" style={{ color: '#51355A' }}>Manual job entry</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg" style={{ color: '#51355A' }}>Application tracking</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-8">
                <Button 
                  onClick={onGetStarted}
                  className="w-full text-lg py-6 rounded-xl font-semibold"
                  variant="outline"
                  style={{ borderColor: '#51355A', borderWidth: '2px', color: '#51355A' }}
                >
                  Get Started Free
                </Button>
              </CardFooter>
            </Card>

            {/* Paid Plan */}
            <Card className="rounded-3xl border-4 overflow-hidden relative" style={{ borderColor: '#51355A', borderWidth: '2px', minHeight: 500 }}>
              
              <CardHeader className="space-y-4 pb-8" style={{ backgroundColor: '#51355A' }}>
                <div className="space-y-2">
                  <CardTitle className="text-3xl text-white" style={{ fontWeight: 'bold' }}>Pro</CardTitle>
                  <CardDescription className="text-base text-white opacity-90">
                    Everything you need to succeed
                  </CardDescription>
                </div>
                <div>
                  <span className="text-5xl font-bold text-white">$20</span>
                  <span className="text-xl ml-2 text-white opacity-90">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-8 pb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg font-semibold" style={{ color: '#2A0C4E' }}>Everything in Free, PLUS:</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <div>
                      <p className="text-lg font-semibold" style={{ color: '#51355A' }}>Job Search Automation</p>
                      <p className="text-sm opacity-70" style={{ color: '#51355A' }}>
                        Automatically find and add relevant jobs to your dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <div>
                      <p className="text-lg font-semibold" style={{ color: '#51355A' }}>AI Resume & Cover Letter</p>
                      <p className="text-sm opacity-70" style={{ color: '#51355A' }}>
                        Custom-tailored for each application
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 mt-0-5 flex-shrink-0" style={{ color: '#9E2B25' }} />
                    <span className="text-lg" style={{ color: '#51355A' }}>Unlimited applications</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-8">
                <Button 
                  onClick={onGetStarted}
                  className="w-full text-lg py-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#9E2B25' }}
                >
                  Upgrade to Pro
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section className="py-24" style={{ backgroundColor: '#FFF8F0', minHeight: 400, paddingTop: 64, paddingBottom: 64 }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2A0C4E' }}>
              How ApplyApply Works
            </h2>
            <p className="text-xl" style={{ color: '#51355A' }}>
              Three simple steps to automate your job search
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg" 
                   style={{ backgroundColor: '#51355A' }}>
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold" style={{ color: '#2A0C4E' }}>1. Set Your Profile</h3>
                <p className="text-lg" style={{ color: '#51355A' }}>
                  Add your experience, skills, and job preferences. Takes just 5 minutes.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg" 
                   style={{ backgroundColor: '#9E2B25' }}>
                <Chrome className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold" style={{ color: '#2A0C4E' }}>2. Install Extension</h3>
                <p className="text-lg" style={{ color: '#51355A' }}>
                  One-click install. Our Chrome extension does the heavy lifting for you.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg" 
                   style={{ backgroundColor: '#51355A' }}>
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold" style={{ color: '#2A0C4E' }}>3. Watch It Work</h3>
                <p className="text-lg" style={{ color: '#51355A' }}>
                  Sit back as ApplyApply finds and applies to jobs 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - replaced with small footer */}
      <section className="py-4" style={{ backgroundColor: '#2A0C4E' }}>
        <div className="container mx-auto px-4 text-center space-y-2">
          <span style={{ color: '#FFF8F0', fontSize: '1.25rem', fontWeight: 600 }}>
            Mitts Technology LLC
          </span>
          <div>
            <Button
              onClick={() => onNavigate?.('privacy')}
              variant="link"
              className="text-sm"
              style={{ color: '#FFF8F0' }}
            >
              Privacy
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
