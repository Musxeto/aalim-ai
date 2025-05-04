import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Chat } from '../types';
import { ThemeContext } from '../context/ThemeContext';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

interface SidebarState {
  isDarkMode: boolean;
  animation: Animated.Value;
}

export class Sidebar extends Component<SidebarProps, SidebarState> {
  static contextType = ThemeContext;

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      isDarkMode: false,
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.setState({ isDarkMode: this.context.isDarkMode });
  }

  componentDidUpdate(prevProps: SidebarProps, prevState: SidebarState) {
    if (this.context.isDarkMode !== prevState.isDarkMode) {
      this.setState({ isDarkMode: this.context.isDarkMode });
    }
    if (prevProps.isCollapsed !== this.props.isCollapsed) {
      this.animateSidebar();
    }
  }

  animateSidebar = () => {
    Animated.timing(this.state.animation, {
      toValue: this.props.isCollapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { chats, currentChatId, onSelectChat, onNewChat, isCollapsed, onToggleSidebar } = this.props;
    const { isDarkMode, animation } = this.state;

    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-280, 0],
    });

    const overlayOpacity = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });

    return (
      <>
        {!isCollapsed && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              opacity: overlayOpacity,
              zIndex: 1,
            }}
            onTouchEnd={onToggleSidebar}
          />
        )}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 280,
            transform: [{ translateX }],
            zIndex: 2,
            backgroundColor: isDarkMode ? '#202123' : '#FFFFFF',
            marginTop: 30,
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: isDarkMode ? '#202123' : '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#2A2B32' : '#E5E7EB',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <FontAwesome5 name="mosque" size={24} color={isDarkMode ? '#FFFFFF' : '#10B981'} />
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: isDarkMode ? '#FFFFFF' : '#111827',
                marginLeft: 12,
              }}>Aalim AI</Text>
            </View>
            <TouchableOpacity
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: isDarkMode ? '#2A2B32' : '#F3F4F6',
              }}
              onPress={onToggleSidebar}
            >
              <Ionicons
                name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
                size={20}
                color={isDarkMode ? '#FFFFFF' : '#111827'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: 16,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: isDarkMode ? '#2A2B32' : '#F3F4F6',
              borderRadius: 8,
            }}
            onPress={onNewChat}
          >
            <Ionicons name="add" size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
            <Text style={{
              marginLeft: 10,
              fontSize: 14,
              color: isDarkMode ? '#FFFFFF' : '#111827',
              fontWeight: '500',
            }}>New Chat</Text>
          </TouchableOpacity>

          <ScrollView style={{
            flex: 1,
            paddingHorizontal: 8,
          }}>
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 8,
                  marginVertical: 2,
                  backgroundColor: chat.id === currentChatId 
                    ? (isDarkMode ? '#2A2B32' : '#F3F4F6')
                    : 'transparent',
                }}
                onPress={() => onSelectChat(chat.id)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color={isDarkMode ? '#FFFFFF' : '#111827'}
                />
                <Text style={{
                  marginLeft: 10,
                  fontSize: 14,
                  color: isDarkMode ? '#FFFFFF' : '#111827',
                  flex: 1,
                  fontWeight: chat.id === currentChatId ? '500' : 'normal',
                }}
                  numberOfLines={1}
                >
                  {chat.messages[0]?.content.slice(0, 30) || 'New Chat'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{
              padding: 16,
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: isDarkMode ? '#2A2B32' : '#E5E7EB',
            }}
            onPress={this.context.toggleTheme}
          >
            <Ionicons
              name={isDarkMode ? 'sunny' : 'moon'}
              size={20}
              color={isDarkMode ? '#FFFFFF' : '#111827'}
            />
          </TouchableOpacity>
        </Animated.View>
      </>
    );
  }
}
