// Stripe utility functions for frontend

export interface MembershipStatus {
  isPro: boolean;
  subscriptionId?: string | null;
  customerId?: string | null;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  planName: string;
  price?: string;
}

const CREATE_CHECKOUT_URL = import.meta.env.VITE_CREATE_CHECKOUT_URL || '';
const CANCEL_SUBSCRIPTION_URL = import.meta.env.VITE_CANCEL_SUBSCRIPTION_URL || '';

/**
 * Create a Stripe checkout session for Pro subscription
 */
export async function createCheckoutSession(userId: string): Promise<{ sessionId: string; url: string }> {
  const response = await fetch(CREATE_CHECKOUT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      success_url: `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/checkout-cancel`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Get user's membership status
 */
export async function getMembershipStatus(userId: string): Promise<MembershipStatus> {
  const response = await fetch(`${API_BASE_URL}/membership?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get membership status');
  }

  return response.json();
}

/**
 * Cancel user's subscription
 */
export async function cancelSubscription(userId: string, subscriptionId?: string | null, customerId?: string | null): Promise<void> {
  const response = await fetch(CANCEL_SUBSCRIPTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      subscription_id: subscriptionId,
      customer_id: customerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel subscription');
  }
}

/**
 * Format date for display
 */
export function formatRenewalDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
