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
- Clean, minimal interface
- Light/Dark mode
- Responsive design
- Real-time chat with Ollama models
- Fully private, offline inference
- Zero telemetry
- Full Ollama API integration (model management, embeddings, version info)

## License
MIT
