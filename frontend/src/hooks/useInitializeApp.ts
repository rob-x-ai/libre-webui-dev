import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';
import { ollamaApi } from '@/utils/api';
import toast from 'react-hot-toast';

export const useInitializeApp = () => {
  const { loadSessions, loadModels, setSelectedModel, models } = useChatStore();
  const { preferences, setPreferences } = useAppStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check Ollama health
        const healthResponse = await ollamaApi.checkHealth();
        if (!healthResponse.success) {
          toast.error('Ollama service is not available. Please make sure it\'s running.');
          return;
        }

        // Load models and sessions in parallel
        await Promise.all([
          loadModels(),
          loadSessions(),
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
      // Use saved default model if it exists in available models, otherwise use first model
      const availableModelNames = models.map(m => m.name);
      const modelToSelect = preferences.defaultModel && availableModelNames.includes(preferences.defaultModel)
        ? preferences.defaultModel
        : models[0].name;
      
      setSelectedModel(modelToSelect);
      
      // Update preferences if we're using a different model
      if (modelToSelect !== preferences.defaultModel) {
        setPreferences({ defaultModel: modelToSelect });
      }
    }
  }, [models, preferences.defaultModel, setSelectedModel, setPreferences]);
};
