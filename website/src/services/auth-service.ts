import { signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { ADMIN_EMAIL } from '@/config/constants';
import type { UserDocument } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Initiates Google sign-in via Firebase popup flow.
 * After successful authentication, creates or updates the user document in Firestore.
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user);
  return result.user;
}

/**
 * Signs out the current user from Firebase authentication.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Creates a new user document in Firestore on first login,
 * or updates the lastLogin timestamp on subsequent logins.
 */
export async function createUserDocument(user: User): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUserDoc: Omit<UserDocument, 'createdAt' | 'lastLogin' | 'updatedAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      lastLogin: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'google',
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isAdmin: user.email === ADMIN_EMAIL,
      preferences: {
        theme: 'auto',
        emailNotifications: true,
      },
    };

    await setDoc(userRef, newUserDoc);
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    });
  }
}

/**
 * Fetches a user document from the Firestore 'users' collection by UID.
 * Returns null if the document does not exist.
 */
export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserDocument;
}
