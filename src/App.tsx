import { useState, useEffect } from 'react';
import { auth } from './components/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseLogin } from './components/FirebaseLogin';
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setShowLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
    setCurrentPage('profile');
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('profile');
    } else {
      setShowLogin(true);
    }
  };

  const handleSearch = (_searchParams: any) => {
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
    <div className="min-h-screen bg-gray-50">
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
