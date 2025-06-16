# Demo Mode

Libre WebUI includes a built-in demo mode that automatically detects when the application is running without a backend connection (such as when deployed to Vercel for presentation purposes).

## How Demo Mode Works

Demo mode is automatically detected when:

1. **Environment Variable**: `VITE_DEMO_MODE=true` is set
2. **Vercel Deployment**: Hostname contains `vercel.app` or `vercel.dev`
3. **Other Demo Platforms**: Hostname contains `netlify.app`, `github.io`, or starts with `demo.` or `preview.`

## Features in Demo Mode

When demo mode is active:

- **Demo Banner**: A prominent banner appears below the header indicating this is a demo version
- **Mock Data**: The UI displays sample models and chat sessions to showcase functionality
- **Backend Simulation**: API calls return mock responses instead of attempting to connect to Ollama
- **Visual Indicators**: Clear messaging that the Ollama backend is not connected

## Deploying to Vercel for Demo

1. **Fork the Repository**: Fork the Libre WebUI repository to your GitHub account

2. **Deploy to Vercel**: 
   - Connect your GitHub account to Vercel
   - Import the `frontend` directory as a new project
   - Vercel will automatically detect demo mode

3. **Manual Environment Setup** (if needed):
   ```bash
   # In your Vercel project settings, add:
   VITE_DEMO_MODE=true
   ```

## Local Demo Mode Testing

To test demo mode locally:

1. Create a `.env.local` file in the `frontend` directory:
   ```env
   VITE_DEMO_MODE=true
   ```

2. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. The demo banner should appear and mock data will be displayed

## Demo Mode Components

- **DemoModeBanner**: Displays the demo notification with GitHub link
- **Mock API Responses**: Returns sample data for all Ollama API calls
- **Demo Data**: Includes sample models (llama3.2:3b, qwen2.5:7b) and chat sessions

## Customization

You can customize the demo mode behavior by modifying:

- `src/utils/demoMode.ts`: Detection logic and configuration
- `src/components/DemoModeBanner.tsx`: Banner appearance and messaging
- `src/utils/api.ts`: Mock data and responses
