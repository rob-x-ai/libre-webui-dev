# Quick Start Guide - Ollama Integration

This guide shows you how to use all the new Ollama features in Libre WebUI.

## 🚀 Getting Started

1. **Start Ollama** (if not already running):
   ```bash
   ollama serve
   ```

2. **Start Libre WebUI**:
   ```bash
   ./start.sh
   # or
   npm run dev
   ```

3. **Access the interface**: http://localhost:5173

## 📦 Model Management

### Pull Your First Model
1. Navigate to the Models section in the sidebar
2. Enter a model name like `llama3.2` or `codellama`
3. Click "Pull Model" and wait for download to complete
4. The model will appear in your local models list

### Popular Models to Try
- **llama3.2** - Latest general-purpose model (3B params, ~2GB)
- **codellama** - Specialized for code generation
- **mistral** - Fast and efficient alternative
- **llava** - Multimodal model for image understanding
- **nomic-embed-text** - Text embeddings for semantic search

### Model Operations
- **View Info**: Click "Info" to see detailed model specifications
- **Delete**: Remove models you no longer need to free up space
- **Copy**: Duplicate models for customization

## 💬 Enhanced Chat Features

### Basic Chat
1. Create a new chat session
2. Select your preferred model
3. Start chatting! Responses stream in real-time

### Advanced Features

#### System Prompts
Set custom system messages to change the model's behavior:
```
You are a helpful coding assistant. Always provide working code examples.
```

#### Structured Outputs
Request JSON responses by asking:
```
Return a JSON object with user info: {"name": "...", "age": ..., "skills": [...]}
```

#### Image Analysis (with llava)
1. Pull the `llava` model
2. In chat, paste or upload an image
3. Ask questions about the image content

#### Code Generation
Use `codellama` for programming tasks:
```
Write a Python function that calculates the Fibonacci sequence
```

## 🔍 Embeddings & Search

### Generate Embeddings
```typescript
// Via API
const response = await ollamaApi.generateEmbeddings({
  model: 'nomic-embed-text',
  input: ['Text to embed', 'Another text']
});
```

### Use Cases
- **Semantic search**: Find similar documents
- **Clustering**: Group related content
- **Recommendation systems**: Find similar items

## 🛠️ Advanced Configuration

### Custom Models
Create specialized models for specific tasks:

1. **Create from existing model**:
   ```bash
   # Via API
   await ollamaApi.createModel({
     model: 'my-assistant',
     from: 'llama3.2',
     system: 'You are a specialized customer service assistant.'
   });
   ```

2. **Model templates**: Customize response formatting
3. **Parameter tuning**: Adjust temperature, top-p, etc.

### Streaming Configuration
```typescript
// Configure streaming options
const options = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  num_predict: 100
};

await chatApi.generateChatResponse(sessionId, message, options);
```

## 🔧 Troubleshooting

### Common Issues

1. **Ollama not responding**:
   - Check if Ollama is running: `ollama list`
   - Restart Ollama: `ollama serve`

2. **Model download fails**:
   - Check internet connection
   - Verify model name: `ollama list --all`

3. **Chat not working**:
   - Ensure you have at least one model pulled
   - Check browser console for errors

### Health Checks
Use the built-in health check in the Models section:
- **Check Ollama Version**: Verify connection and version
- **Health Check**: Test service availability
- **Refresh Models**: Reload model list

## 🎯 Best Practices

### Model Selection
- **Small tasks**: Use `llama3.2:1b` for speed
- **General chat**: Use `llama3.2` for balanced performance
- **Code tasks**: Use `codellama` for programming
- **Images**: Use `llava` for vision tasks

### Performance Tips
- **Keep models loaded**: Frequent switching unloads models
- **Monitor memory**: Check running models to manage VRAM usage
- **Batch operations**: Group similar tasks together

### Privacy & Security
- All processing happens locally on your machine
- No data is sent to external servers
- Chat history is stored locally in `backend/sessions.json`
- Models are cached locally in Ollama's directory

## 📚 Next Steps

1. **Explore the API**: Check [OLLAMA_INTEGRATION.md](./OLLAMA_INTEGRATION.md) for complete API documentation
2. **Custom integrations**: Build your own tools using the REST API
3. **Model fine-tuning**: Create specialized models for your use cases
4. **Embeddings projects**: Build semantic search or recommendation systems

## 🤝 Community

- **Issues**: Report bugs on GitHub
- **Contributions**: Submit pull requests for improvements
- **Documentation**: Help improve guides and examples

---

**Happy coding!** 🚀

Remember: Like Rick Rubin strips music to its essence, we've stripped away the complexity while keeping all the power. Enjoy your local AI assistant!
