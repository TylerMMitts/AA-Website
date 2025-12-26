import { useEffect, useRef } from 'react';
import { auth } from './firebase';
import * as firebaseui from 'firebaseui';
import { 
  EmailAuthProvider, 
  GoogleAuthProvider
} from 'firebase/auth';

interface FirebaseLoginProps {
  onLoginSuccess?: () => void;
}

export function FirebaseLogin({ onLoginSuccess }: FirebaseLoginProps) {
  const uiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize FirebaseUI
    const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    // FirebaseUI config
    const uiConfig: firebaseui.auth.Config = {
      signInOptions: [
        // Email/Password sign-in
        EmailAuthProvider.PROVIDER_ID,
        // Google sign-in
        GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup', // or 'redirect'
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to AI Job Application Platform
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div ref={uiRef}></div>
        </div>
      </div>
    </div>
  );
}
