import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aoneahsan.sharedfeatures',
  appName: 'shared-features',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'shared-features.aoneahsan.com',
  },
};

export default config;
