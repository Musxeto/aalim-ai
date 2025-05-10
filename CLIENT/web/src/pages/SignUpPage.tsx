import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function SignUpPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      console.error('Sign up failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-80 p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-80 p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleSignUp}
        className="w-80 bg-primary text-white py-2 rounded mb-4 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign Up'}
      </button>
      
    </div>
  );
}