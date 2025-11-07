import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { MyProfile } from './components/MyProfile';
import { JobSearch } from './components/JobSearch';
import { JobResults } from './components/JobResults';
import { Analytics } from './components/Analytics';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'profile' | 'search' | 'results' | 'analytics';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  salary: string;
  postedDate: string;
  description: string;
  type: string;
  level: string;
}

export default function App() {
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleLogout = () => {
    const clientId = "7fl492n78ft5u9g5romvetaj4t";
    const logoutUri = "https://d84l1y8p4kdic.cloudfront.net";
    const cognitoDomain = "https://us-east-2htc4w6dxj.auth.us-east-2.amazoncognito.com";
    
    // Remove user from local storage first
    auth.removeUser();
    
    // Redirect to Cognito logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    
    setCurrentPage('home');
  };

  const handleGetStarted = () => {
    if (auth.isAuthenticated) {
      setCurrentPage('profile');
    } else {
      auth.signinRedirect();
    }
  };

  const handleSearch = (searchParams: any) => {
    setCurrentPage('results');
  };

  const handleJobApplied = (job: Job) => {
    setAppliedJobs([...appliedJobs, job]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} />;
      case 'profile':
        return <MyProfile />;
      case 'search':
        return <JobSearch onSearch={handleSearch} />;
      case 'results':
        return <JobResults onJobApplied={handleJobApplied} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <HomePage onGetStarted={handleGetStarted} />;
    }
  };

  // Handle authentication loading and errors
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Authentication Error: {auth.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={auth.isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        user={auth.user}
      />
      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}
