import axios from 'axios';
import { ApiResponse, ChatSession, ChatMessage, OllamaModel } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

console.log('API_BASE_URL configured as:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const chatApi = {
  // Sessions
  getSessions: (): Promise<ApiResponse<ChatSession[]>> =>
    api.get('/chat/sessions').then(res => res.data),

  createSession: (model: string, title?: string): Promise<ApiResponse<ChatSession>> =>
    api.post('/chat/sessions', { model, title }).then(res => res.data),

  getSession: (sessionId: string): Promise<ApiResponse<ChatSession>> =>
    api.get(`/chat/sessions/${sessionId}`).then(res => res.data),

  updateSession: (sessionId: string, updates: Partial<ChatSession>): Promise<ApiResponse<ChatSession>> =>
    api.put(`/chat/sessions/${sessionId}`, updates).then(res => res.data),

  deleteSession: (sessionId: string): Promise<ApiResponse> =>
    api.delete(`/chat/sessions/${sessionId}`).then(res => res.data),

  clearAllSessions: (): Promise<ApiResponse> =>
    api.delete('/chat/sessions').then(res => res.data),

  // Messages
  sendMessage: (sessionId: string, content: string, options?: any): Promise<ApiResponse<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>> =>
    api.post(`/chat/sessions/${sessionId}/messages`, { content, options }).then(res => res.data),

  saveMessage: (sessionId: string, message: Omit<ChatMessage, 'timestamp'> & { timestamp?: number }): Promise<ApiResponse<ChatMessage>> =>
    api.post(`/chat/sessions/${sessionId}/messages`, message).then(res => res.data),
};

export const ollamaApi = {
  // Health check
  checkHealth: (): Promise<ApiResponse<{ status: string }>> =>
    api.get('/ollama/health').then(res => res.data),

  // Models
  getModels: (): Promise<ApiResponse<OllamaModel[]>> =>
    api.get('/ollama/models').then(res => res.data),

  pullModel: (modelName: string): Promise<ApiResponse> =>
    api.post(`/ollama/models/${modelName}/pull`).then(res => res.data),

  deleteModel: (modelName: string): Promise<ApiResponse> =>
    api.delete(`/ollama/models/${modelName}`).then(res => res.data),
};

export default api;
