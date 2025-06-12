import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ollamaApi } from '@/utils/api';
import toast from 'react-hot-toast';

export const useInitializeApp = () => {
  const { loadSessions, loadModels, loadPreferences, setSelectedModel, models } = useChatStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check Ollama health
        const healthResponse = await ollamaApi.checkHealth();
        if (!healthResponse.success) {
          toast.error('Ollama service is not available. Please make sure it\'s running.');
          return;
        }

        // Load models, sessions, and preferences in parallel
        await Promise.all([
          loadModels(),
          loadSessions(),
          loadPreferences(),
        ]);

      } catch (error) {
        console.error('Failed to initialize app:', error);
        toast.error('Failed to connect to the backend service');
      }
    };

    initialize();
  }, [loadSessions, loadModels]);

  // Set default model when models are loaded
  useEffect(() => {
    if (models.length > 0) {
      // Check if we already have a selected model from backend preferences
      const { selectedModel: currentSelected } = useChatStore.getState();
      
      if (currentSelected) {
        // Verify the selected model from backend is still available
        const availableModelNames = models.map(m => m.name);
        if (!availableModelNames.includes(currentSelected)) {
          // Selected model no longer available, use first available
          setSelectedModel(models[0].name);
        }
      } else {
        // No model selected, use first available
        setSelectedModel(models[0].name);
      }
    }
  }, [models, setSelectedModel]);
};
