import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Calendar, CreditCard, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getMembership } from '../functions/get_membership';
import { createCheckoutSession, cancelSubscription, formatRenewalDate } from '../utils/stripe';
import type { MembershipStatus } from '../utils/stripe';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function ProfileMenu({ isOpen, onClose, user }: ProfileMenuProps) {
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // Load membership status when dialog opens
  useEffect(() => {
    if (isOpen && user?.uid) {
      loadMembershipStatus();
    }
  }, [isOpen, user?.uid]);

  const loadMembershipStatus = async () => {
    setIsLoading(true);
    try {
      const response = await getMembership(user.uid);
      if (response.success && response.data) {
        setMembership(response.data);
      } else {
        toast.error('Failed to load membership status');
      }
    } catch (error) {
      console.error('Error loading membership:', error);
      toast.error('Failed to load membership status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true);
    try {
      const session = await createCheckoutSession(user.uid);
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start upgrade process');
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!membership?.subscriptionId) {
      toast.error('No active subscription found');
      return;
    }

    setIsCanceling(true);
    try {
      await cancelSubscription(user.uid, membership.subscriptionId);
      toast.success('Subscription will be canceled at the end of the billing period');
      setShowCancelDialog(false);
      // Reload membership status
      await loadMembershipStatus();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const proFeatures = [
    'Unlimited job applications',
    'Advanced analytics and insights',
    'Priority support',
    'AI-powered resume optimization',
    'Custom cover letter templates',
    'Job search automation',
  ];

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#2A0C4E' }}>
              Membership
            </DialogTitle>
            <DialogDescription>
              Manage your subscription and billing
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#51355A' }} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Plan Card */}
              <Card className="border-2" style={{ borderColor: membership?.isPro ? '#9E2B25' : '#51355A' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown
                        className="h-5 w-5"
                        style={{ color: membership?.isPro ? '#9E2B25' : '#51355A' }}
                      />
                      <CardTitle style={{ color: '#2A0C4E' }}>
                        {membership?.planName} Plan
                      </CardTitle>
                    </div>
                    <Badge
                      style={{
                        backgroundColor: membership?.isPro ? '#9E2B25' : '#51355A',
                        color: 'white',
                      }}
                    >
                      {membership?.isPro ? 'PRO' : 'FREE'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {membership?.price || '$0'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {membership?.isPro && (
                    <div className="space-y-3 text-sm" style={{ color: '#51355A' }}>
                      {membership.currentPeriodEnd && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {membership.cancelAtPeriodEnd
                              ? `Expires on ${formatRenewalDate(membership.currentPeriodEnd)}`
                              : `Renews on ${formatRenewalDate(membership.currentPeriodEnd)}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Subscription active</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pro Features or Upgrade Button */}
              {!membership?.isPro ? (
                <>
                  <div className="space-y-3">
                    <h3 className="font-semibold" style={{ color: '#2A0C4E' }}>
                      Upgrade to Pro for:
                    </h3>
                    <div className="space-y-2">
                      {proFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5" style={{ color: '#9E2B25' }} />
                          <span className="text-sm" style={{ color: '#51355A' }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleUpgradeToPro}
                    disabled={isUpgrading}
                    className="w-full text-white font-semibold"
                    style={{ backgroundColor: '#9E2B25' }}
                    size="lg"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Pro - $25/month
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {!membership.cancelAtPeriodEnd && (
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      variant="outline"
                      className="w-full"
                      style={{ borderColor: '#51355A', color: '#51355A' }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  {membership.cancelAtPeriodEnd && (
                    <div
                      className="p-4 rounded-lg text-sm"
                      style={{ backgroundColor: '#FFF8F0', color: '#51355A' }}
                    >
                      Your subscription will end on{' '}
                      {membership.currentPeriodEnd && formatRenewalDate(membership.currentPeriodEnd)}.
                      You'll continue to have Pro access until then.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Pro Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your Pro features will remain active until the end of your current billing period
              ({membership?.currentPeriodEnd && formatRenewalDate(membership.currentPeriodEnd)}).
              After that, you'll be downgraded to the Free plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>Keep Pro</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              style={{ backgroundColor: '#9E2B25', color: 'white' }}
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
