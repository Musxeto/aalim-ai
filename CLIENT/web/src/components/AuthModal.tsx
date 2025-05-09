import { LoginForm } from "./Auth/LoginForm";
import { SignUpForm } from "./Auth/SignUpForm";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
        {authType === 'login' ? (
          <LoginForm onClose={onClose} />
        ) : (
          <SignUpForm onClose={onClose} />
        )}
        <div className="text-center mt-2">
          {authType === 'login' ? (
            <button
              onClick={() => setAuthType('signup')}
              className="text-sm text-primary hover:underline"
            >
              Don't have an account? Sign Up
            </button>
          ) : (
            <button
              onClick={() => setAuthType('login')}
              className="text-sm text-primary hover:underline"
            >
              Already have an account? Login
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}