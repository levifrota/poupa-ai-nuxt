import { getAuth as firebaseGetAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { useFirebaseApp } from 'vuefire';

// Fallback initialization if the plugin hasn't loaded yet
let app: ReturnType<typeof initializeApp> | null = null;

/**
 * Returns a Firebase Auth instance
 */
export function getAuth() {
  // First try to use vuefire's useFirebaseApp
  if (import.meta.client) {
    try {
      // Try to use our client plugin first
      const nuxtApp = useNuxtApp();
      if (nuxtApp.$firebaseClientAuth) {
        return nuxtApp.$firebaseClientAuth;
      }
      
      // Then try to use vuefire directly
      const firebaseApp = useFirebaseApp();
      return firebaseGetAuth(firebaseApp);
    } catch (error) {
      console.warn('Firebase app not available, using fallback initialization - ', error);
    }
  }
  
  // Fallback: initialize Firebase manually
  if (!app) {
    const config = useRuntimeConfig();
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
      measurementId: config.public.firebaseMeasurementId
    };
    app = initializeApp(firebaseConfig);
  }
  
  return firebaseGetAuth(app);
}

/**
 * Returns a Firestore instance
 */
export function getDb() {
  // First try to use vuefire's useFirebaseApp
  if (import.meta.client) {
    try {
      // Try to use our client plugin first
      const nuxtApp = useNuxtApp();
      if (nuxtApp.$firebaseClientDb) {
        return nuxtApp.$firebaseClientDb;
      }
      
      // Then try to use vuefire directly
      const firebaseApp = useFirebaseApp();
      return getFirestore(firebaseApp);
    } catch (error) {
      console.warn('Firebase app not available, using fallback initialization - ', error);
    }
  }
  
  // Fallback: use the app instance from getAuth
  if (!app) {
    getAuth(); // This will initialize the app if it hasn't been already
  }
  
  return getFirestore(app!);
}

// Lazy-loaded Firestore instance
let _db: ReturnType<typeof getFirestore> | null = null;
export function db() {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}
