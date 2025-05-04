import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

interface ChatInputProps {
  onSend: (message: string) => void;
}

interface ChatInputState {
  message: string;
  isDarkMode: boolean;
}

export class ChatInput extends Component<ChatInputProps, ChatInputState> {
  static contextType = ThemeContext;

  constructor(props: ChatInputProps) {
    super(props);
    this.state = {
      message: '',
      isDarkMode: false,
    };
  }

  componentDidMount() {
    this.setState({ isDarkMode: this.context.isDarkMode });
  }

  componentDidUpdate(prevProps: ChatInputProps, prevState: ChatInputState) {
    if (this.context.isDarkMode !== prevState.isDarkMode) {
      this.setState({ isDarkMode: this.context.isDarkMode });
    }
  }

  handleSend = () => {
    const { message } = this.state;
    if (message.trim()) {
      this.props.onSend(message);
      this.setState({ message: '' });
    }
  };

  render() {
    const { message, isDarkMode } = this.state;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? '#2D3748' : '#E2E8F0',
      }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? '#2D3748' : '#F9FAFB',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginRight: 12,
            fontSize: 16,
            maxHeight: 120,
            color: isDarkMode ? '#FFFFFF' : '#000000',
            borderWidth: 1,
            borderColor: isDarkMode ? '#4A5568' : '#E2E8F0',
          }}
          value={message}
          onChangeText={(text) => this.setState({ message: text })}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? '#A0AEC0' : '#6B7280'}
          multiline
          maxLength={4000}
          onSubmitEditing={this.handleSend}
        />
        <TouchableOpacity
          style={{
            padding: 12,
            borderRadius: 24,
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            opacity: message.trim() ? 1 : 0.5,
          }}
          onPress={this.handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? '#10B981' : '#A0AEC0'}
          />
        </TouchableOpacity>
      </View>
    );
  }
} 