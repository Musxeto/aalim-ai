export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
} 