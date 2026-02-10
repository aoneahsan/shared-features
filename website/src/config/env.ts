function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    if (import.meta.env.DEV) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    throw new Error('Configuration error. Please contact support.');
  }
  return value;
}

function optionalEnv(key: string): string | undefined {
  return import.meta.env[key] || undefined;
}

export const env = {
  firebase: {
    apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
    authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv('VITE_FIREBASE_APP_ID'),
    measurementId: optionalEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  },
};
