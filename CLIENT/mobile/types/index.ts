export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
} 