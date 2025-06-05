export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    stop?: string[];
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaShowRequest {
  model: string;
  verbose?: boolean;
}

export interface OllamaCreateRequest {
  model: string;
  from?: string;
  files?: Record<string, string>;
  adapters?: Record<string, string>;
  template?: string;
  license?: string | string[];
  system?: string;
  parameters?: Record<string, any>;
  messages?: any[];
  stream?: boolean;
  quantize?: string;
}

export interface OllamaCopyRequest {
  source: string;
  destination: string;
}

export interface OllamaPushRequest {
  model: string;
  insecure?: boolean;
  stream?: boolean;
}

export interface OllamaEmbeddingsRequest {
  model: string;
  input: string | string[];
  truncate?: boolean;
  options?: Record<string, any>;
  keep_alive?: string;
}

export interface OllamaEmbeddingsResponse {
  embeddings: number[][];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
