import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cancelSubscription, formatRenewalDate } from '../utils/stripe';
import { auth } from './firebase';
import type { MembershipStatus } from '../utils/stripe';

interface CancelSubscriptionProps {
  onNavigate: (page: string) => void;
  membership: MembershipStatus | null;
  onRefreshMembership?: () => Promise<void>;
}

export function CancelSubscription({ onNavigate, membership, onRefreshMembership }: CancelSubscriptionProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const user = auth.currentUser;

  const handleConfirmCancel = async () => {
    if (!user?.uid) {
      toast.error('User not logged in');
      return;
    }

    if (!membership?.subscriptionId && !membership?.customerId) {
      toast.error('No subscription or customer information found');
      return;
    }

    setIsCanceling(true);
    try {
      await cancelSubscription(user.uid, membership.subscriptionId, membership.customerId);
      toast.success('Subscription will be canceled at the end of the billing period');
      
      // Small delay to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh membership status
      if (onRefreshMembership) {
        await onRefreshMembership();
      }
      
      // Navigate back to membership page
      onNavigate('membership');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleKeepPro = () => {
    onNavigate('membership');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('membership')}
            className="mb-4"
            style={{ color: '#51355A' }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Membership
          </Button>
        </div>

        <Card className="border-2" style={{ borderColor: '#9E2B25' }}>
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF3CD' }}>
              <AlertTriangle className="h-10 w-10" style={{ color: '#9E2B25' }} />
            </div>
            <CardTitle className="text-3xl mb-2" style={{ color: '#2A0C4E' }}>
              Cancel Pro Subscription?
            </CardTitle>
            <CardDescription className="text-lg">
              We're sorry to see you go
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E8FF', border: '1px solid #51355A' }}>
                <p className="text-sm" style={{ color: '#51355A' }}>
                  Your Pro features will remain active until the end of your current billing period
                  {membership?.currentPeriodEnd && (
                    <> on <strong>{formatRenewalDate(membership.currentPeriodEnd)}</strong></>
                  )}.
                  After that, you'll be downgraded to the Free plan.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold" style={{ color: '#2A0C4E' }}>
                  You'll lose access to:
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#51355A' }}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Unlimited job applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Advanced analytics and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>AI-powered resume optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Custom cover letter templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Job search automation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleKeepPro}
                disabled={isCanceling}
                className="flex-1 text-white font-semibold"
                style={{ backgroundColor: '#51355A' }}
                size="lg"
              >
                Keep Pro
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={isCanceling}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#9E2B25', color: '#9E2B25' }}
                size="lg"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  'Cancel Subscription'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
