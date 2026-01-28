import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, Calendar, CreditCard, Loader2, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getMembership } from '../functions/get_membership';
import { createCheckoutSession, formatRenewalDate } from '../utils/stripe';
import type { MembershipStatus } from '../utils/stripe';
import { auth } from './firebase';

interface MembershipProps {
  onNavigate: (page: string) => void;
  membership?: MembershipStatus | null;
}

export default function Membership({ onNavigate, membership: membershipProp }: MembershipProps) {
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (user?.uid && !membershipProp) {
      loadMembershipStatus();
    } else if (membershipProp) {
      setMembership(membershipProp);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, membershipProp]);

  const refreshMembershipStatus = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      const response = await getMembership(user.uid);
      if (response.success && response.data) {
        console.log('Refreshed membership data:', response.data);
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
    if (!user?.uid) return;
    
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

  const handleCancelClick = () => {
    // Navigate to cancel subscription page
    onNavigate('cancel-subscription');
  };

  const proFeatures = [
    'Unlimited job applications',
    'Advanced analytics and insights',
    'Priority support',
    'AI-powered resume optimization',
    'Custom cover letter templates',
    'Job search automation',
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#2A0C4E' }}>
            Membership
          </h1>
          <p style={{ color: '#51355A' }}>
            Manage your subscription and billing
          </p>
        </div>

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
              <Card className="border-2" style={{ borderColor: '#51355A' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#2A0C4E' }}>
                    Upgrade to Pro
                  </CardTitle>
                  <CardDescription>
                    Unlock all premium features for $25/month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {proFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5" style={{ color: '#9E2B25' }} />
                        <span className="text-sm" style={{ color: '#51355A' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
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
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2" style={{ borderColor: '#51355A' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#2A0C4E' }}>
                    Manage Subscription
                  </CardTitle>
                  <CardDescription>
                    Cancel or modify your Pro subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!membership.cancelAtPeriodEnd ? (
                    <Button
                      onClick={handleCancelClick}
                      variant="outline"
                      className="w-full"
                      style={{ borderColor: '#51355A', color: '#51355A' }}
                    >
                      Cancel Subscription
                    </Button>
                  ) : (
                    <div
                      className="p-4 rounded-lg text-sm"
                      style={{ backgroundColor: '#FFF8F0', border: '1px solid #51355A', color: '#51355A' }}
                    >
                      {membership.currentPeriodEnd ? (
                        <>
                          Your subscription will end on{' '}
                          <strong>{formatRenewalDate(membership.currentPeriodEnd)}</strong>.
                          You'll continue to have Pro access until then.
                        </>
                      ) : (
                        <>
                          {console.log('No currentPeriodEnd found. Membership data:', membership)}
                          Your subscription has been cancelled and will end at the end of the current billing period.
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
