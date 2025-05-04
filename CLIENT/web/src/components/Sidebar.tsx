import { FiMessageSquare, FiPlus, FiMoon, FiSun, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { Chat } from '../types';
import { clsx } from 'clsx';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'desktop' | 'mobile';
}

export function Sidebar({ chats, activeChatId, onChatSelect, onNewChat, isOpen, onToggle, variant = 'desktop' }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  // For mobile, show overlay and close button
  if (variant === 'mobile') {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
            onClick={onToggle}
            aria-label="Close sidebar"
          />
        )}
        {/* Sidebar Drawer */}
        <aside
          className={clsx(
            'fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 md:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
            <button
              onClick={onToggle}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg transition-colors',
                    activeChatId === chat.id
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors w-full"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar (collapsible)
  return (
    <div
      className={clsx(
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-16',
        'hidden md:flex'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewChat}
          className={clsx(
            'flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors',
            !isOpen && 'justify-center'
          )}
        >
          <FiPlus className="w-5 h-5" />
          {isOpen && <span>New Chat</span>}
        </button>
        <button
          onClick={onToggle}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
        >
          {isOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isOpen && (
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-lg transition-colors',
                  activeChatId === chat.id
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {chat.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={clsx(
            'flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors w-full',
            !isOpen && 'justify-center'
          )}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
          {isOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </div>
  );
} 