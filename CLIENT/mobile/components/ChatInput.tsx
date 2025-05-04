import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

interface ChatInputProps {
  onSend: (message: string) => void;
}

interface ChatInputState {
  message: string;
}

export class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
  static contextType = ThemeContext;
  private inputRef = React.createRef<TextInput>();

  constructor(props: ChatInputProps) {
    super(props);
    this.state = {
      message: '',
    };
  }

  handleSend = () => {
    if (this.state.message.trim()) {
      this.props.onSend(this.state.message);
      this.setState({ message: '' });
      this.inputRef.current?.focus();
    }
  };

  handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      this.handleSend();
    }
  };

  render() {
    const isDarkMode = (this.context as any).isDarkMode;

    return (
      <View style={[
        styles.container,
        isDarkMode && styles.darkContainer
      ]}>
        <TextInput
          ref={this.inputRef}
          style={[
            styles.input,
            isDarkMode && styles.darkInput
          ]}
          value={this.state.message}
          onChangeText={(text) => this.setState({ message: text })}
          placeholder="Type your message..."
          placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
          multiline
          maxLength={1000}
          onKeyPress={this.handleKeyPress}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            isDarkMode && styles.darkSendButton,
            !this.state.message.trim() && styles.disabledButton
          ]}
          onPress={this.handleSend}
          disabled={!this.state.message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F7F7F8', 
    borderTopWidth: 1,
    borderTopColor: '#D9D9E3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  darkContainer: {
    backgroundColor: '#202123', 
    borderTopColor: '#4E4F60',
  },
  input: {
    flex: 1,
    backgroundColor: '#E4E4E7', 
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 120,
    color: '#0F0F0F',
    fontSize: 16,
    lineHeight: 20,
  },
  darkInput: {
    backgroundColor: '#40414F', 
    color: '#F5F5F5',
  },
  sendButton: {
    backgroundColor: '#10B981', 
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkSendButton: {
    backgroundColor: '#10B981', 
  },
  disabledButton: {
    opacity: 0.5,
  },
});
