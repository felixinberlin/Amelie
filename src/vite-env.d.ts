/// <reference types="vite/client" />

// Ambient declarations for optional Firebase modules
// Ensures `tsc` never fails with TS7016 if Firebase types are not present in node_modules
declare module 'firebase/app' {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
  export function getApp(): any;
}

declare module 'firebase/auth' {
  export function getAuth(app?: any): any;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export class GoogleAuthProvider {
    static credentialFromResult(result: any): any;
    addScope(scope: string): void;
  }
  export function onAuthStateChanged(auth: any, nextOrObserver: any): () => void;
  export function signOut(auth: any): Promise<void>;
  export interface User {
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    uid?: string;
    [key: string]: any;
  }
}
