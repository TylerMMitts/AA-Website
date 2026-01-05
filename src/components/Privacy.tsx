import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 4, 2026</p>
      </div>

      <div className="space-y-6">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              ApplyApply is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our job 
              application automation service, including our website and Chrome browser extension.
            </p>
            <p className="text-gray-700">
              By using ApplyApply, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">1. Personal Information You Provide</h3>
              <p className="text-gray-700 mb-3">
                When you create a profile on ApplyApply, we collect the following information that you voluntarily provide:
              </p>
              
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium text-gray-800">Personal Details:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>First name, middle name, last name, and preferred name</li>
                    <li>Email address</li>
                    <li>Phone number and country code</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Address Information:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Street address, city, state, postal code, and country</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Professional Information:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Work experience (job titles, companies, locations, dates, descriptions, and achievements)</li>
                    <li>Projects (names, descriptions, technologies, links, and dates)</li>
                    <li>Education (degree, university, major, GPA, graduation year)</li>
                    <li>Expected annual income</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Documents:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Resume file (PDF, DOC, or DOCX)</li>
                    <li>Default cover letter template</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Work Authorization:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Age verification (over 18)</li>
                    <li>U.S. work authorization status</li>
                    <li>Visa sponsorship requirements</li>
                    <li>Relocation preferences</li>
                    <li>Employment history with companies</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Optional Demographic Information (for EEO reporting):</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Gender</li>
                    <li>Ethnicity</li>
                    <li>Hispanic or Latino status</li>
                    <li>Veteran status</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mt-3">Job Application Tracking:</p>
                  <ul className="list-disc ml-6 text-gray-700">
                    <li>Job listings you save or apply to</li>
                    <li>Application statuses and dates</li>
                    <li>Company names and job details</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">2. Automatically Collected Information</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Authentication tokens from Firebase and Google OAuth</li>
                <li>Browser extension usage data (form field detection and filling actions)</li>
                <li>Session information stored locally in your browser</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">3. Information NOT Collected</h3>
              <p className="text-gray-700">We do NOT collect:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Browsing history beyond job application pages</li>
                <li>Credit card or payment information (handled securely by Stripe)</li>
                <li>Social Security Numbers or government-issued ID numbers</li>
                <li>Passwords (authentication is handled by Firebase/Google)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">We use the information we collect to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Automatically fill job application forms with your saved profile data</li>
              <li>Generate AI-powered, customized resumes and cover letters for specific job applications (Pro feature)</li>
              <li>Match your profile information to form fields using AI technology</li>
              <li>Store your resume securely in AWS S3 for future applications</li>
              <li>Track your job applications and their statuses</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Manage your account and subscription (if applicable)</li>
              <li>Improve our service and develop new features</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </CardContent>
        </Card>

        {/* How We Store Your Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Store Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Storage Infrastructure:</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li><strong>AWS (Amazon Web Services):</strong> Your profile data and application history are stored in AWS databases in the US-East-2 (Ohio) region</li>
                <li><strong>AWS S3:</strong> Your resume files are securely stored in AWS S3 with encrypted URLs</li>
                <li><strong>Firebase Authentication:</strong> Your login credentials and authentication tokens are managed by Google Firebase</li>
                <li><strong>Browser Local Storage:</strong> Session tokens and cached profile data are stored locally in your browser for faster access</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Security Measures:</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>All data transmission is encrypted using HTTPS/TLS</li>
                <li>AWS credentials are never exposed in client-side code</li>
                <li>Resume files are stored with secure, time-limited access URLs</li>
                <li>Authentication is handled through Firebase's secure OAuth system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">We do NOT sell your personal information.</h3>
              <p className="text-gray-700 mb-3">We may share your information only in the following circumstances:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> We use third-party services (AWS, Firebase, Stripe for payments, Amazon Bedrock AI for document generation) to operate our service. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect it.</li>
                <li><strong>Job Application Forms:</strong> When you use our extension to fill out job applications, your profile information is transmitted directly to the job application website you're visiting. We do not control how employers use this information.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or government regulation.</li>
                <li><strong>Business Transfers:</strong> If ApplyApply is acquired or merged with another company, your information may be transferred to the new owners.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">You have the following rights regarding your personal information:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> You can view and edit all your profile information at any time through the My Profile page</li>
              <li><strong>Correction:</strong> You can update or correct your information directly in your profile</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and all associated data by contacting us at mittstechnologyllc@gmail.com</li>
              <li><strong>Download:</strong> You can download your resume from your profile at any time</li>
              <li><strong>Opt-out:</strong> You can stop using the service at any time by uninstalling the browser extension and deleting your account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Chrome Extension */}
        <Card>
          <CardHeader>
            <CardTitle>Chrome Extension Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Our Chrome extension requires the following permissions:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>activeTab:</strong> To read and interact with job application forms on the current page</li>
              <li><strong>scripting:</strong> To inject scripts that extract form fields and auto-fill them with your data</li>
              <li><strong>identity:</strong> For Google OAuth authentication</li>
              <li><strong>storage:</strong> To store your session tokens and cache profile data locally in your browser</li>
              <li><strong>sidePanel:</strong> To display the extension's user interface</li>
              <li><strong>Host permissions (all URLs):</strong> To access job application forms across all websites, as job postings exist on thousands of different domains</li>
            </ul>
            <p className="text-gray-700 mt-3">
              The extension only activates when you click it and only interacts with forms you choose to fill.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We retain your personal information for as long as your account is active or as needed to provide 
              you services. If you request account deletion, we will delete your information within 30 days, 
              except where we are required to retain it for legal or regulatory purposes.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a minor, 
              please contact us immediately at mittstechnologyllc@gmail.com.
            </p>
          </CardContent>
        </Card>

        {/* International Users */}
        <Card>
          <CardHeader>
            <CardTitle>International Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              ApplyApply is based in the United States, and your information is stored on servers located in 
              the United States (AWS US-East-2 region). If you are accessing our service from outside the 
              United States, please be aware that your information will be transferred to, stored, and processed 
              in the United States. By using our service, you consent to this transfer.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800"><strong>Email:</strong> mittstechnologyllc@gmail.com</p>
              <p className="text-gray-800 mt-2"><strong>Website:</strong> https://applyapply.org</p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card>
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              ApplyApply uses the following third-party services to operate our platform:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>Google Firebase:</strong> For authentication and user management. View their privacy policy at <a href="https://firebase.google.com/support/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></li>
              <li><strong>Amazon Web Services (AWS):</strong> For data storage, resume hosting, and backend infrastructure. View their privacy policy at <a href="https://aws.amazon.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">aws.amazon.com/privacy</a></li>
              <li><strong>Amazon Bedrock AI:</strong> For AI-powered resume and cover letter generation (Pro feature)</li>
              <li><strong>Stripe:</strong> For payment processing (Pro subscriptions). View their privacy policy at <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2026 ApplyApply. All rights reserved.</p>
      </div>
    </div>
  );
}
