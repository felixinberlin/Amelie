import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

export { isFirebaseConfigured };

export interface GoogleUser {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string;
}

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
];

// Lazy auth instance to prevent initialization failures when Firebase is absent/unconfigured
let authInstance: any = null;

export const getAuthSafe = () => {
  if (!authInstance && isFirebaseConfigured()) {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      authInstance = getAuth(app);
    } catch (err) {
      console.warn('Optional Firebase Auth initialization skipped:', err);
    }
  }
  return authInstance;
};

// In-memory token cache (never stored in localStorage/sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string) => void,
  onAuthFailure?: () => void
): (() => void) => {
  if (!isFirebaseConfigured()) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  const auth = getAuthSafe();
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: any) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) {
          onAuthSuccess(
            {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
            },
            cachedAccessToken
          );
        }
      } else if (!isSigningIn) {
        // User is logged in to Firebase but token is not yet in memory in this turn
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: GoogleUser; accessToken: string } | null> => {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Google Auth & Firebase are optional and not configured in this build. The entire Amélie idea archive, matrix, editor, and data exports work 100% offline without them.'
    );
  }

  const auth = getAuthSafe();
  if (!auth) {
    throw new Error('Firebase Auth is not available.');
  }

  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    SCOPES.forEach((scope) => provider.addScope(scope));

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Auth');
    }

    const token: string = credential.accessToken;
    cachedAccessToken = token;

    const user: GoogleUser = {
      email: result.user?.email,
      displayName: result.user?.displayName,
      photoURL: result.user?.photoURL,
      uid: result.user?.uid,
    };

    return { user, accessToken: token };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessTokenInMemory = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async (): Promise<void> => {
  const auth = getAuthSafe();
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }
  cachedAccessToken = null;
};
