// Frontend function to get user's membership status

import { MembershipStatus } from '../utils/stripe';

const MEMBERSHIP_API_URL = import.meta.env.VITE_GET_MEMBERSHIP_URL || '';

interface GetMembershipResponse {
  success: boolean;
  data?: MembershipStatus;
  error?: string;
}

export async function getMembership(userId: string): Promise<GetMembershipResponse> {
  if (!MEMBERSHIP_API_URL) {
    console.error('VITE_GET_MEMBERSHIP_URL is not defined in environment variables');
    return {
      success: false,
      error: 'Membership API URL is not configured',
    };
  }

  try {
    const response = await fetch(`${MEMBERSHIP_API_URL}?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get membership status');
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error getting membership:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
