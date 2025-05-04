import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message, Chat } from '../types';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeState {
  messages: Message[];
  chats: Chat[];
  currentChatId: string | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
}

export default class Home extends Component<{}, HomeState> {
  static contextType = ThemeContext;

  constructor(props: {}) {
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
            role: 'assistant',
            content: 'Assalamu alaikum! I am your Sunnah Bot. How can I help you today?'
          }],
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

  componentDidUpdate(prevProps: {}, prevState: HomeState) {
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

    // Update chats
    const updatedChats = chats.map(chat => 
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, newMessage], updatedAt: new Date() }
        : chat
    );

    this.setState({ chats: updatedChats });
    await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'This is a placeholder response. The actual API integration will be implemented later.',
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
      AsyncStorage.setItem('chats', JSON.stringify(finalChats));
    }, 1000);
  };

  handleNewChat = async () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Assalamu alaikum! I am your Sunnah Bot. How can I help you today?',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
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
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={this.handleSelectChat}
          onNewChat={this.handleNewChat}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={this.toggleSidebar}
        />
        
        <View style={[
          styles.chatContainer,
          isDarkMode && styles.darkChatContainer
        ]}>
          <View style={styles.messagesWrapper}>
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
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </ScrollView>
          </View>
          
          <ChatInput onSend={this.handleSend} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkChatContainer: {
    backgroundColor: '#1A1A1A',
  },
  messagesWrapper: {
    flex: 1,
    marginTop: 80,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  expandButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 999,
  },
  darkExpandButton: {
    backgroundColor: '#2D3748',
    borderColor: '#4A5568',
  },
}); 