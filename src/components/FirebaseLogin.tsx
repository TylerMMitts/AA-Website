import { useEffect, useRef } from 'react';
import { auth } from './firebase';
import * as firebaseui from 'firebaseui';
import { 
  EmailAuthProvider, 
  GoogleAuthProvider
} from 'firebase/auth';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface FirebaseLoginProps {
  onLoginSuccess?: () => void;
  onClose?: () => void;
}

export function FirebaseLogin({ onLoginSuccess, onClose }: FirebaseLoginProps) {
  const uiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize FirebaseUI
    const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    // FirebaseUI config
    const uiConfig: firebaseui.auth.Config = {
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        },
        GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
      signInSuccessUrl: '/', // Where to redirect after successful sign-in
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          // User successfully signed in
          console.log('Sign in successful', authResult);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          return false; // Prevent redirect, we'll handle it manually
        },
        signInFailure: async (error) => {
          console.error('Sign in error', error);
        }
      },
      // Terms of service and privacy policy URLs
      tosUrl: '/terms',
      privacyPolicyUrl: '/privacy'
    };

    // Render the FirebaseUI widget
    if (uiRef.current) {
      firebaseUi.start(uiRef.current, uiConfig);
    }

    // Cleanup
    return () => {
      firebaseUi.reset();
    };
  }, [onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#2A0C4E' }}>
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm" style={{ color: '#51355A' }}>
              Welcome to ApplyApply
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
              style={{ color: '#51355A' }}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border-2" style={{ borderColor: '#51355A' }}>
          <div ref={uiRef}></div>
        </div>
      </div>
    </div>
  );
}
