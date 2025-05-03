import { FaMosque } from 'react-icons/fa';

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center px-6">
      <div className="flex items-center gap-3">
        <FaMosque className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sunnah Bot</h1>
      </div>
    </header>
  );
} 