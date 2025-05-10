import { FiUser, FiMessageSquare } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={clsx(
        'flex items-start gap-3 my-2 animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
          <FiMessageSquare className="w-5 h-5" />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[80%] rounded-lg p-4 animate-slide-in',
          isUser
            ? 'bg-primary text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
        )}
      >
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 last:mb-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mb-3 last:mb-0">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mb-2 last:mb-0">{children}</h3>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-2 last:mb-0 overflow-x-auto">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic mb-2 last:mb-0">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {/* <div
          className={clsx(
            'text-xs mt-2',
            isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {message.timestamp.toLocaleDateString()}
        </div> */}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
          <FiUser className="w-5 h-5" />
        </div>
      )}
    </div>
  );
} 