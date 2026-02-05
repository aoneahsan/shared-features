/**
 * Common Features Types
 *
 * Type definitions for centralized common features:
 * - Contact Info
 * - Developer Info
 * - Social Links
 * - Address Info
 * - Payment Options
 * - Services
 * - Skills
 * - Testimonials
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import type { Timestamp } from 'firebase/firestore';

// ============================================================================
// COLLECTION NAMES
// ============================================================================

export const COMMON_FEATURE_COLLECTIONS = {
  CONTACT_INFO: 'zaions_contact_info',
  DEVELOPER_INFO: 'zaions_developer_info',
  SOCIAL_LINKS: 'zaions_social_links',
  ADDRESS_INFO: 'zaions_address_info',
  PAYMENT_OPTIONS: 'zaions_payment_options',
  SERVICES: 'zaions_services',
  SKILLS: 'zaions_skills',
  TESTIMONIALS: 'zaions_testimonials',
  PROJECTS: 'zaions_projects',
} as const;

// ============================================================================
// CONTACT INFO
// ============================================================================

export interface ContactInfo {
  id: string;
  email: string;
  supportEmail?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  skype?: string;
  freelanceAvailable: boolean;
  workingHours?: string;
  timezone?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp' | 'telegram';
  responseTime?: string;
  updatedAt: Timestamp;
}

export const DEFAULT_CONTACT_INFO: Omit<ContactInfo, 'id' | 'updatedAt'> = {
  email: '',
  freelanceAvailable: false,
};

// ============================================================================
// DEVELOPER INFO
// ============================================================================

export interface DeveloperInfo {
  id: string;
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  shortBio?: string;
  avatar?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  yearsOfExperience?: number;
  location?: string;
  availableForHire: boolean;
  resumeUrl?: string;
  updatedAt: Timestamp;
}

export const DEFAULT_DEVELOPER_INFO: Omit<DeveloperInfo, 'id' | 'updatedAt'> = {
  name: '',
  title: '',
  bio: '',
  availableForHire: false,
};

// ============================================================================
// SOCIAL LINKS
// ============================================================================

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'discord'
  | 'telegram'
  | 'whatsapp'
  | 'medium'
  | 'devto'
  | 'stackoverflow'
  | 'dribbble'
  | 'behance'
  | 'codepen'
  | 'npm'
  | 'website'
  | 'email'
  | 'other';

export const SOCIAL_PLATFORM_NAMES: Record<SocialPlatform, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  discord: 'Discord',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  medium: 'Medium',
  devto: 'Dev.to',
  stackoverflow: 'Stack Overflow',
  dribbble: 'Dribbble',
  behance: 'Behance',
  codepen: 'CodePen',
  npm: 'NPM',
  website: 'Website',
  email: 'Email',
  other: 'Other',
};

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  displayName?: string;
  username?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  showIn: ('footer' | 'contact' | 'about' | 'header')[];
  updatedAt: Timestamp;
}

// ============================================================================
// ADDRESS INFO
// ============================================================================

export interface AddressInfo {
  id: string;
  label?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  fullAddress?: string;
  googleMapsUrl?: string;
  isPublic: boolean;
  updatedAt: Timestamp;
}

export const DEFAULT_ADDRESS_INFO: Omit<AddressInfo, 'id' | 'updatedAt'> = {
  isPublic: false,
};

// ============================================================================
// PAYMENT OPTIONS
// ============================================================================

export type PaymentType =
  | 'bank'
  | 'paypal'
  | 'stripe'
  | 'wise'
  | 'crypto'
  | 'upi'
  | 'venmo'
  | 'cashapp'
  | 'other';

export const PAYMENT_TYPE_NAMES: Record<PaymentType, string> = {
  bank: 'Bank Transfer',
  paypal: 'PayPal',
  stripe: 'Stripe',
  wise: 'Wise',
  crypto: 'Cryptocurrency',
  upi: 'UPI',
  venmo: 'Venmo',
  cashapp: 'Cash App',
  other: 'Other',
};

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  branch?: string;
}

export interface CryptoDetails {
  currency: string;
  walletAddress: string;
  network?: string;
}

export interface PaymentOption {
  id: string;
  type: PaymentType;
  name: string;
  description?: string;
  icon?: string;
  details: BankDetails | CryptoDetails | Record<string, string>;
  isActive: boolean;
  isPrimary: boolean;
  order: number;
  updatedAt: Timestamp;
}

// ============================================================================
// SERVICES
// ============================================================================

export type ServiceCategory =
  | 'web-development'
  | 'mobile-development'
  | 'backend-development'
  | 'devops'
  | 'consulting'
  | 'ui-ux-design'
  | 'api-development'
  | 'database'
  | 'cloud'
  | 'security'
  | 'other';

export const SERVICE_CATEGORY_NAMES: Record<ServiceCategory, string> = {
  'web-development': 'Web Development',
  'mobile-development': 'Mobile Development',
  'backend-development': 'Backend Development',
  devops: 'DevOps',
  consulting: 'Consulting',
  'ui-ux-design': 'UI/UX Design',
  'api-development': 'API Development',
  database: 'Database',
  cloud: 'Cloud Services',
  security: 'Security',
  other: 'Other',
};

export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: ServiceCategory;
  icon?: string;
  features?: string[];
  technologies?: string[];
  priceRange?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: Timestamp;
}

// ============================================================================
// SKILLS
// ============================================================================

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'devops'
  | 'cloud'
  | 'tools'
  | 'languages'
  | 'frameworks'
  | 'soft-skills'
  | 'other';

export const SKILL_CATEGORY_NAMES: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  database: 'Database',
  devops: 'DevOps',
  cloud: 'Cloud',
  tools: 'Tools',
  languages: 'Languages',
  frameworks: 'Frameworks',
  'soft-skills': 'Soft Skills',
  other: 'Other',
};

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const SKILL_LEVEL_NAMES: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience?: number;
  icon?: string;
  color?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: Timestamp;
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorAvatar?: string;
  authorLinkedin?: string;
  content: string;
  shortContent?: string;
  rating?: number;
  projectName?: string;
  projectUrl?: string;
  date?: Timestamp;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: Timestamp;
}

// ============================================================================
// HOOK OPTIONS & RESULTS
// ============================================================================

export interface UseCommonFeatureOptions {
  autoFetch?: boolean;
  realtime?: boolean;
}

export interface UseCommonFeatureResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCommonFeaturesListResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// FETCH OPTIONS
// ============================================================================

export interface FetchSocialLinksOptions {
  showIn?: ('footer' | 'contact' | 'about' | 'header')[];
  activeOnly?: boolean;
}

export interface FetchServicesOptions {
  category?: ServiceCategory;
  activeOnly?: boolean;
  featuredOnly?: boolean;
}

export interface FetchSkillsOptions {
  category?: SkillCategory;
  activeOnly?: boolean;
  featuredOnly?: boolean;
}

export interface FetchTestimonialsOptions {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}

export interface FetchPaymentOptionsOptions {
  activeOnly?: boolean;
  type?: PaymentType;
}

// ============================================================================
// PROJECTS / PORTFOLIO
// ============================================================================

export type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'archived';

export const PROJECT_STATUS_NAMES: Record<ProjectStatus, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  planned: 'Planned',
  archived: 'Archived',
};

export type ProjectCategory =
  | 'web-app'
  | 'mobile-app'
  | 'desktop-app'
  | 'api'
  | 'library'
  | 'cli-tool'
  | 'browser-extension'
  | 'open-source'
  | 'client-work'
  | 'personal'
  | 'other';

export const PROJECT_CATEGORY_NAMES: Record<ProjectCategory, string> = {
  'web-app': 'Web Application',
  'mobile-app': 'Mobile App',
  'desktop-app': 'Desktop App',
  api: 'API / Backend',
  library: 'Library / Package',
  'cli-tool': 'CLI Tool',
  'browser-extension': 'Browser Extension',
  'open-source': 'Open Source',
  'client-work': 'Client Work',
  personal: 'Personal Project',
  other: 'Other',
};

export interface ProjectLink {
  type: 'live' | 'github' | 'demo' | 'docs' | 'playstore' | 'appstore' | 'npm' | 'other';
  url: string;
  label?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  thumbnailUrl?: string;
  images?: string[];
  technologies: string[];
  features?: string[];
  links?: ProjectLink[];
  clientName?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: Timestamp;
}

export interface FetchProjectsOptions {
  category?: ProjectCategory;
  status?: ProjectStatus;
  activeOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}
