import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { Chat, Message } from './types';
import { askQuestion } from './services/api';

const WELCOME_MESSAGE: Message = {
  id: uuidv4(),
  content: `# Assalamu Alaikum! 👋

Welcome to Sunnah Bot, your AI companion for Islamic knowledge and guidance. I'm here to help you with:

* 📚 Quranic interpretations and tafsir
* 🕌 Islamic history and traditions
* 🤲 Daily prayers and supplications
* 📖 Hadith explanations and authenticity
* 🎓 Islamic jurisprudence (Fiqh)
* 💫 Spiritual guidance and personal development

Feel free to ask any questions about Islam, and I'll do my best to provide accurate and helpful answers based on authentic sources.

*Note: While I aim to provide accurate information, please verify important matters with qualified scholars.*`,
  sender: 'bot',
  timestamp: new Date()
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

function App() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (chats.length === 0) {
      const newChat: Chat = {
        id: uuidv4(),
        title: 'New Chat',
        messages: [WELCOME_MESSAGE]
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
    } else if (!activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, []);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [WELCOME_MESSAGE]
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    setIsLoading(true);
    try {
      const response = await askQuestion(content);
      const botResponse: Message = {
        id: uuidv4(),
        content: response.answer,
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, botResponse]
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, errorMessage]
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            onNewChat={handleNewChat}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="desktop"
          />
        )}
        {/* Mobile Sidebar */}
        {isMobile && (
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            onNewChat={handleNewChat}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(false)}
            variant="mobile"
          />
        )}
        <div className="flex-1 flex flex-col min-h-0">
          <Header onMenuClick={() => setIsSidebarOpen(true)} isMobile={isMobile} />
          <main className="flex-1 relative min-h-0">
            {activeChat && (
              <ChatContainer
                messages={activeChat.messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;