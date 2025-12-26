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
    console.log('Making GET request...');
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Detailed debug logs
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response body:', responseText);

    if (!response.ok) {
      console.error('Error response:', responseText);
      
      if (response.status === 404) {
        throw new Error('User not found');
      }
      
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Success! Parsed user data:', data);

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