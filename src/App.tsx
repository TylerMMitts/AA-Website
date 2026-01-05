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
import JobSearchAutomation from './components/JobSearchAutomation';
import Membership from './components/Membership';
import { CancelSubscription } from './components/CancelSubscription';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { CheckoutCancel } from './components/CheckoutCancel';
import { Privacy } from './components/Privacy';
import { Toaster } from './components/ui/sonner';
import { getUserData } from './functions/get_user_data';
import { saveUserData } from './functions/save_user_data';
import { UserCache } from './utils/userCache';
import { getMembership } from './functions/get_membership';
import type { MembershipStatus } from './utils/stripe';

type Page = 'home' | 'login' | 'signup' | 'profile' | 'search' | 'dashboard' | 'analytics' | 'job-search' | 'membership' | 'cancel-subscription' | 'checkout-success' | 'checkout-cancel' | 'privacy';

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [membership, setMembership] = useState<MembershipStatus | null>(null);

  useEffect(() => {
    // Check URL and set page from pathname
    const path = window.location.pathname.replace('/', '') || 'home';
    const validPages: Page[] = ['home', 'login', 'signup', 'profile', 'search', 'dashboard', 'analytics', 'job-search', 'membership', 'cancel-subscription', 'checkout-success', 'checkout-cancel', 'privacy'];
    if (validPages.includes(path as Page)) {
      setCurrentPage(path as Page);
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      if (validPages.includes(path as Page)) {
        setCurrentPage(path as Page);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data when logged in and cache it
        try {
          const response = await getUserData(currentUser.uid);
          
          // If user doesn't exist in database, create blank entry
          if (!response.success || !response.data) {
            console.log('New user detected, creating blank database entry');
            await saveUserData({
              user_id: currentUser.uid,
              profile: {}, // Blank profile data
              applications_txt: JSON.stringify([]) // Empty applications array
            });
            console.log('Blank user entry created successfully');
          } else if (response.success && response.data) {
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
          // Fetch membership status
          const membershipRes = await getMembership(currentUser.uid);
          if (membershipRes.success && membershipRes.data) {
            setMembership(membershipRes.data);
          } else {
            setMembership(null);
          }
        } catch (error) {
          console.error('Error loading user data or membership on login:', error);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);

  const handleLogin = () => {
    handleNavigate('login');
  };

  const handleSignup = () => {
    handleNavigate('signup');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentPage('home');
      window.history.pushState({}, '', '/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginSuccess = () => {
    handleNavigate('dashboard'); // Redirect to dashboard after login
  };

  const handleGetStarted = () => {
    if (user) {
      handleNavigate('dashboard'); // Logged-in users go to dashboard
    } else {
      handleNavigate('signup'); // New users should sign up
    }
  };

  const handleSearch = (_searchParams: any) => {
    setCurrentPage('dashboard');
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
        
        // Add dateAdded timestamp to the job
        const jobWithTimestamp = {
          ...job,
          dateAdded: new Date().toISOString()
        };
        
        // Add new job
        const updatedJobs = [...currentJobs, jobWithTimestamp];
        
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

  const handleNavigate = async (page: string) => {
    setCurrentPage(page as Page);
    // Update URL without page reload
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
    
    // If navigating to membership or dashboard after checkout, refresh membership status
    if ((page === 'membership' || page === 'dashboard') && user?.uid) {
      await refreshMembershipStatus();
    }
  };

  const refreshMembershipStatus = async () => {
    if (!user?.uid) return;
    
    try {
      const membershipRes = await getMembership(user.uid);
      if (membershipRes.success && membershipRes.data) {
        setMembership(membershipRes.data);
      }
    } catch (error) {
      console.error('Error refreshing membership:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} onNavigate={handleNavigate} />;
      case 'login':
        return <FirebaseLogin mode="login" onLoginSuccess={handleLoginSuccess} onClose={() => handleNavigate('home')} />;
      case 'signup':
        return <FirebaseLogin mode="signup" onLoginSuccess={handleLoginSuccess} onClose={() => handleNavigate('home')} />;
      case 'profile':
        return <MyProfile />;
      case 'search':
        return <JobSearch onSearch={handleSearch} />;
      case 'dashboard':
        return <JobResults onJobApplied={handleJobApplied} jobs={jobs} setJobs={setJobs} user={user} onNavigate={handleNavigate} membership={membership} />;
      case 'analytics':
        return <Analytics jobs={jobs} setJobs={setJobs} />;
      case 'job-search':
        return <JobSearchAutomation onAddJob={handleAddJobFromSearch} onBack={() => setCurrentPage('dashboard')} isPro={!!membership?.isPro} />;
      case 'membership':
        return <Membership onNavigate={handleNavigate} membership={membership} />;
      case 'cancel-subscription':
        return <CancelSubscription onNavigate={handleNavigate} membership={membership} onRefreshMembership={refreshMembershipStatus} />;
      case 'checkout-success':
        return <CheckoutSuccess onNavigate={handleNavigate} onRefreshMembership={refreshMembershipStatus} />;
      case 'checkout-cancel':
        return <CheckoutCancel onNavigate={handleNavigate} />;
      case 'privacy':
        return <Privacy />;
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <Navigation
        currentPage={currentPage}
        onNavigate={(page) => handleNavigate(page)}
        isLoggedIn={!!user}
        onLogin={handleLogin}
        onSignup={handleSignup}
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
