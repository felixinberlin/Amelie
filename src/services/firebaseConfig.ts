// Safe Firebase configuration loader
// Supports:
// 1. Environment variables (VITE_FIREBASE_*) for GitHub Pages & CI/CD
// 2. Optional local firebase-applet-config.json (safely detected via glob without static import errors)
// 3. Fallback mock config to allow building and running static GitHub Pages without errors

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// Safely probe for local firebase-applet-config.json without failing build if missing
const localConfigs = import.meta.glob<{ default?: Record<string, any>; [key: string]: any }>(
  '/firebase-applet-config.json',
  { eager: true }
);

function resolveConfig(): FirebaseConfig {
  // Check if glob matched a local file
  const firstKey = Object.keys(localConfigs)[0];
  if (firstKey && localConfigs[firstKey]) {
    const raw = localConfigs[firstKey].default || localConfigs[firstKey];
    if (raw && raw.apiKey) {
      return {
        apiKey: raw.apiKey,
        authDomain: raw.authDomain || `${raw.projectId}.firebaseapp.com`,
        projectId: raw.projectId || '',
        storageBucket: raw.storageBucket || '',
        messagingSenderId: raw.messagingSenderId || '',
        appId: raw.appId || '',
        measurementId: raw.measurementId || '',
      };
    }
  }

  // Check Vite environment variables (e.g. set in GitHub Actions / repository secrets)
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    };
  }

  // Safe fallback placeholder config (allows app to build & run on GitHub Pages without crashing)
  return {
    apiKey: 'demo-placeholder-key',
    authDomain: 'amelie-public-demo.firebaseapp.com',
    projectId: 'amelie-public-demo',
    storageBucket: '',
    messagingSenderId: '',
    appId: '1:1234567890:web:abcdef123456',
  };
}

export const firebaseConfig = resolveConfig();

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== 'demo-placeholder-key' &&
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId !== 'amelie-public-demo'
  );
}
