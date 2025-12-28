import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  user?: any; // Cognito user object
}

export function Navigation({ currentPage, onNavigate, isLoggedIn, onLogin, onLogout, user }: NavigationProps) {
  // Get user initials for avatar
  const getUserInitials = () => {
    // Try multiple possible name attributes
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
    // Try different name attributes Cognito might provide
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-gray-900">AutomateApply</span>
          </button>
          
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`transition-colors ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className={`transition-colors ${
                  currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => onNavigate('search')}
                className={`transition-colors ${
                  currentPage === 'search' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Job Search
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className={`transition-colors ${
                  currentPage === 'analytics' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={onLogin}>
                Log In
              </Button>
              <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80">
                  <Avatar>
                    <AvatarImage src={user?.profile?.picture || ""} />
                    <AvatarFallback className="bg-blue-600 text-white">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold">{getUserName()}</div>
                <DropdownMenuItem onClick={() => onNavigate('analytics')}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
