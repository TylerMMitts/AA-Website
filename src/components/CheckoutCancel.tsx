import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

interface CheckoutCancelProps {
  onNavigate: (page: string) => void;
}

export function CheckoutCancel({ onNavigate }: CheckoutCancelProps) {
  const handleNavigation = (page: string) => {
    // Clear URL parameters before navigating
    window.history.replaceState({}, '', window.location.pathname);
    onNavigate(page);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2" style={{ borderColor: '#51355A' }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#51355A', opacity: 0.1 }}>
              <XCircle className="h-10 w-10" style={{ color: '#51355A' }} />
            </div>
            <CardTitle className="text-3xl mb-2" style={{ color: '#2A0C4E' }}>
              Checkout Canceled
            </CardTitle>
            <CardDescription className="text-lg">
              Your upgrade was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p style={{ color: '#51355A' }}>
                No charges were made to your account. You can upgrade to Pro anytime from your profile settings.
              </p>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#2A0C4E' }}>
                  Why upgrade to Pro?
                </p>
                <div className="space-y-1 text-sm text-left" style={{ color: '#51355A' }}>
                  <p>• Unlimited job applications</p>
                  <p>• Advanced analytics and insights</p>
                  <p>• Priority support</p>
                  <p>• AI-powered resume optimization</p>
                  <p>• Job search automation</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => handleNavigation('results')}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#51355A', color: '#51355A' }}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => handleNavigation('profile')}
                className="flex-1 text-white font-semibold"
                style={{ backgroundColor: '#9E2B25' }}
                size="lg"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
