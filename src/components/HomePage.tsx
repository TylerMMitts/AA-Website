import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Upload, Zap, Chrome, Target, BarChart3, Star, Users, TrendingUp, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 border border-orange-200">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-orange-700">Save 20+ hours every week</span>
              </div>
              
              <h1 className="text-gray-900">
                Stop Searching, Start Succeeding. <span className="text-blue-600">Let AI Apply for You.</span>
              </h1>
              
              <p className="text-gray-600 text-lg">
                AutomateApply finds and applies to relevant jobs <span className="text-gray-900">24/7</span>, 
                so you can focus on preparing for interviews instead of filling out endless applications.
              </p>

              {/* Time saving highlight */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Average job application takes 45 minutes</p>
                    <p className="text-gray-600">Our AI does it in seconds. Apply to 100+ jobs while you sleep.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Get Started - It's Free
                </Button>
                <Button size="lg" variant="outline">
                  Watch the Demo
                </Button>
              </div>

              {/* Subtle social proof */}
              <p className="text-gray-600 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>Trusted by <span className="text-gray-900">50,000+ job seekers</span></span>
              </p>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg shadow-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzYyMzM2ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Job search dashboard"
                  className="w-full"
                />
                {/* Subtle accent overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent pointer-events-none"></div>
              </div>

              {/* Single floating stat - time saved */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-white p-4 shadow-xl border border-gray-100 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600">Time Saved This Month</p>
                    <p className="text-gray-900">32 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Three simple steps to automate your job search</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900">Set Your Profile</h3>
              <p className="text-gray-600">
                Tell us your experience and upload your resume. We'll handle the rest.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Chrome className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900">Install & Activate</h3>
              <p className="text-gray-600">
                Add our Chrome extension with one click. Takes less than 30 seconds.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900">Apply Automatically</h3>
              <p className="text-gray-600">
                Watch as we find and apply to jobs that match your criteria 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chrome Extension Spotlight */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-gray-900">Install the Extension in 30 Seconds</h2>
              <p className="text-gray-600 text-lg">
                Our powerful Chrome extension works seamlessly in the background while you focus on what matters.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662027067763-770376e710f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbWUlMjBleHRlbnNpb24lMjBicm93c2VyfGVufDF8fHx8MTc2MjM1Mzk5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Chrome extension"
                className="rounded-lg w-full"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Chrome className="mr-2 h-5 w-5" />
                  Add to Chrome
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 text-lg">Start free and upgrade as you grow</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Up to 10 applications/month</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Basic job search filters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Email support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={onGetStarted} variant="outline" className="w-full">
                  Choose Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For serious job seekers</CardDescription>
                <div className="mt-4">
                  <span className="text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited applications</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Advanced search filters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Analytics dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Cover letter templates</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={onGetStarted} className="w-full bg-blue-600 hover:bg-blue-700">
                  Choose Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For agencies & coaches</CardDescription>
                <div className="mt-4">
                  <span className="text-gray-900">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Everything in Pro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Multiple user accounts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">API access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Dedicated support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-white">Ready to Transform Your Job Search?</h2>
            <p className="text-blue-100 text-lg">
              Join thousands of professionals who have automated their job applications and landed their dream jobs faster.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Your Free Trial Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
