import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOutUser } from '../firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        setLoading(false);
      } catch (error) {
        setCurrentUser(null);
        setLoading(false);
      }
    };

    return unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      const user = getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);