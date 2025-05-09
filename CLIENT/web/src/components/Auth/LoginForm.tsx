import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function LoginForm({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button onClick={handleLogin} className="w-full bg-primary text-white py-2 rounded mb-4">
        Login
      </button>
    </>
  );
}
