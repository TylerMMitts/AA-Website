// get_user_data.ts
interface GetUserDataResponse {
  success: boolean;
  statusCode: number;
  data?: any;
  error?: string;
}

const LAMBDA_GET_URL = import.meta.env.VITE_GET_USER_URL;

export async function getUserData(user_id: string): Promise<GetUserDataResponse> {

// Debug logs
//   console.log('=== GET USER FRONTEND DEBUG ===');
//   console.log('user_id:', user_id);
//   console.log('Lambda URL:', LAMBDA_GET_URL);

// Check if LAMBDA_GET_URL is defined
  if (!LAMBDA_GET_URL) {
    console.error('VITE_GET_USER_URL is not defined in environment variables');
    return {
      success: false,
      statusCode: 500,
      error: 'Lambda URL is not configured. Check your .env file.',
    };
  }

  // Constructs the full URL with query parameter for GET request
  const fullUrl = `${LAMBDA_GET_URL}?user_id=${encodeURIComponent(user_id)}`;
  
  // console.log('Full URL:', fullUrl);

  // Fetches user data from the backend
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Error fetching user data - status:', response.status);
      
      if (response.status === 404) {
        throw new Error('User not found');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(responseText);

    return {
      success: true,
      statusCode: response.status,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      success: false,
      statusCode: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}