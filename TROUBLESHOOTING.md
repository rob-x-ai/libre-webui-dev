# 🔧 Troubleshooting: Cannot Create New Chat

If you're unable to create a new chat, here are the most common causes and solutions:

## ✅ Quick Start Solution

The easiest way to get everything running:

```bash
cd /Users/robinkroonen/libre-webui/librewebui
./start.sh
```

## 🚨 Common Issues

### 1. **Ollama Not Running**
**Symptoms:** "Cannot connect to Ollama" error, no models available

**Solution:**
```bash
# Check if Ollama is installed
ollama --version

# If not installed, visit: https://ollama.ai

# Start Ollama
ollama serve

# In another terminal, check if it's working
curl http://localhost:11434/api/tags
```

### 2. **No Models Installed**
**Symptoms:** "No models found" warning, New Chat button disabled

**Solution:**
```bash
# List current models
ollama list

# If empty, install a model (recommended: llama3.2:1b for speed)
ollama pull llama3.2:1b

# Or install a larger model
ollama pull llama3.2:3b
```

### 3. **Backend Server Not Running**
**Symptoms:** API connection errors, cannot load sessions

**Solution:**
```bash
cd /Users/robinkroonen/libre-webui/librewebui/backend

# Install dependencies if needed
npm install

# Start backend
npm run dev
```

### 4. **Frontend Server Not Running**
**Symptoms:** Cannot access http://localhost:5173

**Solution:**
```bash
cd /Users/robinkroonen/libre-webui/librewebui/frontend

# Install dependencies if needed
npm install

# Start frontend
npm run dev
```

### 5. **Port Conflicts**
**Symptoms:** "Port already in use" errors

**Solution:**
```bash
# Check what's using the ports
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :11434 # Ollama

# Kill processes if needed
kill -9 <PID>
```

## 🔍 Manual Verification Steps

1. **Check Ollama Status:**
   ```bash
   curl http://localhost:11434/api/tags
   # Should return JSON with available models
   ```

2. **Check Backend Status:**
   ```bash
   curl http://localhost:3001/api/ollama/health
   # Should return: {"success":true,"data":{"status":"ok"}}
   ```

3. **Check Models API:**
   ```bash
   curl http://localhost:3001/api/ollama/models
   # Should return list of available models
   ```

## 🎯 Step-by-Step Debugging

1. **Start services in order:**
   ```bash
   # Terminal 1: Start Ollama
   ollama serve
   
   # Terminal 2: Start Backend
   cd backend && npm run dev
   
   # Terminal 3: Start Frontend
   cd frontend && npm run dev
   ```

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed API calls

3. **Check UI indicators:**
   - Yellow warning: No models available
   - Blue info: Shows current selected model
   - Red error toasts: Connection issues

## 💡 Tips

- **New Chat button disabled?** Check if a model is selected in Settings
- **Settings button:** Click gear icon in top-right to change models
- **Model indicator:** Current model shown in header and sidebar
- **Reload page:** After starting services, refresh the browser

## 🆘 Still Having Issues?

If none of the above solutions work:

1. **Check the browser console for specific error messages**
2. **Check terminal output for backend/frontend errors**
3. **Verify all services are running:**
   - Ollama: http://localhost:11434
   - Backend: http://localhost:3001
   - Frontend: http://localhost:5173

The application requires all three services to be running for full functionality.
