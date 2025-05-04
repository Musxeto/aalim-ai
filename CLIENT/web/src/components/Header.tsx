import { FiMenu } from 'react-icons/fi';
import { FaMosque } from 'react-icons/fa';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
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
        </div>
      </div>
    </header>
  );
} 