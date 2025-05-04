import { FiMessageSquare, FiPlus, FiMoon, FiSun, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
}

export function Sidebar({ chats, activeChatId, onChatSelect, onNewChat, isOpen, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={clsx(
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-16'
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