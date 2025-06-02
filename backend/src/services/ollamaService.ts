import axios, { AxiosInstance } from 'axios';
import { OllamaModel, OllamaGenerateRequest, OllamaGenerateResponse } from '../types';

class OllamaService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.client.get('/');
      return response.status === 200;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.warn('Ollama service is not running. Please start it with: ollama serve');
      } else {
        console.error('Ollama health check failed:', error.message);
      }
      return false;
    }
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      console.log('Fetching models from Ollama...');
      const response = await this.client.get('/api/tags');
      console.log('Ollama response:', JSON.stringify(response.data, null, 2));
      const models = response.data.models || [];
      console.log(`Found ${models.length} models`);
      return models;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('Cannot connect to Ollama. Please ensure Ollama is running with: ollama serve');
        throw new Error('Ollama service is not running. Please start it with: ollama serve');
      } else {
        console.error('Failed to fetch models:', error.message);
        throw new Error('Failed to fetch available models from Ollama');
      }
    }
  }

  async generateResponse(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    try {
      const response = await this.client.post('/api/generate', {
        ...request,
        stream: false, // For non-streaming responses
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to generate response:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate response');
    }
  }

  async generateStreamResponse(
    request: OllamaGenerateRequest,
    onChunk: (chunk: OllamaGenerateResponse) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      const response = await this.client.post('/api/generate', {
        ...request,
        stream: true,
      }, {
        responseType: 'stream',
      });

      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              onChunk(data);
              if (data.done) {
                onComplete();
                return;
              }
            } catch (parseError) {
              console.error('Failed to parse chunk:', parseError);
            }
          }
        }
      });

      response.data.on('error', (error: Error) => {
        onError(error);
      });

      response.data.on('end', () => {
        onComplete();
      });

    } catch (error: any) {
      console.error('Failed to generate stream response:', error);
      onError(new Error(error.response?.data?.error || 'Failed to generate stream response'));
    }
  }

  async pullModel(modelName: string): Promise<void> {
    try {
      await this.client.post('/api/pull', {
        name: modelName,
      });
    } catch (error: any) {
      console.error('Failed to pull model:', error);
      throw new Error(error.response?.data?.error || 'Failed to pull model');
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    try {
      await this.client.delete('/api/delete', {
        data: { name: modelName },
      });
    } catch (error: any) {
      console.error('Failed to delete model:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete model');
    }
  }
}

export default new OllamaService();
