import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOutUser, signUp } from '../firebase';
import { User } from 'firebase/auth';
import {auth} from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
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

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);