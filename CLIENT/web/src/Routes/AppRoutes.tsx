import { Route, Routes, Navigate } from 'react-router-dom';
import { WelcomePage } from '../pages/WelcomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import App from '../App';
import { useAuth } from '../context/AuthContext';
import { RequireAuth } from './RequireAuth';

export function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={currentUser ? <Navigate to="/app" /> : <LoginPage />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/app" /> : <SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route path="/app/*" element={
        <RequireAuth>
          <App />
        </RequireAuth>
      } />

      <Route path="*" element={<Navigate to="/404" replace />} />
      <Route path="/404" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
