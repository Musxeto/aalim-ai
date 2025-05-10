import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { Chat, Message } from './types';
import { askQuestion } from './services/api';
import { useAuth } from './context/AuthContext';
import { getUserChats, createChat } from './firebase';

const WELCOME_MESSAGE: Message = {
  id: uuidv4(),
  content: `# Assalamu Alaikum! 👋

Welcome to Aalim AI, your companion for Islamic knowledge and guidance. I'm here to help you with:

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

export default function App() {
  const { currentUser, loading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Auth state updated - currentUser:", currentUser?.uid);
  }, [currentUser]);

  useEffect(() => {
    console.log("Chats state updated:", chats.map(c => ({ id: c.id, title: c.title })));
  }, [chats]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser) return;

      try {
        const userChats = await getUserChats(currentUser.uid);
        if (userChats.length === 0) {
          const newChat = await createChat(currentUser.uid, {
            title: formatChatName(new Date()),
            messages: [WELCOME_MESSAGE],
          });
          console.log('Chat created:', newChat);
          setChats([newChat]);
          setActiveChatId(newChat.id);
        } else {
          setChats(userChats);
          setActiveChatId(userChats[0].id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUser]);

  const handleNewChat = async () => {
    console.log("Current user state:", currentUser);

    try {
      const newChatData = {
        title: formatChatName(new Date()),
        messages: [WELCOME_MESSAGE]
      };

      if (currentUser) {
        console.log("User authenticated, creating Firestore chat");
        const savedChat = await createChat(currentUser.uid, newChatData);
        setChats([savedChat, ...chats]);
        setActiveChatId(savedChat.id);
      } else {
        console.log("No authenticated user, creating local chat");
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [WELCOME_MESSAGE]
        };
        setChats([newChat, ...chats]);
        setActiveChatId(newChat.id);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
      // Fallback to local chat
      const newChat: Chat = {
        id: uuidv4(),
        title: formatChatName(new Date()),
        messages: [WELCOME_MESSAGE]
      };
      setChats([newChat, ...chats]);
      setActiveChatId(newChat.id);
    }
  };


  const formatChatName = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${formattedTime} on ${day} ${month}`;
  };

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
    console.log("activeChatId: ", activeChatId)
  }, [chats, activeChatId]);

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
      const idToken = await currentUser?.getIdToken();
      const response = await askQuestion(content, idToken || '', activeChatId);
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
  );
}
