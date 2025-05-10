import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { WelcomePage } from '../pages/WelcomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import App from '../App';
import { useAuth } from '../context/AuthContext';

export function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {currentUser ? (
        <>
          <Route path="/app/*" element={<App />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}