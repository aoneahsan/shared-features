/**
 * Common Features Hooks
 *
 * React hooks for fetching and using common features in consumer projects.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { isInitialized } from '../firebase/config';
import {
  fetchContactInfo,
  subscribeToContactInfo,
  clearContactInfoCache,
  fetchDeveloperInfo,
  subscribeToDeveloperInfo,
  clearDeveloperInfoCache,
  fetchAddressInfo,
  clearAddressInfoCache,
  fetchSocialLinks,
  clearSocialLinksCache,
  fetchPaymentOptions,
  clearPaymentOptionsCache,
  fetchServices,
  clearServicesCache,
  fetchSkills,
  clearSkillsCache,
  fetchTestimonials,
  clearTestimonialsCache,
} from '../services/commonFeatures';
import type {
  ContactInfo,
  DeveloperInfo,
  AddressInfo,
  SocialLink,
  PaymentOption,
  Service,
  Skill,
  Testimonial,
  UseCommonFeatureOptions,
  UseCommonFeatureResult,
  UseCommonFeaturesListResult,
  FetchSocialLinksOptions,
  FetchServicesOptions,
  FetchSkillsOptions,
  FetchTestimonialsOptions,
  FetchPaymentOptionsOptions,
} from '../types/commonFeatures';

// ============================================================================
// CONTACT INFO
// ============================================================================

/**
 * Hook to fetch contact information
 *
 * @example
 * ```tsx
 * const { data: contact, loading } = useContactInfo();
 *
 * if (loading) return <Spinner />;
 * if (!contact) return null;
 *
 * return <a href={`mailto:${contact.email}`}>{contact.email}</a>;
 * ```
 */
export function useContactInfo(
  options: UseCommonFeatureOptions = {}
): UseCommonFeatureResult<ContactInfo> {
  const { autoFetch = true, realtime = false } = options;

  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchContactInfo();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact info');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    clearContactInfoCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;

    if (realtime && isInitialized()) {
      const unsubscribe = subscribeToContactInfo((result) => {
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      });
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }

    if (autoFetch) fetch();

    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, realtime, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// DEVELOPER INFO
// ============================================================================

/**
 * Hook to fetch developer information
 *
 * @example
 * ```tsx
 * const { data: developer, loading } = useDeveloperInfo();
 *
 * if (loading) return <Spinner />;
 * if (!developer) return null;
 *
 * return (
 *   <div>
 *     <h1>{developer.name}</h1>
 *     <p>{developer.title}</p>
 *   </div>
 * );
 * ```
 */
export function useDeveloperInfo(
  options: UseCommonFeatureOptions = {}
): UseCommonFeatureResult<DeveloperInfo> {
  const { autoFetch = true, realtime = false } = options;

  const [data, setData] = useState<DeveloperInfo | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchDeveloperInfo();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch developer info');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    clearDeveloperInfoCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;

    if (realtime && isInitialized()) {
      const unsubscribe = subscribeToDeveloperInfo((result) => {
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      });
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }

    if (autoFetch) fetch();

    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, realtime, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// ADDRESS INFO
// ============================================================================

/**
 * Hook to fetch address information
 */
export function useAddressInfo(
  options: UseCommonFeatureOptions = {}
): UseCommonFeatureResult<AddressInfo> {
  const { autoFetch = true } = options;

  const [data, setData] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchAddressInfo();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch address info');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    clearAddressInfoCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// SOCIAL LINKS
// ============================================================================

/**
 * Hook to fetch social links
 *
 * @example
 * ```tsx
 * const { data: links, loading } = useSocialLinks({ showIn: ['footer'] });
 *
 * if (loading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {links.map(link => (
 *       <a key={link.id} href={link.url}>{link.platform}</a>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useSocialLinks(
  options: FetchSocialLinksOptions & UseCommonFeatureOptions = {}
): UseCommonFeaturesListResult<SocialLink> {
  const { autoFetch = true, showIn, activeOnly } = options;

  const [data, setData] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSocialLinks({ showIn, activeOnly });
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch social links');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [showIn, activeOnly]);

  const refetch = useCallback(async () => {
    clearSocialLinksCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// PAYMENT OPTIONS
// ============================================================================

/**
 * Hook to fetch payment options
 */
export function usePaymentOptions(
  options: FetchPaymentOptionsOptions & UseCommonFeatureOptions = {}
): UseCommonFeaturesListResult<PaymentOption> {
  const { autoFetch = true, activeOnly, type } = options;

  const [data, setData] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchPaymentOptions({ activeOnly, type });
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payment options');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [activeOnly, type]);

  const refetch = useCallback(async () => {
    clearPaymentOptionsCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// SERVICES
// ============================================================================

/**
 * Hook to fetch services
 */
export function useServices(
  options: FetchServicesOptions & UseCommonFeatureOptions = {}
): UseCommonFeaturesListResult<Service> {
  const { autoFetch = true, category, activeOnly, featuredOnly } = options;

  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchServices({ category, activeOnly, featuredOnly });
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [category, activeOnly, featuredOnly]);

  const refetch = useCallback(async () => {
    clearServicesCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// SKILLS
// ============================================================================

/**
 * Hook to fetch skills
 */
export function useSkills(
  options: FetchSkillsOptions & UseCommonFeatureOptions = {}
): UseCommonFeaturesListResult<Skill> {
  const { autoFetch = true, category, activeOnly, featuredOnly } = options;

  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSkills({ category, activeOnly, featuredOnly });
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [category, activeOnly, featuredOnly]);

  const refetch = useCallback(async () => {
    clearSkillsCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

/**
 * Hook to fetch testimonials
 */
export function useTestimonials(
  options: FetchTestimonialsOptions & UseCommonFeatureOptions = {}
): UseCommonFeaturesListResult<Testimonial> {
  const { autoFetch = true, activeOnly, featuredOnly, limit } = options;

  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!isInitialized()) {
      setError('shared-features not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchTestimonials({ activeOnly, featuredOnly, limit });
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [activeOnly, featuredOnly, limit]);

  const refetch = useCallback(async () => {
    clearTestimonialsCache();
    await fetch();
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetch]);

  return { data, loading, error, refetch };
}
