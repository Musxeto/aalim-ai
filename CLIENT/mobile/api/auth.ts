import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

class AuthApi {
  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
  }

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
  }

  // Logout user
  async logout(): Promise<void> {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  }
}

export const authApi = new AuthApi(); 