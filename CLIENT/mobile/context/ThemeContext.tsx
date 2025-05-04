import React, { Component, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType } from '../types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export class ThemeProvider extends Component<ThemeProviderProps, ThemeProviderState> {
  constructor(props: ThemeProviderProps) {
    super(props);
    this.state = {
      isDarkMode: false,
    };
  }

  async componentDidMount() {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        this.setState({ isDarkMode: savedTheme === 'dark' });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  toggleTheme = async () => {
    try {
      const newTheme = !this.state.isDarkMode;
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      this.setState({ isDarkMode: newTheme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          isDarkMode: this.state.isDarkMode,
          toggleTheme: this.toggleTheme,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
} 