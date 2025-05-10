import { useState } from 'react';
import { sendPasswordResetEmail } from '../firebase';

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-80 p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handlePasswordReset}
        className="w-80 bg-primary text-white py-2 rounded mb-4 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Email'}
      </button>
      {message && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{message}</p>}
    </div>
  );
}