import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message, Chat } from '../types';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatApi } from '../api/chat';

interface HomeState {
  messages: Message[];
  chats: Chat[];
  currentChatId: string | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
}

export default class Home extends Component<object, HomeState> {
  static contextType = ThemeContext;
  private scrollViewRef = React.createRef<ScrollView>();
  constructor(props: object) {
    super(props);
    this.state = {
      messages: [],
      chats: [],
      currentChatId: null,
      isDarkMode: false,
      isSidebarCollapsed: false,
    };
  }

  async componentDidMount() {
    try {
      const savedChats = await AsyncStorage.getItem('chats');
      const savedCurrentChatId = await AsyncStorage.getItem('currentChatId');
      
      if (savedChats) {
        const chats = JSON.parse(savedChats);
        this.setState({ 
          chats,
          currentChatId: savedCurrentChatId || chats[0]?.id || null,
          messages: chats.find((chat: Chat) => chat.id === savedCurrentChatId)?.messages || []
        });
      } else {
        const newChat: Chat = {
          id: Date.now().toString(),
          messages: [{
            id: Date.now().toString(),
            timestamp: new Date(),
            role: 'assistant',
            content: 'Assalamu alaikum! I am your Aalim AI. How can I help you today?'
          }],
          title: 'Chat',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.setState({
          chats: [newChat],
          currentChatId: newChat.id,
          messages: newChat.messages
        });
        await AsyncStorage.setItem('chats', JSON.stringify([newChat]));
        await AsyncStorage.setItem('currentChatId', newChat.id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }

  componentDidUpdate(prevProps: object, prevState: HomeState) {
    if (this.context.isDarkMode !== prevState.isDarkMode) {
      this.setState({ isDarkMode: this.context.isDarkMode });
    }
  }

  handleSend = async (content: string) => {
    const { currentChatId, chats } = this.state;
    if (!currentChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    const updatedMessages = [...this.state.messages, newMessage];
    this.setState({ messages: updatedMessages });

    const updatedChats = chats.map(chat => 
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, newMessage], updatedAt: new Date() }
        : chat
    );

    this.setState({ chats: updatedChats });
    await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));

    try {
      const response = await chatApi.askQuestion({
        question: content,
        k: 5
      });

      const botResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botResponse];
      this.setState({ messages: finalMessages });

      const finalChats = updatedChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, botResponse], updatedAt: new Date() }
          : chat
      );

      this.setState({ chats: finalChats });
      await AsyncStorage.setItem('chats', JSON.stringify(finalChats));
    } catch (error: unknown) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      this.setState({ messages: finalMessages });

      const finalChats = updatedChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, errorMessage], updatedAt: new Date() }
          : chat
      );

      this.setState({ chats: finalChats });
      await AsyncStorage.setItem('chats', JSON.stringify(finalChats));
    }
  };

  handleNewChat = async () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content:`# Assalamu Alaikum! 👋

Welcome to Aalim AI, your AI companion for Islamic knowledge and guidance. I'm here to help you with:

* 📚 Quranic interpretations and tafsir
* 🕌 Islamic history and traditions
* 🤲 Daily prayers and supplications
* 📖 Hadith explanations and authenticity
* 🎓 Islamic jurisprudence (Fiqh)
* 💫 Spiritual guidance and personal development

Feel free to ask any questions about Islam, and I'll do my best to provide accurate and helpful answers based on authentic sources.

*Note: While I aim to provide accurate information, please verify important matters with qualified scholars.*`,
      timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      title: Date.now().toString(),
    };

    const updatedChats = [...this.state.chats, newChat];
    this.setState({
      chats: updatedChats,
      currentChatId: newChat.id,
      messages: newChat.messages
    });

    await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    await AsyncStorage.setItem('currentChatId', newChat.id);
  };

  handleSelectChat = (chatId: string) => {
    const selectedChat = this.state.chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      this.setState({
        currentChatId: chatId,
        messages: selectedChat.messages
      });
      AsyncStorage.setItem('currentChatId', chatId);
    }
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      isSidebarCollapsed: !prevState.isSidebarCollapsed
    }));
  };

  render() {
    const { messages, chats, currentChatId, isSidebarCollapsed, isDarkMode } = this.state;

    return (
      <View style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "#1A1A1A" : "#FFFFFF"}
        />
        
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={this.handleSelectChat}
          onNewChat={this.handleNewChat}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={this.toggleSidebar}
        />

        {isSidebarCollapsed && (
          <TouchableOpacity
            style={[
              styles.expandButton,
              isDarkMode && styles.darkExpandButton
            ]}
            onPress={this.toggleSidebar}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color="#10B981" />
          </TouchableOpacity>
        )}

        <View style={styles.mainContainer}>
          <View style={[
            styles.chatContainer,
            isDarkMode && styles.darkChatContainer
          ]}>
            <View style={styles.messagesWrapper}>
              <ScrollView
                ref={this.scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => this.scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </ScrollView>
            </View>
            
            <ChatInput onSend={this.handleSend} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    width: '100%',
  },
  darkChatContainer: {
    backgroundColor: '#202123',
  },
  messagesWrapper: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 90 : 80,
    width: '100%',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesContent: {
    paddingBottom: 24,
    width: '100%',
  },
  expandButton: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'ios' ? 55 : 35,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 9999,
  },
  darkExpandButton: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
}); 