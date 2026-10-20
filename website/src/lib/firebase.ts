import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { env, isFirebaseConfigured } from '@/config/env';

const firebaseConfig = isFirebaseConfigured
  ? env.firebase
  : {
      apiKey: 'demo-key',
      authDomain: 'demo-shared-features.firebaseapp.com',
      projectId: 'demo-shared-features',
      storageBucket: 'demo-shared-features.firebasestorage.app',
      messagingSenderId: '0',
      appId: '1:0:web:demo',
    };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

export const initAnalytics = async () => {
  if (!isFirebaseConfigured) return null;
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
