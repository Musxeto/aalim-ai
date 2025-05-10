import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOutUser, signUp, signInWithGoogle, sendPasswordResetEmail } from '../firebase';
import { User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  signInGoogle: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proper auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevent rendering children until loading is complete
  }

  const signup = async (email: string, password: string) => {
    await signUp(email, password);
    const user = getCurrentUser();
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const login = async (email: string, password: string) => {
    await signIn(email, password);
    const user = getCurrentUser();
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = async () => {
    await signOutUser();
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const signInGoogle = async () => {
    await signInWithGoogle();
    const user = getCurrentUser();
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, signup, signInGoogle, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);