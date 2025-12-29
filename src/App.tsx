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
import { JobSearchAutomation } from './components/JobSearchAutomation';
import { Toaster } from './components/ui/sonner';
import { getUserData } from './functions/get_user_data';
import { saveUserData } from './functions/save_user_data';
import { UserCache } from './utils/userCache';

type Page = 'home' | 'demo' | 'profile' | 'search' | 'results' | 'analytics' | 'job-search';

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
  status: 'not applied' | 'applied' | 'interviewing' | 'offer' | 'rejected';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user data when logged in and cache it
        try {
          const response = await getUserData(currentUser.uid);
          if (response.success && response.data) {
            // Cache profile data
            if (response.data.profile_data) {
              const profileData = typeof response.data.profile_data === 'string'
                ? JSON.parse(response.data.profile_data)
                : response.data.profile_data;
              
              UserCache.set(currentUser.uid, 'profile', {
                formData: profileData,
                resumeUrl: response.data.resume_file_url
              });
            }
            
            // Cache applications data
            const applicationsData = response.data.applications_txt || response.data.applications;
            if (applicationsData) {
              const applications = typeof applicationsData === 'string'
                ? JSON.parse(applicationsData)
                : applicationsData;
              
              UserCache.set(currentUser.uid, 'applications', applications);
              setJobs(applications); // Set jobs state for immediate use
            }
          }
        } catch (error) {
          console.error('Error loading user data on login:', error);
        }
        
        setShowLogin(false);
        // Auto-redirect logged-in users to dashboard if on home page
        if (currentPage === 'home') {
          setCurrentPage('results');
        }
      }
      
      setLoading(false);
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

  const handleAddJobFromSearch = async (job: Job) => {
    // Add job to the dashboard and persist to database immediately
    if (user?.uid) {
      try {
        // Get current jobs and profile from database
        const response = await getUserData(user.uid);
        let currentJobs: Job[] = [];
        let profileData = {};
        
        if (response.success && response.data) {
          // Get existing applications
          const applicationsData = response.data.applications_txt || response.data.applications;
          if (applicationsData) {
            currentJobs = typeof applicationsData === 'string' 
              ? JSON.parse(applicationsData)
              : applicationsData;
          }
          
          // Get existing profile data (required by database)
          profileData = response.data.profile_data || {};
        }
        
        // Add new job
        const updatedJobs = [...currentJobs, job];
        
        // Save to database - must include profile_data to avoid constraint violation
        await saveUserData({
          user_id: user.uid,
          profile: profileData,
          applications_txt: JSON.stringify(updatedJobs)
        });
        
        // Update cache so dashboard will load it
        UserCache.set(user.uid, 'applications', updatedJobs);
        
        // Update local state
        setJobs(updatedJobs);
        
        console.log('Job added to database:', job.title, 'Total jobs:', updatedJobs.length);
      } catch (error) {
        console.error('Error saving job to database:', error);
        throw error;
      }
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} onNavigate={handleNavigate} />;
      case 'demo':
        return <DemoPage onGetStarted={handleGetStarted} />;
      case 'profile':
        return <MyProfile />;
      case 'search':
        return <JobSearch onSearch={handleSearch} />;
      case 'results':
        return <JobResults onJobApplied={handleJobApplied} jobs={jobs} setJobs={setJobs} user={user} onNavigate={handleNavigate} />;
      case 'analytics':
        return <Analytics jobs={jobs} setJobs={setJobs} />;
      case 'job-search':
        return <JobSearchAutomation onAddJob={handleAddJobFromSearch} onBack={() => setCurrentPage('results')} />;
      default:
        return <HomePage onGetStarted={handleGetStarted} onNavigate={handleNavigate} />;
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
