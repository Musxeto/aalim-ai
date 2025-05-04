import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../types';
import { ThemeContext } from '../context/ThemeContext';

interface ChatMessageProps {
  message: Message;
}

interface ChatMessageState {
  isDarkMode: boolean;
}

export class ChatMessage extends Component<ChatMessageProps, ChatMessageState> {
  static contextType = ThemeContext;

  constructor(props: ChatMessageProps) {
    super(props);
    this.state = {
      isDarkMode: false,
    };
  }

  componentDidMount() {
    this.setState({ isDarkMode: this.context.isDarkMode });
  }

  componentDidUpdate(prevProps: ChatMessageProps, prevState: ChatMessageState) {
    if (this.context.isDarkMode !== prevState.isDarkMode) {
      this.setState({ isDarkMode: this.context.isDarkMode });
    }
  }

  render() {
    const { message } = this.props;
    const { isDarkMode } = this.state;
    const isUser = message.role === 'user';

    return (
      <View style={{
        padding: 16,
        maxWidth: '85%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        ...(isDarkMode && { backgroundColor: '#1A1A1A' })
      }}>
        <View style={{
          padding: 16,
          borderRadius: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          backgroundColor: isUser 
            ? (isDarkMode ? '#059669' : '#10B981')
            : (isDarkMode ? '#2D3748' : '#F9FAFB')
        }}>
          <Markdown style={{
            body: {
              color: isDarkMode ? '#FFFFFF' : '#000000',
              fontSize: 16,
              lineHeight: 24,
            },
            code_inline: {
              backgroundColor: isDarkMode ? '#2D3748' : '#F3F4F6',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              padding: 4,
              borderRadius: 4,
              fontFamily: 'monospace',
            },
            code_block: {
              backgroundColor: isDarkMode ? '#2D3748' : '#F3F4F6',
              color: isDarkMode ? '#FFFFFF' : '#000000',
              padding: 12,
              borderRadius: 8,
              fontFamily: 'monospace',
              marginVertical: 8,
            },
            p: {
              marginVertical: 8,
            },
            ul: {
              marginVertical: 8,
            },
            ol: {
              marginVertical: 8,
            },
            li: {
              marginVertical: 4,
            }
          }}>
            {message.content}
          </Markdown>
        </View>
      </View>
    );
  }
} 