import { FiMessageSquare, FiPlus, FiMoon, FiSun, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { Chat } from '../types';
import clsx from 'clsx';
import { useState } from 'react';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function Sidebar({ chats, activeChatId, onChatSelect, onNewChat }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={clsx(
      'h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            New Chat
          </button>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={clsx(
            'p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
            isCollapsed ? 'ml-2' : 'ml-4'
          )}
        >
          {isCollapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={clsx(
              'w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              activeChatId === chat.id
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <FiMessageSquare className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{chat.title}</span>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors',
            isCollapsed && 'px-2'
          )}
        >
          {theme === 'light' ? (
            <FiMoon className="w-5 h-5" />
          ) : (
            <FiSun className="w-5 h-5" />
          )}
          {!isCollapsed && (theme === 'light' ? 'Dark Mode' : 'Light Mode')}
        </button>
      </div>
    </div>
  );
} 