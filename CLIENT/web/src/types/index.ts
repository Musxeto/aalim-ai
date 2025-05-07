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

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}