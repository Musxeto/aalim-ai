import { useState } from 'react';
import { sendPasswordResetEmail } from '../firebase';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      setMessage('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden">

      {/* Glitter Background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-70 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-4 left-4 z-10 text-gray-800 dark:text-white hover:underline flex items-center gap-1">
        <FaArrowLeft /> Back
      </Link>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-80 p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={handlePasswordReset}
          className="w-80 bg-primary text-white py-2 rounded mb-2 flex items-center justify-center gap-2 hover:bg-primary-dark transition"
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : 'Send Reset Email'}
        </button>
        {message && <p className="text-sm text-center text-gray-700 dark:text-gray-300 mt-2">{message}</p>}
      </div>
    </div>
  );
}
