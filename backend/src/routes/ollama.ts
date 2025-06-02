import express, { Request, Response } from 'express';
import ollamaService from '../services/ollamaService';
import { ApiResponse, OllamaModel } from '../types';

const router = express.Router();

// Health check
router.get('/health', async (req: Request, res: Response<ApiResponse<{ status: string }>>): Promise<void> => {
  try {
    const isHealthy = await ollamaService.isHealthy();
    
    if (isHealthy) {
      res.json({
        success: true,
        data: { status: 'healthy' },
        message: 'Ollama service is running',
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Ollama service is not available',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get available models
router.get('/models', async (req: Request, res: Response<ApiResponse<OllamaModel[]>>): Promise<void> => {
  try {
    const models = await ollamaService.getModels();
    res.json({
      success: true,
      data: models,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Pull a new model
router.post('/models/:modelName/pull', async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { modelName } = req.params;
    await ollamaService.pullModel(modelName);
    
    res.json({
      success: true,
      message: `Model ${modelName} pulled successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a model
router.delete('/models/:modelName', async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { modelName } = req.params;
    await ollamaService.deleteModel(modelName);
    
    res.json({
      success: true,
      message: `Model ${modelName} deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
