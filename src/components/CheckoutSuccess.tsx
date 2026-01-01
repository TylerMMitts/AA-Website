import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, Loader2, Crown } from 'lucide-react';

interface CheckoutSuccessProps {
  onNavigate: (page: string) => void;
  onRefreshMembership?: () => Promise<void>;
}

export function CheckoutSuccess({ onNavigate, onRefreshMembership }: CheckoutSuccessProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session_id');
    setSessionId(session);
    
    // Refresh membership status after a short delay to allow webhook to process
    if (onRefreshMembership && !isRefreshing) {
      setIsRefreshing(true);
      const refreshMembership = async () => {
        // Wait 2 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          await onRefreshMembership();
        } catch (error) {
          console.error('Error refreshing membership:', error);
        } finally {
          setIsRefreshing(false);
        }
      };
      refreshMembership();
    }
  }, [onRefreshMembership, isRefreshing]);

  const handleNavigation = (page: string) => {
    // Clear URL parameters before navigating
    window.history.replaceState({}, '', window.location.pathname);
    onNavigate(page);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2" style={{ borderColor: '#9E2B25' }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#9E2B25' }}>
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2" style={{ color: '#2A0C4E' }}>
              Welcome to Pro!
            </CardTitle>
            <CardDescription className="text-lg">
              Your subscription has been activated successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: '#51355A' }}>
                <Crown className="h-6 w-6" style={{ color: '#9E2B25' }} />
                <span>You now have Pro access</span>
              </div>
              
              <div className="space-y-2 text-sm" style={{ color: '#51355A' }}>
                <p>✓ Unlimited job applications</p>
                <p>✓ Advanced analytics and insights</p>
                <p>✓ Priority support</p>
                <p>✓ AI-powered resume optimization</p>
                <p>✓ Custom cover letter templates</p>
                <p>✓ Job search automation</p>
              </div>

              {sessionId && (
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                  <p className="text-xs font-mono" style={{ color: '#51355A' }}>
                    Session ID: {sessionId}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => handleNavigation('dashboard')}
                className="flex-1 text-white font-semibold"
                style={{ backgroundColor: '#9E2B25' }}
                size="lg"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => handleNavigation('profile')}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#51355A', color: '#51355A' }}
                size="lg"
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
