interface SaveUserDataParams {
  user_id: string;
  profile?: any;  // Make profile optional
  resume_file?: string;
  resume_file_name?: string;
  applications_txt?: string;
}

interface SaveUserDataResponse {
  success: boolean;
  statusCode: number;
  data?: any;
  error?: string;
}

const LAMBDA_URL = import.meta.env.VITE_SAVE_DATA_URL;

export async function saveUserData(
  params: SaveUserDataParams
): Promise<SaveUserDataResponse> {
  const { user_id, profile, resume_file, resume_file_name, applications_txt } = params;

  // Debug logs
  // console.log('=== FRONTEND DEBUG ===');
  // console.log('user_id:', user_id);
  // console.log('profile:', profile);
  // console.log('Lambda URL:', LAMBDA_URL);

  // Check if LAMBDA_URL is defined
  if (!LAMBDA_URL) {
    console.error('VITE_SAVE_DATA_URL is not defined in environment variables');
    return {
      success: false,
      statusCode: 500,
      error: 'Lambda URL is not configured. Check your .env file.',
    };
  }

  // Creates requestBody object, which will be sent in the body of the POST request
  const requestBody: any = {
    user_id: user_id,
  };
  
  // Only include fields that are provided (not undefined)
  if (profile !== undefined) {
    requestBody.profile_data = profile;
  }
  if (resume_file !== undefined) {
    requestBody.resume_file_url = resume_file;
  }
  if (resume_file_name !== undefined) {
    requestBody.resume_file_name = resume_file_name;
  }
  if (applications_txt !== undefined) {
    requestBody.applications_txt = applications_txt;
  }

  console.log('Request body:', requestBody);
  console.log('Stringified body:', JSON.stringify(requestBody));

  try {
    console.log('Making POST request with JSON body...');
    
    // Fetches to save user data to the backend
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Sends the request body as a JSON string
      body: JSON.stringify(requestBody) 
    });

    // Detailed debug logs
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Success! Response data:', data);

    return {
      success: true,
      statusCode: response.status,
      data: data,
    };
  } catch (error) {
    console.error('Error saving user data:', error);
    return {
      success: false,
      statusCode: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}