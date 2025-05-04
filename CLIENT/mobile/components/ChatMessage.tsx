import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../types';
import { ThemeContext } from '../context/ThemeContext';

interface ChatMessageProps {
  message: Message;
}

export class ChatMessage extends React.Component<ChatMessageProps> {
  static contextType = ThemeContext;
  private fadeAnim = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const { message } = this.props;
    const isDarkMode = (this.context as any).isDarkMode;
    const isUser = message.role === 'user';

    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: this.fadeAnim },
          isUser ?  styles.user: styles.bot,
        ]}
      >
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
          isDarkMode && (isUser ? styles.darkUserBubble : styles.darkBotBubble)
        ]}>
          <Markdown
            style={{
              body: {
                color: isUser ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#111827'),
                fontSize: 16,
                lineHeight: 22,
              },
              code_inline: {
                backgroundColor: isDarkMode ? '#2D3748' : '#F3F4F6',
                color: isDarkMode ? '#10B981' : '#059669',
                padding: 4,
                borderRadius: 4,
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              },
              code_block: {
                backgroundColor: isDarkMode ? '#2D3748' : '#F3F4F6',
                color: isDarkMode ? '#10B981' : '#059669',
                padding: 12,
                borderRadius: 8,
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                marginVertical: 8,
              },
              link: {
                color: isUser ? '#FFFFFF' : '#10B981',
                textDecorationLine: 'underline',
              },
              heading1: {
                fontSize: 20,
                fontWeight: 'bold',
                marginVertical: 8,
                color: isUser ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#111827'),
              },
              heading2: {
                fontSize: 18,
                fontWeight: 'bold',
                marginVertical: 6,
                color: isUser ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#111827'),
              },
              heading3: {
                fontSize: 16,
                fontWeight: 'bold',
                marginVertical: 4,
                color: isUser ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#111827'),
              },
              blockquote: {
                borderLeftWidth: 4,
                borderLeftColor: isUser ? '#FFFFFF' : '#10B981',
                paddingLeft: 12,
                marginVertical: 8,
                fontStyle: 'italic',
                color: isUser ? '#FFFFFF' : (isDarkMode ? '#E2E8F0' : '#4B5563'),
              },
            }}
          >
            {message.content}
          </Markdown>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  darkUserBubble: {
    backgroundColor: '#059669',
  },
  darkBotBubble: {
    backgroundColor: '#1F2937',
  },
  user: {
    justifyContent: 'flex-end',
  },
  bot: {
    justifyContent: 'flex-start',
  },
}); 