import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JSX } from 'react';
import { FaSpinner } from 'react-icons/fa';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (<div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <FaSpinner className="animate-spin" />
    </div>)
  };

  return currentUser ? children : <Navigate to="/login" replace />;
};
