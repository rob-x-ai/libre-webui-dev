# Libre WebUI

A minimalist interface for local LLMs via Ollama.

![Rick Rubin Coding Wisdom](./rr.jpg)

*Like Rick Rubin strips music to its essence, Libre WebUI strips away UI complexity. Simple. Minimal. Effective.*

## Free & Open Source

100% free and open source software. No telemetry. No tracking. Your data stays on your hardware.

## Privacy First

Complete offline inference on your own hardware. No data leaves your machine unless you configure it to.

## Setup

```bash
# Option 1: Quick start
./start.sh

# Option 2: Manual
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
npm run dev
```

## Ports
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Ollama: http://localhost:11434

## Configuration

The app automatically generates configuration files on first run:

- `backend/preferences.json` - User preferences (default model, theme, system message)
- `backend/sessions.json` - Chat session data

These files are automatically created with sensible defaults and are excluded from version control to keep your personal settings private.

## Features

### 🚀 Core Features
- **Clean, minimal interface** - Rick Rubin-inspired simplicity
- **Light/Dark mode** - Comfortable viewing in any environment
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time chat** - Streaming responses with WebSocket integration
- **Fully private** - Offline inference on your own hardware
- **Zero telemetry** - No tracking, no data collection

### 🤖 Complete Ollama Integration

All Ollama API endpoints are integrated and ready to use:

#### Chat & Generation
- ✅ **Chat Completion** - Full conversation support with history
- ✅ **Text Generation** - Single-turn completion with advanced options
- ✅ **Streaming Responses** - Real-time response generation
- ✅ **Multimodal Support** - Image input for vision models (llava, etc.)
- ✅ **Structured Outputs** - JSON schema validation and formatting
- ✅ **Tool Calling** - Function calling for enhanced capabilities

#### Model Management
- ✅ **List Models** - Browse all locally installed models
- ✅ **Pull Models** - Download from Ollama library with progress tracking
- ✅ **Delete Models** - Remove unused models to free space
- ✅ **Model Information** - Detailed specs, capabilities, and metadata
- ✅ **Create Models** - Build custom models from existing ones
- ✅ **Copy Models** - Duplicate models with different configurations
- ✅ **Push Models** - Upload custom models to share
- ✅ **Running Models** - View active models and memory usage

#### Advanced Features
- ✅ **Embeddings** - Generate text embeddings for semantic search
- ✅ **Blob Management** - Handle binary data for model creation
- ✅ **Version Detection** - Check Ollama server version
- ✅ **Health Monitoring** - Service status and connectivity checks

### 🎯 UI Components
- **Model Manager** - Comprehensive model management interface
- **Chat Interface** - Intuitive conversation experience
- **Settings Panel** - Customizable preferences and options
- **Theme Toggle** - Seamless light/dark mode switching

### 🔧 Developer Features
- **TypeScript** - Full type safety throughout the stack
- **REST API** - Traditional HTTP endpoints for all features
- **WebSocket** - Real-time bidirectional communication
- **Modular Architecture** - Clean separation of concerns
- **Comprehensive Documentation** - Detailed API and integration guides

## Architecture

```
libre-webui-dev/
├── frontend/           # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── store/      # State management (Zustand)
│   │   ├── utils/      # API clients and utilities
│   │   └── types/      # TypeScript type definitions
├── backend/            # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/     # API route handlers
│   │   ├── services/   # Business logic and Ollama integration
│   │   ├── types/      # Shared type definitions
│   │   └── middleware/ # Express middleware
└── docs/              # Documentation and guides
```

## API Documentation

See [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md) for complete API documentation and usage examples.

Quick API examples:

```typescript
// Chat with streaming
const stream = chatApi.generateChatStreamResponse(sessionId, 'Hello!');
stream.subscribe(
  (chunk) => console.log('Received:', chunk),
  (error) => console.error('Error:', error),
  () => console.log('Complete')
);

// Model management
const models = await ollamaApi.getModels();
await ollamaApi.pullModel('llama3.2');

// Generate embeddings
const embeddings = await ollamaApi.generateEmbeddings({
  model: 'all-minilm',
  input: ['Text to embed']
});
```

## License
MIT
