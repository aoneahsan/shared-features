/**
 * Admin Common Features Service
 *
 * Admin CRUD operations for managing common features data.
 * These functions modify the zaions_* collections in Firestore.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getSharedFeaturesDb } from '../firebase/init';
import {
  COMMON_FEATURE_COLLECTIONS,
  type ContactInfo,
  type DeveloperInfo,
  type AddressInfo,
  type SocialLink,
  type PaymentOption,
  type Service,
  type Skill,
  type Testimonial,
  type Project,
} from '../types/commonFeatures';
import {
  clearContactInfoCache,
  clearDeveloperInfoCache,
  clearAddressInfoCache,
  clearSocialLinksCache,
  clearPaymentOptionsCache,
  clearServicesCache,
  clearSkillsCache,
  clearTestimonialsCache,
  clearProjectsCache,
} from './commonFeatures';

// ============================================================================
// CONTACT INFO ADMIN
// ============================================================================

export type ContactInfoInput = Omit<ContactInfo, 'id' | 'updatedAt'>;

export async function saveContactInfo(data: ContactInfoInput): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.CONTACT_INFO, 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearContactInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error saving contact info:', error);
    return false;
  }
}

export async function updateContactInfo(data: Partial<ContactInfoInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.CONTACT_INFO, 'main');
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearContactInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating contact info:', error);
    return false;
  }
}

// ============================================================================
// DEVELOPER INFO ADMIN
// ============================================================================

export type DeveloperInfoInput = Omit<DeveloperInfo, 'id' | 'updatedAt'>;

export async function saveDeveloperInfo(data: DeveloperInfoInput): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.DEVELOPER_INFO, 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearDeveloperInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error saving developer info:', error);
    return false;
  }
}

export async function updateDeveloperInfo(data: Partial<DeveloperInfoInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.DEVELOPER_INFO, 'main');
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearDeveloperInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating developer info:', error);
    return false;
  }
}

// ============================================================================
// ADDRESS INFO ADMIN
// ============================================================================

export type AddressInfoInput = Omit<AddressInfo, 'id' | 'updatedAt'>;

export async function saveAddressInfo(data: AddressInfoInput): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.ADDRESS_INFO, 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearAddressInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error saving address info:', error);
    return false;
  }
}

export async function updateAddressInfo(data: Partial<AddressInfoInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.ADDRESS_INFO, 'main');
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearAddressInfoCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating address info:', error);
    return false;
  }
}

// ============================================================================
// SOCIAL LINKS ADMIN
// ============================================================================

export type SocialLinkInput = Omit<SocialLink, 'id' | 'updatedAt'>;

export async function createSocialLink(data: SocialLinkInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.SOCIAL_LINKS);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearSocialLinksCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating social link:', error);
    return null;
  }
}

export async function updateSocialLink(id: string, data: Partial<SocialLinkInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SOCIAL_LINKS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearSocialLinksCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating social link:', error);
    return false;
  }
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SOCIAL_LINKS, id);
    await deleteDoc(docRef);
    clearSocialLinksCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting social link:', error);
    return false;
  }
}

// ============================================================================
// PAYMENT OPTIONS ADMIN
// ============================================================================

export type PaymentOptionInput = Omit<PaymentOption, 'id' | 'updatedAt'>;

export async function createPaymentOption(data: PaymentOptionInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.PAYMENT_OPTIONS);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearPaymentOptionsCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating payment option:', error);
    return null;
  }
}

export async function updatePaymentOption(id: string, data: Partial<PaymentOptionInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.PAYMENT_OPTIONS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearPaymentOptionsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating payment option:', error);
    return false;
  }
}

export async function deletePaymentOption(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.PAYMENT_OPTIONS, id);
    await deleteDoc(docRef);
    clearPaymentOptionsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting payment option:', error);
    return false;
  }
}

// ============================================================================
// SERVICES ADMIN
// ============================================================================

export type ServiceInput = Omit<Service, 'id' | 'updatedAt'>;

export async function createService(data: ServiceInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.SERVICES);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearServicesCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating service:', error);
    return null;
  }
}

export async function updateService(id: string, data: Partial<ServiceInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SERVICES, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearServicesCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating service:', error);
    return false;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SERVICES, id);
    await deleteDoc(docRef);
    clearServicesCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting service:', error);
    return false;
  }
}

// ============================================================================
// SKILLS ADMIN
// ============================================================================

export type SkillInput = Omit<Skill, 'id' | 'updatedAt'>;

export async function createSkill(data: SkillInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.SKILLS);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearSkillsCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating skill:', error);
    return null;
  }
}

export async function updateSkill(id: string, data: Partial<SkillInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SKILLS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearSkillsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating skill:', error);
    return false;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.SKILLS, id);
    await deleteDoc(docRef);
    clearSkillsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting skill:', error);
    return false;
  }
}

// ============================================================================
// TESTIMONIALS ADMIN
// ============================================================================

export type TestimonialInput = Omit<Testimonial, 'id' | 'updatedAt'>;

export async function createTestimonial(data: TestimonialInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.TESTIMONIALS);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearTestimonialsCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating testimonial:', error);
    return null;
  }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.TESTIMONIALS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearTestimonialsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating testimonial:', error);
    return false;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.TESTIMONIALS, id);
    await deleteDoc(docRef);
    clearTestimonialsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting testimonial:', error);
    return false;
  }
}

// ============================================================================
// PROJECTS ADMIN
// ============================================================================

export type ProjectInput = Omit<Project, 'id' | 'updatedAt'>;

export async function createProject(data: ProjectInput): Promise<string | null> {
  try {
    const db = getSharedFeaturesDb();
    const colRef = collection(db, COMMON_FEATURE_COLLECTIONS.PROJECTS);
    const docRef = await addDoc(colRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearProjectsCache();
    return docRef.id;
  } catch (error) {
    console.error('[shared-features admin] Error creating project:', error);
    return null;
  }
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.PROJECTS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    clearProjectsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error updating project:', error);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const db = getSharedFeaturesDb();
    const docRef = doc(db, COMMON_FEATURE_COLLECTIONS.PROJECTS, id);
    await deleteDoc(docRef);
    clearProjectsCache();
    return true;
  } catch (error) {
    console.error('[shared-features admin] Error deleting project:', error);
    return false;
  }
}
