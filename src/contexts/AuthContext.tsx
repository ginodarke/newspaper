import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';

export interface User {
  id: string;
  email?: string | null;
  preferences?: {
    categories?: string[];
    sources?: string[];
    interests?: string[];
    location?: string;
  };
  // Add any other user properties you need
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signOut: () => Promise<void>;
  setUserAfterSignUp: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user on mount
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        
        if (data?.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Subscribe to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email
        });
        return { success: true, error: null };
      }

      return { success: false, error: new Error('Sign in failed') };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email
        });
        return { success: true, error: null };
      }

      return { success: false, error: new Error('Sign up failed') };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setUserAfterSignUp = (newUser: User) => {
    console.log('Setting user after signup:', newUser);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUserAfterSignUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 