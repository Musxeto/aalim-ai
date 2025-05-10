import { FiMenu } from 'react-icons/fi';
import { FaMosque, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to the welcome page after logout
  };

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
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
                >
                  <FaUserCircle className="w-6 h-6" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}