/**
 * Common Features Service
 *
 * Handles fetching common features from the centralized
 * aoneahsan.com Firebase backend.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import { getConfig } from '../firebase/config';
import { isFeatureEnabled } from './featureFlags';
import {
  COMMON_FEATURE_COLLECTIONS,
  type ContactInfo,
  type DeveloperInfo,
  type SocialLink,
  type AddressInfo,
  type PaymentOption,
  type Service,
  type Skill,
  type Testimonial,
  type Project,
  type FetchSocialLinksOptions,
  type FetchServicesOptions,
  type FetchSkillsOptions,
  type FetchTestimonialsOptions,
  type FetchPaymentOptionsOptions,
  type FetchProjectsOptions,
} from '../types/commonFeatures';

// ============================================================================
// CACHE
// ============================================================================

interface Cache<T> {
  data: T | null;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let contactInfoCache: Cache<ContactInfo> | null = null;
let developerInfoCache: Cache<DeveloperInfo> | null = null;
let addressInfoCache: Cache<AddressInfo> | null = null;
let socialLinksCache: Cache<SocialLink[]> | null = null;
let paymentOptionsCache: Cache<PaymentOption[]> | null = null;
let servicesCache: Cache<Service[]> | null = null;
let skillsCache: Cache<Skill[]> | null = null;
let testimonialsCache: Cache<Testimonial[]> | null = null;
let projectsCache: Cache<Project[]> | null = null;

function isCacheValid<T>(cache: Cache<T> | null): boolean {
  if (!cache || !cache.data) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

export function clearAllCommonFeaturesCache(): void {
  contactInfoCache = null;
  developerInfoCache = null;
  addressInfoCache = null;
  socialLinksCache = null;
  paymentOptionsCache = null;
  servicesCache = null;
  skillsCache = null;
  testimonialsCache = null;
  projectsCache = null;
}

// ============================================================================
// CONTACT INFO
// ============================================================================

function docToContactInfo(docId: string, data: Record<string, unknown>): ContactInfo {
  // Portfolio may nest timezone in location object
  const locationObj = data.location as Record<string, unknown> | undefined;
  return {
    id: docId,
    email: (data.email as string) || '',
    supportEmail: data.supportEmail as string | undefined,
    phone: data.phone as string | undefined,
    whatsapp: data.whatsapp as string | undefined,
    telegram: data.telegram as string | undefined,
    skype: data.skype as string | undefined,
    freelanceAvailable: ((data.freelanceAvailable ?? data.availableForFreelance) as boolean) ?? false,
    workingHours: data.workingHours as string | undefined,
    timezone: (data.timezone ?? (typeof locationObj === 'object' && locationObj ? locationObj.timezone : undefined)) as string | undefined,
    preferredContact: (data.preferredContact ?? data.preferredContactMethod) as ContactInfo['preferredContact'],
    responseTime: data.responseTime as string | undefined,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchContactInfo(): Promise<ContactInfo | null> {
  if (!isFeatureEnabled('contactInfo')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] contactInfo feature is disabled');
    return null;
  }

  if (isCacheValid(contactInfoCache)) return contactInfoCache!.data;

  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.CONTACT_INFO, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docToContactInfo(docSnap.id, docSnap.data());
    contactInfoCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching contact info:', error);
    return contactInfoCache?.data ?? null;
  }
}

export function subscribeToContactInfo(callback: (data: ContactInfo | null) => void): Unsubscribe {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.CONTACT_INFO, 'main');

  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    const data = docToContactInfo(docSnap.id, docSnap.data());
    contactInfoCache = { data, timestamp: Date.now() };
    callback(data);
  });
}

export function clearContactInfoCache(): void {
  contactInfoCache = null;
}

// ============================================================================
// DEVELOPER INFO
// ============================================================================

function docToDeveloperInfo(docId: string, data: Record<string, unknown>): DeveloperInfo {
  return {
    id: docId,
    name: (data.name as string) || '',
    title: (data.title as string) || '',
    tagline: data.tagline as string | undefined,
    bio: (data.bio as string) || '',
    shortBio: data.shortBio as string | undefined,
    avatar: data.avatar as string | undefined,
    website: data.website as string | undefined,
    github: data.github as string | undefined,
    linkedin: data.linkedin as string | undefined,
    twitter: data.twitter as string | undefined,
    yearsOfExperience: data.yearsOfExperience as number | undefined,
    location: data.location as string | undefined,
    availableForHire: (data.availableForHire as boolean) ?? false,
    resumeUrl: data.resumeUrl as string | undefined,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchDeveloperInfo(): Promise<DeveloperInfo | null> {
  if (!isFeatureEnabled('developerInfo')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] developerInfo feature is disabled');
    return null;
  }

  if (isCacheValid(developerInfoCache)) return developerInfoCache!.data;

  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.DEVELOPER_INFO, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docToDeveloperInfo(docSnap.id, docSnap.data());
    developerInfoCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching developer info:', error);
    return developerInfoCache?.data ?? null;
  }
}

export function subscribeToDeveloperInfo(callback: (data: DeveloperInfo | null) => void): Unsubscribe {
  const db = getSharedFeaturesDb();
  const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.DEVELOPER_INFO, 'main');

  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    const data = docToDeveloperInfo(docSnap.id, docSnap.data());
    developerInfoCache = { data, timestamp: Date.now() };
    callback(data);
  });
}

export function clearDeveloperInfoCache(): void {
  developerInfoCache = null;
}

// ============================================================================
// ADDRESS INFO
// ============================================================================

function docToAddressInfo(docId: string, data: Record<string, unknown>): AddressInfo {
  // Portfolio may nest address fields in addressDetails object
  const details = (data.addressDetails as Record<string, unknown>) || {};
  const coords = data.coordinates as { lat?: number; lng?: number } | undefined;
  return {
    id: docId,
    label: data.label as string | undefined,
    streetAddress: (data.streetAddress ?? details.streetAddress) as string | undefined,
    apartment: (data.apartment ?? details.apartment) as string | undefined,
    city: (data.city ?? details.city) as string | undefined,
    state: (data.state ?? details.state) as string | undefined,
    postalCode: (data.postalCode ?? details.postalCode) as string | undefined,
    country: (data.country ?? details.country) as string | undefined,
    landmark: (data.landmark ?? details.landmark) as string | undefined,
    fullAddress: (data.fullAddress ?? data.displayAddress) as string | undefined,
    googleMapsUrl: (data.googleMapsUrl ?? data.googleMapsLink) as string | undefined,
    googleMapsEmbedUrl: data.googleMapsEmbedUrl as string | undefined,
    coordinates: coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
      ? { lat: coords.lat, lng: coords.lng }
      : undefined,
    showMap: (data.showMap as boolean) ?? false,
    isPublic: (data.isPublic as boolean) ?? false,
    workingHours: data.workingHours as string | undefined,
    additionalInfo: data.additionalInfo as string | undefined,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchAddressInfo(): Promise<AddressInfo | null> {
  if (!isFeatureEnabled('addressInfo')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] addressInfo feature is disabled');
    return null;
  }

  if (isCacheValid(addressInfoCache)) return addressInfoCache!.data;

  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.ADDRESS_INFO, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docToAddressInfo(docSnap.id, docSnap.data());

    // Only return if public or user is authorized
    if (!data.isPublic) return null;

    addressInfoCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching address info:', error);
    return addressInfoCache?.data ?? null;
  }
}

export function clearAddressInfoCache(): void {
  addressInfoCache = null;
}

// ============================================================================
// SOCIAL LINKS
// ============================================================================

/**
 * Build showIn array from individual boolean fields written by portfolio admin.
 * Portfolio writes showInFooter, showInContact, showInAbout, showInHeader as booleans.
 */
