import { useState, useEffect } from 'react';
import { auth } from './components/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseLogin } from './components/FirebaseLogin';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { DemoPage } from './components/DemoPage';
import { MyProfile } from './components/MyProfile';
import { JobSearch } from './components/JobSearch';
import { JobResults } from './components/JobResults';
import { Analytics } from './components/Analytics';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'demo' | 'profile' | 'search' | 'results' | 'analytics';

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
  url?: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setShowLogin(false);
        // Auto-redirect logged-in users to dashboard if on home page
        if (currentPage === 'home') {
          setCurrentPage('results');
        }
      }
    });

    return () => unsubscribe();
  }, [currentPage]);

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setCurrentPage('results'); // Redirect to dashboard after login
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('results'); // Logged-in users go to dashboard
    } else {
      setShowLogin(true);
    }
  };

  const handleSearch = (_searchParams: any) => {
    setCurrentPage('results');
  };

  const handleJobApplied = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} onNavigate={setCurrentPage} />;
      case 'demo':
        return <DemoPage onGetStarted={handleGetStarted} />;
      case 'profile':
        return <MyProfile />;
      case 'search':
        return <JobSearch onSearch={handleSearch} />;
      case 'results':
        return <JobResults onJobApplied={handleJobApplied} jobs={jobs} setJobs={setJobs} user={user} />;
      case 'analytics':
        return <Analytics jobs={jobs} setJobs={setJobs} />;
      default:
        return <HomePage onGetStarted={handleGetStarted} onNavigate={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return <FirebaseLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <Navigation
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)}
        isLoggedIn={!!user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        user={user ? {
          profile: {
            name: user.displayName || user.email || 'User',
            email: user.email || '',
            picture: user.photoURL || undefined
          }
        } : undefined}
      />
      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}
