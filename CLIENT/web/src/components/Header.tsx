import { FiMenu } from 'react-icons/fi';
import { FaMosque } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  const { currentUser, logout } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors md:hidden"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            )}
            <FaMosque className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Aalim AI
            </h1>
          </div>
          <div>
            {currentUser ? (
              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
                >
                  Login / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isAuthModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}
    </header>
  );
}