function buildShowInArray(data: Record<string, unknown>): SocialLink['showIn'] | undefined {
  const hasAnyBool = 'showInFooter' in data || 'showInContact' in data || 'showInAbout' in data || 'showInHeader' in data;
  if (!hasAnyBool) return undefined;
  const result: SocialLink['showIn'] = [];
  if (data.showInFooter) result.push('footer');
  if (data.showInContact) result.push('contact');
  if (data.showInAbout) result.push('about');
  if (data.showInHeader) result.push('header');
  return result.length > 0 ? result : ['footer'];
}

function docToSocialLink(docId: string, data: Record<string, unknown>): SocialLink {
  return {
    id: docId,
    platform: data.platform as SocialLink['platform'],
    url: (data.url as string) || '',
    displayName: data.displayName as string | undefined,
    username: data.username as string | undefined,
    icon: data.icon as string | undefined,
    order: (data.order as number) ?? 0,
    isActive: ((data.isActive ?? data.enabled) as boolean) ?? true,
    showIn: (data.showIn as SocialLink['showIn']) ?? buildShowInArray(data) ?? ['footer'],
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchSocialLinks(options: FetchSocialLinksOptions = {}): Promise<SocialLink[]> {
  if (!isFeatureEnabled('socialLinks')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] socialLinks feature is disabled');
    return [];
  }

  // Use cache for unfiltered queries
  if (!options.showIn && options.activeOnly !== false && isCacheValid(socialLinksCache)) {
    return socialLinksCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.SOCIAL_LINKS), orderBy('order', 'asc'));

    const snapshot = await getDocs(q);
    let links = snapshot.docs.map((d) => docToSocialLink(d.id, d.data()));

    // Filter by active
    if (options.activeOnly !== false) {
      links = links.filter((l) => l.isActive);
    }

    // Filter by showIn
    if (options.showIn && options.showIn.length > 0) {
      links = links.filter((l) => options.showIn!.some((loc) => l.showIn.includes(loc)));
    }

    // Cache unfiltered results
    if (!options.showIn && options.activeOnly !== false) {
      socialLinksCache = { data: links, timestamp: Date.now() };
    }

    return links;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching social links:', error);
    return socialLinksCache?.data ?? [];
  }
}

