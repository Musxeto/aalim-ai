import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { Chat, Message } from './types';

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

function App() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

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

  const handleSendMessage = (content: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setChats(chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: uuidv4(),
        content: "I'm processing your request. This is a placeholder response.",
        sender: 'bot',
        timestamp: new Date()
      };

      setChats(chats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, botResponse]
          };
        }
        return chat;
      }));
    }, 1000);
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onNewChat={handleNewChat}
        />
        <div className="flex-1 flex flex-col">
          <Header />
          {activeChat && (
            <ChatContainer
              messages={activeChat.messages}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;