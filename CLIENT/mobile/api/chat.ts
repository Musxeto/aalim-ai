import { apiClient } from './client';
import { ENDPOINTS } from './config';
import { Message, Chat } from '../types';

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

class ChatApi {
  // Ask a question to the Islamic QA system
  async askQuestion(data: AskQuestionRequest): Promise<AskQuestionResponse> {
    return apiClient.post<AskQuestionResponse>(ENDPOINTS.CHAT.SEND_MESSAGE, data);
  }

  // Get chat history
  async getHistory(): Promise<GetHistoryResponse> {
    return apiClient.get<GetHistoryResponse>(ENDPOINTS.CHAT.GET_HISTORY);
  }

  // Create a new chat
  async newChat(): Promise<NewChatResponse> {
    return apiClient.post<NewChatResponse>(ENDPOINTS.CHAT.NEW_CHAT);
  }
}

export const chatApi = new ChatApi(); 