export function clearSocialLinksCache(): void {
  socialLinksCache = null;
}

// ============================================================================
// PAYMENT OPTIONS
// ============================================================================

function docToPaymentOption(docId: string, data: Record<string, unknown>): PaymentOption {
  return {
    id: docId,
    type: data.type as PaymentOption['type'],
    name: (data.name as string) || '',
    displayName: data.displayName as string | undefined,
    description: data.description as string | undefined,
    instructions: data.instructions as string | undefined,
    icon: data.icon as string | undefined,
    details: (data.details as PaymentOption['details']) || {},
    isActive: ((data.isActive ?? data.enabled) as boolean) ?? true,
    isPrimary: (data.isPrimary as boolean) ?? false,
    order: (data.order as number) ?? 0,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchPaymentOptions(options: FetchPaymentOptionsOptions = {}): Promise<PaymentOption[]> {
  if (!isFeatureEnabled('paymentOptions')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] paymentOptions feature is disabled');
    return [];
  }

  if (!options.type && options.activeOnly !== false && isCacheValid(paymentOptionsCache)) {
    return paymentOptionsCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.PAYMENT_OPTIONS), orderBy('order', 'asc'));

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map((d) => docToPaymentOption(d.id, d.data()));

    if (options.activeOnly !== false) {
      items = items.filter((i) => i.isActive);
    }

    if (options.type) {
      items = items.filter((i) => i.type === options.type);
    }

    if (!options.type && options.activeOnly !== false) {
      paymentOptionsCache = { data: items, timestamp: Date.now() };
    }

    return items;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching payment options:', error);
    return paymentOptionsCache?.data ?? [];
  }
}

export function clearPaymentOptionsCache(): void {
  paymentOptionsCache = null;
}

// ============================================================================
// SERVICES
// ============================================================================

function docToService(docId: string, data: Record<string, unknown>): Service {
  return {
    id: docId,
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    shortDescription: data.shortDescription as string | undefined,
    category: data.category as Service['category'],
    icon: data.icon as string | undefined,
    features: data.features as string[] | undefined,
    technologies: data.technologies as string[] | undefined,
    priceRange: data.priceRange as string | undefined,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    order: (data.order as number) ?? 0,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchServices(options: FetchServicesOptions = {}): Promise<Service[]> {
  if (!isFeatureEnabled('services')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] services feature is disabled');
    return [];
  }

  if (!options.category && !options.featuredOnly && options.activeOnly !== false && isCacheValid(servicesCache)) {
    return servicesCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.SERVICES), orderBy('order', 'asc'));

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map((d) => docToService(d.id, d.data()));

    if (options.activeOnly !== false) {
      items = items.filter((i) => i.isActive);
    }

    if (options.featuredOnly) {
      items = items.filter((i) => i.isFeatured);
    }

    if (options.category) {
      items = items.filter((i) => i.category === options.category);
    }

    if (!options.category && !options.featuredOnly && options.activeOnly !== false) {
      servicesCache = { data: items, timestamp: Date.now() };
    }

    return items;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching services:', error);
    return servicesCache?.data ?? [];
  }
}

