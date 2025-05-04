import { FiSend } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
  };

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex gap-2 relative group">
        <div className={clsx(
          'absolute inset-0 rounded-lg transition-all duration-300',
          isFocused 
            ? 'bg-primary/10 dark:bg-primary/20' 
            : 'bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
        )} />
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          disabled={disabled}
          className="relative flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-300"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={clsx(
            'relative px-4 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2',
            !message.trim() && 'animate-pulse-slow'
          )}
        >
          <FiSend className="w-5 h-5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </form>
  );
} 