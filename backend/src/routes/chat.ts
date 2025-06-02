import express, { Request, Response } from 'express';
import chatService from '../services/chatService';
import ollamaService from '../services/ollamaService';
import { ApiResponse, ChatSession, ChatMessage, OllamaGenerateRequest } from '../types';

const router = express.Router();

// Get all chat sessions
router.get('/sessions', async (req: Request, res: Response<ApiResponse<ChatSession[]>>): Promise<void> => {
  try {
    const sessions = chatService.getAllSessions();
    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new chat session
router.post('/sessions', async (req: Request, res: Response<ApiResponse<ChatSession>>): Promise<void> => {
  try {
    const { model, title } = req.body;
    
    if (!model) {
      res.status(400).json({
        success: false,
        error: 'Model is required',
      });
      return;
    }

    const session = chatService.createSession(model, title);
    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific chat session
router.get('/sessions/:sessionId', async (req: Request, res: Response<ApiResponse<ChatSession>>): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const session = chatService.getSession(sessionId);
    
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      });
      return;
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a chat session
router.put('/sessions/:sessionId', async (req: Request, res: Response<ApiResponse<ChatSession>>): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    
    const updatedSession = chatService.updateSession(sessionId, updates);
    
    if (!updatedSession) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      });
      return;
    }

    res.json({
      success: true,
      data: updatedSession,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a chat session
router.delete('/sessions/:sessionId', async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const deleted = chatService.deleteSession(sessionId);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Clear all chat sessions
router.delete('/sessions', async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    chatService.clearAllSessions();
    res.json({
      success: true,
      message: 'All chat sessions cleared successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Add a message to a session
router.post('/sessions/:sessionId/messages', async (req: Request, res: Response<ApiResponse<ChatMessage>>): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { role, content, id, model } = req.body;

    if (!role || !content) {
      res.status(400).json({
        success: false,
        error: 'Role and content are required',
      });
      return;
    }

    const session = chatService.getSession(sessionId);
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      });
      return;
    }

    const message = chatService.addMessage(sessionId, {
      role,
      content,
      model,
      id, // Use provided ID if available
    });

    if (!message) {
      res.status(500).json({
        success: false,
        error: 'Failed to add message',
      });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
