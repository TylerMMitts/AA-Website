/**
 * Generate custom resume and cover letter using AWS Bedrock
 */

const BEDROCK_GENERATE_URL = import.meta.env.VITE_BEDROCK_GENERATE_URL || 'http://localhost:5001/generate-documents';

export interface GenerateDocumentsRequest {
  user_id: string;
  profile_data: any;
  job_data: {
    title: string;
    company: string;
    location: string;
    description: string;
    salary?: string;
    type?: string;
    level?: string;
  };
  document_type: 'resume' | 'cover_letter';
  output_format?: 'pdf' | 'markdown';
}

export interface GenerateDocumentsResponse {
  success: boolean;
  content?: string;
  format?: 'pdf' | 'markdown';
  error?: string;
}

/**
 * Generate a custom resume or cover letter for a specific job
 */
export async function generateDocument(request: GenerateDocumentsRequest): Promise<GenerateDocumentsResponse> {
  try {
    const response = await fetch(BEDROCK_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate document');
    }

    const data = await response.json();
    return {
      success: true,
      content: data.content,
      format: data.format || 'markdown',
    };
  } catch (error) {
    console.error('Error generating document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**file
 */
export function downloadDocument(content: string, filename: string, format: 'pdf' | 'markdown' = 'pdf') {
  if (format === 'pdf') {
    // Decode base64 PDF
    const binary = atob(content);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Markdown/text format
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }(link);
  URL.revokeObjectURL(url);
}
