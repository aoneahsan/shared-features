export const APP_NAME = 'Shared Features';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'One package for all your React project\'s common features';
export const ADMIN_EMAIL = 'aoneahsan@gmail.com';

export const SUPPORT_URL = 'https://aoneahsan.com/payment?project-id=shared-features-website&project-identifier=shared-features';
export const NPM_URL = 'https://www.npmjs.com/package/shared-features';
export const GITHUB_URL = 'https://github.com/aoneahsan/shared-features';
export const PORTFOLIO_URL = 'https://aoneahsan.com';

export const DEVELOPER = {
  name: 'Ahsan Mahmood',
  email: 'aoneahsan@gmail.com',
  phone: '+923046619706',
  whatsapp: '+923046619706',
  linkedin: 'https://linkedin.com/in/aoneahsan',
  github: 'https://github.com/aoneahsan',
  portfolio: 'https://aoneahsan.com',
  npm: 'https://npmjs.com/~aoneahsan',
  address: 'https://zaions.com/address',
};

export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Docs', href: '/docs' },
  { label: 'Demos', href: '/demos' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Pricing', href: '/pricing' },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Demos', href: '/demos' },
    { label: 'Examples', href: '/docs/examples' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
  ],
  resources: [
    { label: 'NPM Package', href: NPM_URL, external: true },
    { label: 'Code Access', href: '/code-access' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Data Deletion', href: '/data-deletion' },
    { label: 'Security', href: '/security' },
  ],
} as const;
