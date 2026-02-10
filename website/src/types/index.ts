import type { Timestamp } from 'firebase/firestore';

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google';
  emailVerified: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  updatedAt: Timestamp;
  isAdmin: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    emailNotifications: boolean;
  };
}

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SitemapEntry {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: 'marketing' | 'documentation' | 'admin' | 'legal' | 'auth';
  tags: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  highlights: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'breaking';
    title: string;
    description: string;
  }[];
}
