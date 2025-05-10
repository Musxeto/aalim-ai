import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return currentUser ? children : <Navigate to="/" replace />;
};