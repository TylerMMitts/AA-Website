import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, BarChart3, Crown, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  user?: any;
}

export function Navigation({ currentPage, onNavigate, isLoggedIn, onLogin, onSignup, onLogout, user }: NavigationProps) {
  const getUserInitials = () => {
    const name = user?.profile?.name || user?.profile?.given_name || user?.profile?.preferred_username;
    if (name) {
      const names = name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.profile?.email) {
      return user.profile.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    const name = user?.profile?.name || user?.profile?.given_name;
    const familyName = user?.profile?.family_name;
    
    if (name && familyName) {
      return `${name} ${familyName}`;
    }
    if (name) {
      return name;
    }
    return user?.profile?.preferred_username || user?.profile?.email || 'User';
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .mobile-hide-nav {
            display: none !important;
          }
        }
      `}</style>
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg border-b" 
            style={{ 
              backgroundColor: 'rgba(255, 248, 240, 0.9)', 
              borderBottomColor: '#51355A',
              borderBottomWidth: '1px'
            }}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand - always visible */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'home')}
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
              style={{ color: '#2A0C4E' }}
            >
              ApplyApply
            </button>
          </div>

          {/* Centered Navigation Links for logged in users */}
          {isLoggedIn && (
            <nav
              className="mobile-hide-nav absolute left-1/2 top-0 transform -translate-x-1/2 h-20 flex items-center z-40"
              aria-label="Main navigation"
            >
              <div
                className="flex justify-between items-center px-32 py-3 rounded-full shadow-lg border border-[#E5E0F0] mx-auto w-full transition-all duration-300"
                style={{ minHeight: 60, backgroundColor: '#51355a', width: '42em', maxWidth: 800, paddingLeft: 48, paddingRight: 48 }}
              >
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-12 py-3 rounded-full text-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9E2B25] focus:ring-offset-2 tracking-wide ${
                    currentPage === 'dashboard'
                      ? '!bg-[#51355A] !text-white !shadow-xl'
                      : 'bg-transparent text-white hover:bg-[#51355A] hover:text-[#F3E8FF]'
                  }`}
                  style={{ letterSpacing: 2 }}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className={`px-12 py-3 rounded-full text-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9E2B25] focus:ring-offset-2 tracking-wide ${
                    currentPage === 'analytics'
                      ? '!bg-[#51355A] !text-white !shadow-xl'
                      : 'bg-transparent text-white hover:bg-[#51355A] hover:text-[#F3E8FF]'
                  }`}
                  style={{ letterSpacing: 2 }}
                >
                  Analytics
                </button>
                <button
                  onClick={() => onNavigate('membership')}
                  className={`px-12 py-3 rounded-full text-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9E2B25] focus:ring-offset-2 tracking-wide ${
                    currentPage === 'membership'
                      ? '!bg-[#51355A] !text-white !shadow-xl'
                      : 'bg-transparent text-white hover:bg-[#51355A] hover:text-[#F3E8FF]'
                  }`}
                  style={{ letterSpacing: 2 }}
                >
                  Membership
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`px-12 py-3 rounded-full text-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9E2B25] focus:ring-offset-2 tracking-wide ${
                    currentPage === 'profile'
                      ? '!bg-[#51355A] !text-white !shadow-xl'
                      : 'bg-transparent text-white hover:bg-[#51355A] hover:text-[#F3E8FF]'
                  }`}
                  style={{ letterSpacing: 2 }}
                >
                  Profile
                </button>
              </div>
            </nav>
          )}

          {/* User Menu or Auth Buttons */}
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: '#51355A' }}>
                      <AvatarImage src={user?.profile?.picture} alt={getUserName()} />
                      <AvatarFallback style={{ backgroundColor: '#51355A', color: 'white' }}>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:block" style={{ color: '#51355A' }}>
                      {getUserName()}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-2 p-2" 
                                     style={{ borderColor: '#51355A', backgroundColor: '#FFF8F0' }}>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium" style={{ color: '#2A0C4E' }}>{getUserName()}</p>
                    <p className="text-xs" style={{ color: '#51355A', opacity: 0.7 }}>
                      {user?.profile?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator style={{ backgroundColor: '#51355A', opacity: 0.2 }} />
                  {/* Mobile Navigation Links (visible on mobile only) */}
                  <div className="md:hidden">
                    <DropdownMenuItem 
                      onClick={() => onNavigate('dashboard')}
                      className="rounded-lg cursor-pointer hover:bg-white"
                      style={{ color: '#51355A' }}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('analytics')}
                      className="rounded-lg cursor-pointer hover:bg-white"
                      style={{ color: '#51355A' }}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('profile')}
                      className="rounded-lg cursor-pointer hover:bg-white"
                      style={{ color: '#51355A' }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('membership')}
                      className="rounded-lg cursor-pointer hover:bg-white"
                      style={{ color: '#51355A' }}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Membership
                    </DropdownMenuItem>
                    <DropdownMenuSeparator style={{ backgroundColor: '#51355A', opacity: 0.2 }} />
                  </div>
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="rounded-lg cursor-pointer hover:bg-red-50"
                    style={{ color: '#9E2B25' }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Public Navigation Links */}
                <button
                  onClick={() => onNavigate('demo')}
                  className="text-base font-medium hover:opacity-70 transition-opacity hidden sm:block"
                  style={{ color: '#51355A' }}
                >
                  Demo
                </button>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={onLogin}
                    variant="outline"
                    className="font-semibold rounded-xl border-2"
                    style={{ color: '#51355A', backgroundColor: 'white', borderColor: '#9E2B25' }}
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={onSignup}
                    className="font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow text-white"
                    style={{ backgroundColor: '#9E2B25' }}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
