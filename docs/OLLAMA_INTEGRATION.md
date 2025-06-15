# Libre WebUI - Ollama API Integration

This document outlines the complete integration of Ollama API endpoints in the Libre WebUI project.

## ✅ Implemented Endpoints

### Core Chat & Generation
- **✅ Generate a completion** (`POST /api/generate`)
  - Non-streaming and streaming responses
  - Support for advanced parameters (temperature, top_p, etc.)
  - Raw mode, JSON mode, and structured outputs
  - Image support for multimodal models
  - Custom system prompts and templates

- **✅ Generate a chat completion** (`POST /api/chat`) 
  - Chat conversation history support
  - Tool calling support
  - Image support for multimodal models
  - Structured outputs and JSON mode
  - Thinking models support

### Model Management
- **✅ List Local Models** (`GET /api/tags`)
  - Complete model metadata including size, format, family
  - Quantization level information

- **✅ Show Model Information** (`POST /api/show`)
  - Detailed model information including parameters
  - Verbose mode support for extended information
  - Capabilities detection (completion, vision, etc.)

- **✅ Pull a Model** (`POST /api/pull`)
  - Download models from Ollama library
  - Progress tracking for downloads
  - Resume interrupted downloads

- **✅ Delete a Model** (`DELETE /api/delete`)
  - Remove models and free up disk space

- **✅ Create a Model** (`POST /api/create`)
  - Create from existing models
  - Create from GGUF files
  - Create from Safetensors directories
  - Model quantization support
  - Custom templates and system prompts

- **✅ Copy a Model** (`POST /api/copy`)
  - Duplicate models with different names

- **✅ Push a Model** (`POST /api/push`)
  - Upload models to Ollama library
  - Progress tracking for uploads

### Advanced Features
- **✅ Generate Embeddings** (`POST /api/embed`)
  - Single and batch text embedding generation
  - Configurable truncation behavior
  - Support for embedding models

- **✅ List Running Models** (`GET /api/ps`)
  - View currently loaded models
  - Memory usage information
  - Model expiration times

- **✅ Blob Management** (`HEAD|POST /api/blobs/:digest`)
  - Check blob existence
  - Upload binary blobs for model creation
  - SHA256 digest verification

- **✅ Version Information** (`GET /api/version`)
  - Ollama server version detection

- **✅ Legacy Embeddings** (`POST /api/embeddings`) *(Deprecated)*
  - Backward compatibility support

## 🔧 Implementation Details

### Backend Structure

```
backend/src/
├── routes/
│   ├── ollama.ts      # Complete Ollama API proxy
│   └── chat.ts        # Enhanced chat management with Ollama integration
├── services/
│   └── ollamaService.ts # Comprehensive Ollama client
└── types/
    └── index.ts       # TypeScript interfaces for all Ollama types
```

### Key Features

#### 1. Streaming Support
- **WebSocket Integration**: Real-time streaming for chat responses
- **HTTP Streaming**: Server-Sent Events for HTTP-based streaming
- **Progress Tracking**: Real-time progress for model downloads/uploads

#### 2. Model Management UI
- Browse and manage local models
- Download models from Ollama library
- Model information and capabilities display
- Model creation and customization tools

#### 3. Advanced Chat Features
- **Conversation History**: Proper chat context management
- **System Prompts**: Customizable system messages
- **Tools Integration**: Support for function calling
- **Multimodal Support**: Image input for vision models
- **Structured Outputs**: JSON schema validation

#### 4. Embeddings & Search
- Text embedding generation
- Batch processing support
- Integration ready for semantic search features

### Configuration

The service connects to Ollama via:
```env
OLLAMA_BASE_URL=http://localhost:11434  # Default Ollama server
```

### API Examples

#### Chat Completion
```typescript
// Non-streaming chat
const response = await ollamaApi.chatCompletion({
  model: 'llama3.2',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  stream: false
});

// Streaming chat via WebSocket
websocketService.send({
  type: 'chat_stream',
  data: {
    sessionId: 'session-id',
    content: 'Hello!',
    options: { temperature: 0.7 }
  }
});
```

#### Model Management
```typescript
// List models
const models = await ollamaApi.getModels();

// Pull a model
await ollamaApi.pullModel('llama3.2');

// Create custom model
await ollamaApi.createModel({
  model: 'my-custom-model',
  from: 'llama3.2',
  system: 'You are a helpful assistant.'
});
```

#### Embeddings
```typescript
// Generate embeddings
const embeddings = await ollamaApi.generateEmbeddings({
  model: 'all-minilm',
  input: ['Text to embed', 'Another text']
});
```

## 🚀 Usage in Frontend

### Chat Interface
```typescript
// Using the enhanced chat hook
const { sendMessage, isStreaming } = useChat(sessionId);

// Send message with streaming response
await sendMessage('What is machine learning?');
```

### Model Selection
```typescript
// Get available models
const { data: models } = await ollamaApi.getModels();

// Display model capabilities
models.forEach(model => {
  console.log(`${model.name}: ${model.details?.parameter_size}`);
});
```

## 🔮 Future Enhancements

While all Ollama API endpoints are now integrated, potential improvements include:

1. **Enhanced UI Components**
   - Model comparison interface
   - Embedding visualization tools
   - Advanced model creation wizard

2. **Performance Optimizations**
   - Model caching strategies
   - Connection pooling
   - Request batching

3. **Extended Features**
   - Custom model fine-tuning UI
   - Model performance analytics
   - Advanced prompt engineering tools

## 📚 Documentation Links

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Model Library](https://ollama.ai/library)
- [Modelfile Documentation](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

---

**Status**: ✅ Complete - All Ollama API endpoints are integrated and functional.
