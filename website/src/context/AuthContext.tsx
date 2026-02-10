import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserDocument, createUserDocument } from '@/services/auth-service';
import { ADMIN_EMAIL } from '@/config/constants';
import type { UserDocument } from '@/types';

interface AuthContextValue {
  /** The currently authenticated Firebase user, or null if signed out. */
  user: User | null;
  /** The user's Firestore document with profile data and preferences. */
  userDoc: UserDocument | null;
  /** Whether the initial auth state is still being determined. */
  loading: boolean;
  /** Whether the current user has admin privileges. */
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication state to the component tree.
 * Listens to Firebase auth state changes and fetches/creates the
 * corresponding Firestore user document.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          await createUserDocument(firebaseUser);
          const fetchedDoc = await getUserDocument(firebaseUser.uid);
          setUserDoc(fetchedDoc);
        } catch (error) {
          console.error('Failed to fetch user document:', error);
          setUserDoc(null);
        }
      } else {
        setUserDoc(null);
      }

      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const value: AuthContextValue = {
    user,
    userDoc,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the current authentication state.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
