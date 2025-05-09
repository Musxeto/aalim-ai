import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // use the context hook

export function SignUpForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth(); // get signup from context

  const handleSignUp = async () => {
    try {
      await signup(email, password);
      onClose();
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sign Up</h2>
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
      <button onClick={handleSignUp} className="w-full bg-primary text-white py-2 rounded mb-4">
        Sign Up
      </button>
    </>
  );
}
