import requests
from typing import Dict, Any, Optional
import json


def save_user_data(
    user_id: str,
    profile: Dict[str, Any],
    resume_file_url: Optional[str] = None,
    resume_file_name: Optional[str] = None,
    lambda_url: str = "YOUR_LAMBDA_FUNCTION_URL"
) -> Dict[str, Any]:
    """
    Send user profile data to Lambda function via GET request. The DB schema expects:
      - user_id (string)
      - profile_data (text/json)
      - resume_file_url (optional)
      - resume_file_name (optional)

    This function packages the entire profile dict as JSON into the `profile_data` query
    parameter and sends it along with user_id and resume fields.

    Args:
        user_id: Unique identifier for the user
        profile: Dictionary with all profile fields (see MyProfile component structure)
        resume_file_url: Public URL to the resume file (optional)
        resume_file_name: Resume filename (optional)
        lambda_url: URL of your Lambda function endpoint

    Returns:
        Dictionary containing the response from Lambda function
    """

    params: Dict[str, Any] = {
        'user_id': user_id,
        # profile_data must be a JSON string
        'profile_data': json.dumps(profile, separators=(',', ':'))
    }

    if resume_file_url:
        params['resume_file_url'] = resume_file_url
    if resume_file_name:
        params['resume_file_name'] = resume_file_name

    try:
        response = requests.get(lambda_url, params=params, timeout=30)
        response.raise_for_status()

        # Try to parse JSON response if present
        data = {}
        if response.text:
            try:
                data = response.json()
            except ValueError:
                data = {'raw': response.text}

        return {'success': True, 'status_code': response.status_code, 'data': data}

    except requests.exceptions.Timeout:
        return {'success': False, 'error': 'Request timed out', 'status_code': 408}
    except requests.exceptions.RequestException as e:
        status = 500
        if hasattr(e, 'response') and e.response is not None:
            status = getattr(e.response, 'status_code', 500)
        return {'success': False, 'error': str(e), 'status_code': status}


# Example usage:
if __name__ == '__main__':
    example_profile = {
        # Personal Information
        'firstName': 'John',
        'lastName': 'Doe',
        'preferredName': 'Johnny',
        'email': 'john.doe@example.com',
        'countryCode': '+1',
        'phone': '+1234567890',

        # Address
        'address': '123 Main St',
        'city': 'New York',
        'state': 'NY',
        'postalCode': '10001',
        'country': 'United States',

        # Work Authorization
        'authorizedToWorkInUS': True,
        'requireVisa': False,
        'over18': True,
        'willingToRelocate': False,

        # Professional / Education / etc. (add other fields from MyProfile as needed)
        'expectedIncome': '100000',
        'workExperience': '3 years',
        'education': 'B.S. Computer Science'
    }

    result = save_user_data(
        user_id='user123',
        profile=example_profile,
        resume_file_url='https://example.com/resume.pdf',
        resume_file_name='resume.pdf',
        lambda_url='https://your-api-gateway-url.amazonaws.com/prod/save-user'
    )
    print(result)
