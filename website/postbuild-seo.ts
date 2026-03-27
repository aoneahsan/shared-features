/**
 * Postbuild SEO Script
 * Injects SEO meta tags and structured data into static HTML for SSR-like benefits
 *
 * Run after build: npx tsx postbuild-seo.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const DIST_DIR = path.join(process.cwd(), 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// SEO Configuration
const SEO_CONFIG = {
  siteName: 'Shared Features',
  siteUrl: 'https://sharedfeatures.aoneahsan.com',
  defaultTitle: 'Shared Features - Centralized Product Features for Zaions Projects',
  defaultDescription:
    'Centralized shared product features including advertising campaigns, broadcasts, feature flags, analytics, and common profile data for cross-project use.',
  defaultKeywords:
    'shared features, npm package, feature flags, advertising campaigns, broadcasts, notifications, analytics, react hooks, typescript',
  author: 'Ahsan Mahmood',
  twitterHandle: '@aoneahsan',
  locale: 'en_US',
  defaultOgImage: '/og-image.png',
  npmUrl: 'https://www.npmjs.com/package/shared-features',
  themeColor: '#6366f1',
};

// JSON-LD Schemas
function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/sitemap?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SEO_CONFIG.siteUrl}#organization`,
    name: 'Zaions',
    url: 'https://zaions.com',
    logo: `${SEO_CONFIG.siteUrl}/logo.svg`,
    description: SEO_CONFIG.defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'aoneahsan@gmail.com',
      availableLanguage: ['en'],
    },
    sameAs: [
      'https://www.linkedin.com/in/aoneahsan',
      'https://github.com/aoneahsan',
      SEO_CONFIG.npmUrl,
    ],
  };
}

function createSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SEO_CONFIG.siteName,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: SEO_CONFIG.author,
      url: 'https://aoneahsan.com',
    },
    downloadUrl: SEO_CONFIG.npmUrl,
    operatingSystem: 'Any',
    programmingLanguage: 'TypeScript',
  };
}

function createFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Shared Features?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shared Features is an npm package that provides centralized product features for Zaions projects including advertising campaigns, broadcasts, feature flags, analytics helpers, and common profile data.',
        },
      },
      {
        '@type': 'Question',
        name: 'What features does the package include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The package includes feature flags management, advertising campaign tools, broadcast/notification systems, common profile/contact data utilities, and analytics helpers - all with TypeScript support, React hooks, and Firestore integration.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Shared Features free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Shared Features is an open-source npm package that is free to use in your projects.',
        },
      },
    ],
  };
}

// Generate meta tags HTML
function generateMetaTags(): string {
  const fullImage = `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;

  return `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${SEO_CONFIG.defaultTitle}">
    <meta name="description" content="${SEO_CONFIG.defaultDescription}">
    <meta name="keywords" content="${SEO_CONFIG.defaultKeywords}">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">
    <meta name="author" content="${SEO_CONFIG.author}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SEO_CONFIG.siteUrl}">
    <meta property="og:title" content="${SEO_CONFIG.defaultTitle}">
    <meta property="og:description" content="${SEO_CONFIG.defaultDescription}">
    <meta property="og:image" content="${fullImage}">
    <meta property="og:site_name" content="${SEO_CONFIG.siteName}">
    <meta property="og:locale" content="${SEO_CONFIG.locale}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${SEO_CONFIG.siteUrl}">
    <meta name="twitter:title" content="${SEO_CONFIG.defaultTitle}">
    <meta name="twitter:description" content="${SEO_CONFIG.defaultDescription}">
    <meta name="twitter:image" content="${fullImage}">
    <meta name="twitter:site" content="${SEO_CONFIG.twitterHandle}">

    <!-- Mobile App Meta -->
    <meta name="application-name" content="${SEO_CONFIG.siteName}">
    <meta name="apple-mobile-web-app-title" content="${SEO_CONFIG.siteName}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="${SEO_CONFIG.themeColor}">

    <!-- Canonical -->
    <link rel="canonical" href="${SEO_CONFIG.siteUrl}">
`;
}

// Generate JSON-LD script
function generateJsonLd(): string {
  const schemas = [
    createWebSiteSchema(),
    createOrganizationSchema(),
    createSoftwareApplicationSchema(),
    createFAQSchema(),
  ];

  return `<script type="application/ld+json">${JSON.stringify(schemas)}</script>`;
}

// Main function
async function main() {
  console.log('🔍 Starting SEO postbuild processing...');

  // Check if dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run yarn build first.');
    process.exit(1);
  }

  // Read index.html
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ dist/index.html not found.');
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX_HTML, 'utf-8');

  // Check if already processed
  if (html.includes('<!-- SEO POSTBUILD PROCESSED -->')) {
    console.log('ℹ️  Already processed. Skipping.');
    return;
  }

  // Generate SEO content
  const metaTags = generateMetaTags();
  const jsonLd = generateJsonLd();

  // Find the title tag position to insert after it
  const titleMatch = html.match(/<title>[^<]*<\/title>/);
  if (!titleMatch) {
    console.error('❌ Could not find <title> tag in index.html');
    process.exit(1);
  }

  // Update title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${SEO_CONFIG.defaultTitle}</title>`);

  // Insert meta tags after title
  const titleEndIndex = html.indexOf('</title>') + '</title>'.length;
  html =
    html.slice(0, titleEndIndex) +
    '\n    <!-- SEO POSTBUILD PROCESSED -->' +
    metaTags +
    html.slice(titleEndIndex);

  // Insert JSON-LD before closing head tag
  html = html.replace('</head>', `${jsonLd}\n  </head>`);

  // Write updated HTML
  fs.writeFileSync(INDEX_HTML, html);
  console.log('✅ SEO meta tags injected into dist/index.html');
  console.log('✅ JSON-LD structured data added');
  console.log('✅ Postbuild SEO processing complete!');
}

main().catch(console.error);
