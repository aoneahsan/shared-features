/**
 * Seed Script for shared-features
 *
 * Seeds products and campaigns to Firestore for testing ad components.
 *
 * Usage:
 * 1. Set FIREBASE_SERVICE_ACCOUNT_PATH env var to path of service account JSON
 * 2. Run: npx tsx scripts/seedData.ts
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || resolve(__dirname, '../firebase-service-account.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Failed to load service account. Please set FIREBASE_SERVICE_ACCOUNT_PATH or place firebase-service-account.json in package root.');
  console.error(error);
  process.exit(1);
}

const db = getFirestore();

// Collection names
const PRODUCTS_COLLECTION = 'zaions_products';
const CAMPAIGNS_COLLECTION = 'zaions_campaigns';

// Product data for all Zaions projects
const products = [
  {
    id: 'ztools',
    name: 'ZTools',
    tagline: '380+ free online tools for text, images, PDF, code, and more',
    description: 'Your all-in-one digital toolbox. Process data locally in your browser - no uploads, complete privacy. Text tools, image converters, PDF utilities, code formatters, and much more.',
    type: 'web',
    url: 'https://ztools.zaions.com',
    color: '#3B82F6',
    features: ['380+ Free Tools', 'Privacy-First', 'No Sign-Up', 'Works Offline'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#3B82F6"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">Z</text></svg>',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zaions.ztools',
    webUrl: 'https://ztools.zaions.com',
    enabled: true,
  },
  {
    id: 'fileshub',
    name: 'FilesHub',
    tagline: 'Free cloud storage API for developers',
    description: 'Upload, store, and manage files with our simple REST API. Free tier with generous limits. Perfect for apps, websites, and side projects.',
    type: 'web',
    url: 'https://fileshub.zaions.com',
    color: '#10B981',
    features: ['Free Storage', 'REST API', 'Easy Integration', 'Developer Friendly'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#10B981"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">F</text></svg>',
    webUrl: 'https://fileshub.zaions.com',
    enabled: true,
  },
  {
    id: 'aoneahsan-portfolio',
    name: 'Ahsan Mahmood',
    tagline: 'Full-Stack Developer & Mobile App Expert',
    description: 'Portfolio of Ahsan Mahmood - Building beautiful apps for web, mobile, and browser. React, TypeScript, Firebase, Capacitor specialist.',
    type: 'website',
    url: 'https://aoneahsan.com',
    color: '#8B5CF6',
    features: ['Web Development', 'Mobile Apps', 'Browser Extensions', 'API Development'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#8B5CF6"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">A</text></svg>',
    webUrl: 'https://aoneahsan.com',
    enabled: true,
  },
  {
    id: 'video-controls-plus',
    name: 'Video Controls Plus',
    tagline: 'Advanced video controls for any website',
    description: 'Take control of online videos. Speed control, picture-in-picture, keyboard shortcuts, and more. Works on YouTube, Netflix, and any video site.',
    type: 'extension',
    url: 'https://chromewebstore.google.com/detail/video-controls-plus',
    color: '#EF4444',
    features: ['Speed Control', 'PiP Mode', 'Keyboard Shortcuts', 'All Sites'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#EF4444"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">V</text></svg>',
    chromeStoreUrl: 'https://chromewebstore.google.com/detail/video-controls-plus',
    enabled: true,
  },
  {
    id: 'orbitcubs-crm',
    name: 'OrbitCubs CRM',
    tagline: 'Free CRM for small businesses',
    description: 'Manage your contacts, leads, and sales pipeline. Simple, beautiful, and free. Perfect for freelancers and small teams.',
    type: 'web',
    url: 'https://orbitcubs.zaions.com',
    color: '#F59E0B',
    features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Free Forever'],
    icon64: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#F59E0B"/><text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="bold">O</text></svg>',
    webUrl: 'https://orbitcubs.zaions.com',
    enabled: true,
  },
];

// Campaign data
const campaigns = [
  // Topbar Banner Campaigns
  {
    id: 'ztools-topbar',
    productId: 'ztools',
    name: 'ZTools Topbar Promo',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [], // Empty = show to all projects
    excludeProductUsers: true, // Don't show ztools ad on ztools
    placements: ['topbar_banner'],
    priority: 100,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customTitle: null,
    customTagline: null,
    customCta: 'Try Now',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'fileshub-topbar',
    productId: 'fileshub',
    name: 'FilesHub Topbar Promo',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [], // Show to all projects
    excludeProductUsers: true,
    placements: ['topbar_banner'],
    priority: 90,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customCta: 'Get Started',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'portfolio-topbar',
    productId: 'aoneahsan-portfolio',
    name: 'Portfolio Topbar Promo',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [], // Show to all projects
    excludeProductUsers: true,
    placements: ['topbar_banner'],
    priority: 80,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'small_panel_1',
    customCta: 'Hire Me',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  // Home Banner Campaigns (AdCarousel)
  {
    id: 'ztools-home',
    productId: 'ztools',
    name: 'ZTools Home Banner',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [], // Empty = show to all projects
    excludeProductUsers: true, // Don't show ztools ad on ztools
    placements: ['home_banner'],
    priority: 100,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    customDescription: 'Your all-in-one digital toolbox with 380+ free tools for text, images, PDF, code, and more. Privacy-first - all processing happens in your browser.',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'fileshub-home',
    productId: 'fileshub',
    name: 'FilesHub Home Banner',
    status: 'active',
    targetPlatforms: ['web', 'android', 'ios'],
    targetAudience: ['all'],
    targetProjects: [], // Show to all projects
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 90,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'video-controls-home',
    productId: 'video-controls-plus',
    name: 'Video Controls Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [], // Show to all projects
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 85,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'orbitcubs-home',
    productId: 'orbitcubs-crm',
    name: 'OrbitCubs Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 80,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
  {
    id: 'portfolio-home',
    productId: 'aoneahsan-portfolio',
    name: 'Portfolio Home Banner',
    status: 'active',
    targetPlatforms: ['web'],
    targetAudience: ['all'],
    targetProjects: [],
    excludeProductUsers: true,
    placements: ['home_banner'],
    priority: 70,
    frequencyDays: 0,
    maxImpressions: null,
    variant: 'large_slider_1',
    customCta: 'View Portfolio',
    totalImpressions: 0,
    totalClicks: 0,
    totalCloses: 0,
  },
];

async function seedProducts() {
  console.log('Seeding products...');

  for (const product of products) {
    const docRef = db.collection(PRODUCTS_COLLECTION).doc(product.id);
    const doc = await docRef.get();

    if (doc.exists) {
      console.log(`  ⏩ Product "${product.name}" already exists, updating...`);
      await docRef.update({
        ...product,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      console.log(`  ✅ Creating product "${product.name}"...`);
      await docRef.set({
        ...product,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  console.log(`Seeded ${products.length} products.\n`);
}

async function seedCampaigns() {
  console.log('Seeding campaigns...');

  const now = Timestamp.now();
  const oneYearLater = Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

  for (const campaign of campaigns) {
    const docRef = db.collection(CAMPAIGNS_COLLECTION).doc(campaign.id);
    const doc = await docRef.get();

    if (doc.exists) {
      console.log(`  ⏩ Campaign "${campaign.name}" already exists, updating...`);
      await docRef.update({
        ...campaign,
        startDate: now,
        endDate: oneYearLater,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: 'seed-script',
      });
    } else {
      console.log(`  ✅ Creating campaign "${campaign.name}"...`);
      await docRef.set({
        ...campaign,
        startDate: now,
        endDate: oneYearLater,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: 'seed-script',
      });
    }
  }

  console.log(`Seeded ${campaigns.length} campaigns.\n`);
}

async function main() {
  console.log('\n🌱 Shared-Features Data Seeder\n');
  console.log('=====================================\n');

  try {
    await seedProducts();
    await seedCampaigns();

    console.log('✅ All data seeded successfully!\n');
    console.log('Products will now show in TopbarAdBanner and AdCarousel components.\n');
    console.log('Note: Campaigns with excludeProductUsers=true will NOT show on their own product\'s site.\n');
    console.log('For example, ZTools ads will show on FilesHub, but not on ZTools itself.\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

main();