export function clearServicesCache(): void {
  servicesCache = null;
}

// ============================================================================
// SKILLS
// ============================================================================

function docToSkill(docId: string, data: Record<string, unknown>): Skill {
  return {
    id: docId,
    name: (data.name as string) || '',
    category: data.category as Skill['category'],
    level: data.level as Skill['level'],
    yearsOfExperience: data.yearsOfExperience as number | undefined,
    icon: data.icon as string | undefined,
    color: data.color as string | undefined,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    order: (data.order as number) ?? 0,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchSkills(options: FetchSkillsOptions = {}): Promise<Skill[]> {
  if (!isFeatureEnabled('skills')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] skills feature is disabled');
    return [];
  }

  if (!options.category && !options.featuredOnly && options.activeOnly !== false && isCacheValid(skillsCache)) {
    return skillsCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.SKILLS), orderBy('order', 'asc'));

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map((d) => docToSkill(d.id, d.data()));

    if (options.activeOnly !== false) {
      items = items.filter((i) => i.isActive);
    }

    if (options.featuredOnly) {
      items = items.filter((i) => i.isFeatured);
    }

    if (options.category) {
      items = items.filter((i) => i.category === options.category);
    }

    if (!options.category && !options.featuredOnly && options.activeOnly !== false) {
      skillsCache = { data: items, timestamp: Date.now() };
    }

    return items;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching skills:', error);
    return skillsCache?.data ?? [];
  }
}

