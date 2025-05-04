export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AskQuestionRequest {
  question: string;
  k?: number;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
}

export interface GetHistoryResponse {
  chats: Chat[];
}

export interface NewChatResponse {
  chat: Chat;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
} 