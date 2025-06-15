import axios from 'axios';
import { ApiResponse, ChatSession, ChatMessage, OllamaModel, UserPreferences } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

  // Chat generation using new Ollama chat API
  generateChatResponse: (sessionId: string, message: string, options?: any): Promise<ApiResponse<ChatMessage>> =>
    api.post(`/chat/sessions/${sessionId}/generate`, { message, options }).then(res => res.data),

  // Streaming chat generation
  generateChatStreamResponse: (sessionId: string, message: string, options?: any) => {
    return {
      subscribe: async (onMessage: (data: any) => void, onError?: (error: any) => void, onComplete?: () => void) => {
        try {
          const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/generate/stream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, options }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body reader available');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          const processChunk = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                onComplete?.();
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data: ')) {
                  const data = trimmedLine.slice(6);
                  
                  if (data === '[DONE]') {
                    onComplete?.();
                    return;
                  }

                  try {
                    const parsedData = JSON.parse(data);
                    onMessage(parsedData);
                    
                    if (parsedData.type === 'done' || parsedData.type === 'error') {
                      if (parsedData.type === 'error') {
                        onError?.(parsedData.error);
                      } else {
                        onComplete?.();
                      }
                      return;
                    }
                  } catch (parseError) {
                    console.error('Failed to parse SSE data:', parseError);
                  }
                }
              }

              processChunk();
            }).catch((error) => {
              onError?.(error);
            });
          };

          processChunk();
          
          return () => reader.cancel();
        } catch (error) {
          onError?.(error);
          return () => {};
        }
      }
    };
  },
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

  showModel: (modelName: string, verbose = false): Promise<ApiResponse<any>> =>
    api.get(`/ollama/models/${modelName}`, { params: { verbose } }).then(res => res.data),

  createModel: (payload: any): Promise<ApiResponse> =>
    api.post('/ollama/models', payload).then(res => res.data),

  copyModel: (source: string, destination: string): Promise<ApiResponse> =>
    api.post('/ollama/models/copy', { source, destination }).then(res => res.data),

  pushModel: (modelName: string): Promise<ApiResponse> =>
    api.post(`/ollama/models/${modelName}/push`).then(res => res.data),

  generateEmbeddings: (payload: any): Promise<ApiResponse<any>> =>
    api.post('/ollama/embed', payload).then(res => res.data),

  listRunningModels: (): Promise<ApiResponse<any>> =>
    api.get('/ollama/running').then(res => res.data),

  getVersion: (): Promise<ApiResponse<{ version: string }>> =>
    api.get('/ollama/version').then(res => res.data),

  // Chat completion
  chatCompletion: (payload: any): Promise<ApiResponse<any>> =>
    api.post('/ollama/chat', payload).then(res => res.data),

  // Blob management
  checkBlobExists: (digest: string): Promise<boolean> =>
    api.head(`/ollama/blobs/${digest}`).then(() => true).catch(() => false),

  pushBlob: (digest: string, data: Blob | Buffer): Promise<ApiResponse> =>
    api.post(`/ollama/blobs/${digest}`, data, {
      headers: { 'Content-Type': 'application/octet-stream' }
    }).then(res => res.data),

  // Legacy embeddings (deprecated)
  generateLegacyEmbeddings: (payload: any): Promise<ApiResponse<any>> =>
    api.post('/ollama/embeddings', payload).then(res => res.data),
};

export const preferencesApi = {
  getPreferences: (): Promise<ApiResponse<UserPreferences>> =>
    api.get('/preferences').then(res => res.data),

  updatePreferences: (updates: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> =>
    api.put('/preferences', updates).then(res => res.data),

  setDefaultModel: (model: string): Promise<ApiResponse<UserPreferences>> =>
    api.put('/preferences/default-model', { model }).then(res => res.data),

  setSystemMessage: (message: string): Promise<ApiResponse<UserPreferences>> =>
    api.put('/preferences/system-message', { message }).then(res => res.data),
};

export default api;