export function clearSkillsCache(): void {
  skillsCache = null;
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

function docToTestimonial(docId: string, data: Record<string, unknown>): Testimonial {
  return {
    id: docId,
    authorName: ((data.authorName ?? data.name) as string) || '',
    authorTitle: (data.authorTitle ?? data.title) as string | undefined,
    authorCompany: (data.authorCompany ?? data.company) as string | undefined,
    authorAvatar: (data.authorAvatar ?? data.avatar) as string | undefined,
    authorLinkedin: (data.authorLinkedin ?? data.profileUrl) as string | undefined,
    content: ((data.content ?? data.text) as string) || '',
    shortContent: data.shortContent as string | undefined,
    rating: data.rating as number | undefined,
    projectName: data.projectName as string | undefined,
    projectUrl: data.projectUrl as string | undefined,
    date: data.date as Timestamp | undefined,
    isActive: ((data.isActive ?? data.enabled) as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    order: (data.order as number) ?? 0,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchTestimonials(options: FetchTestimonialsOptions = {}): Promise<Testimonial[]> {
  if (!isFeatureEnabled('testimonials')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] testimonials feature is disabled');
    return [];
  }

  if (!options.featuredOnly && !options.limit && options.activeOnly !== false && isCacheValid(testimonialsCache)) {
    return testimonialsCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.TESTIMONIALS), orderBy('order', 'asc'));

    if (options.limit) {
      q = query(q, firestoreLimit(options.limit));
    }

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map((d) => docToTestimonial(d.id, d.data()));

    if (options.activeOnly !== false) {
      items = items.filter((i) => i.isActive);
    }

    if (options.featuredOnly) {
      items = items.filter((i) => i.isFeatured);
    }

    if (!options.featuredOnly && !options.limit && options.activeOnly !== false) {
      testimonialsCache = { data: items, timestamp: Date.now() };
    }

    return items;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching testimonials:', error);
    return testimonialsCache?.data ?? [];
  }
}

export function clearTestimonialsCache(): void {
  testimonialsCache = null;
}

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * Build ProjectLink[] from flat URL fields written by portfolio admin.
 * Portfolio writes liveUrl, githubUrl, playStoreUrl, etc. as individual string fields.
 */
function buildLinksFromFlatUrls(data: Record<string, unknown>): Project['links'] | undefined {
  const links: NonNullable<Project['links']> = [];
  if (data.liveUrl) links.push({ type: 'live', url: data.liveUrl as string });
  if (data.githubUrl) links.push({ type: 'github', url: data.githubUrl as string });
  if (data.playStoreUrl) links.push({ type: 'playstore', url: data.playStoreUrl as string });
  if (data.appStoreUrl) links.push({ type: 'appstore', url: data.appStoreUrl as string });
  if (data.npmUrl) links.push({ type: 'npm', url: data.npmUrl as string });
  if (data.docsUrl) links.push({ type: 'docs', url: data.docsUrl as string });
  if (data.demoUrl) links.push({ type: 'demo', url: data.demoUrl as string });
  if (data.chromeExtensionUrl) links.push({ type: 'other', url: data.chromeExtensionUrl as string, label: 'Chrome Extension' });
  if (data.firefoxExtensionUrl) links.push({ type: 'other', url: data.firefoxExtensionUrl as string, label: 'Firefox Extension' });
  if (data.edgeExtensionUrl) links.push({ type: 'other', url: data.edgeExtensionUrl as string, label: 'Edge Extension' });
  return links.length > 0 ? links : undefined;
}

function docToProject(docId: string, data: Record<string, unknown>): Project {
  return {
    id: docId,
    title: (data.title as string) || '',
    slug: ((data.slug ?? data.appIdentifier) as string) || '',
    description: ((data.description ?? data.longDescription) as string) || '',
    shortDescription: data.shortDescription as string | undefined,
    category: data.category as Project['category'],
    status: data.status as Project['status'],
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    images: data.images as string[] | undefined,
    technologies: ((data.technologies ?? data.techStack) as string[]) || [],
    features: data.features as string[] | undefined,
    links: (data.links as Project['links']) ?? buildLinksFromFlatUrls(data),
    clientName: data.clientName as string | undefined,
    startDate: data.startDate as string | undefined,
    endDate: data.endDate as string | undefined,
    isActive: ((data.isActive ?? data.enabled) as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    order: (data.order as number) ?? 0,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function fetchProjects(options: FetchProjectsOptions = {}): Promise<Project[]> {
  if (!isFeatureEnabled('projects')) {
    const config = getConfig();
    if (config.debug) console.log('[shared-features] projects feature is disabled');
    return [];
  }

  if (!options.category && !options.status && !options.featuredOnly && !options.limit && options.activeOnly !== false && isCacheValid(projectsCache)) {
    return projectsCache!.data ?? [];
  }

  try {
    const db = getSharedFeaturesDb();
    let q = query(collection(db, COMMON_FEATURE_COLLECTIONS.PROJECTS), orderBy('order', 'asc'));

    if (options.limit) {
      q = query(q, firestoreLimit(options.limit));
    }

    const snapshot = await getDocs(q);
    let items = snapshot.docs.map((d) => docToProject(d.id, d.data()));

    if (options.activeOnly !== false) {
      items = items.filter((i) => i.isActive);
    }

    if (options.featuredOnly) {
      items = items.filter((i) => i.isFeatured);
    }

    if (options.category) {
      items = items.filter((i) => i.category === options.category);
    }

    if (options.status) {
      items = items.filter((i) => i.status === options.status);
    }

    if (!options.category && !options.status && !options.featuredOnly && !options.limit && options.activeOnly !== false) {
      projectsCache = { data: items, timestamp: Date.now() };
    }

    return items;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching projects:', error);
    return projectsCache?.data ?? [];
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!isFeatureEnabled('projects')) return null;

  try {
    // First check cache
    if (isCacheValid(projectsCache)) {
      const cached = projectsCache!.data?.find((p) => p.slug === slug);
      if (cached) return cached;
    }

    // Fetch all and find
    const projects = await fetchProjects();
    return projects.find((p) => p.slug === slug) ?? null;
  } catch (error) {
    const config = getConfig();
    if (config.debug) console.error('[shared-features] Error fetching project by slug:', error);
    return null;
  }
}

export function clearProjectsCache(): void {
  projectsCache = null;
}
