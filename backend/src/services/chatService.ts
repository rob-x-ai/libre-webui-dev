import { ChatSession, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

class ChatService {
  private sessions: Map<string, ChatSession> = new Map();
  private dataFile = path.join(process.cwd(), 'sessions.json');

  constructor() {
    this.loadSessions();
  }

  private loadSessions() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        const sessionsArray: ChatSession[] = JSON.parse(data);
        this.sessions = new Map(sessionsArray.map(session => [session.id, session]));
        console.log(`Loaded ${sessionsArray.length} sessions from disk`);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  private saveSessions() {
    try {
      const sessionsArray = Array.from(this.sessions.values());
      fs.writeFileSync(this.dataFile, JSON.stringify(sessionsArray, null, 2));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  createSession(model: string, title?: string): ChatSession {
    const sessionId = uuidv4();
    const now = Date.now();
    
    const session: ChatSession = {
      id: sessionId,
      title: title || 'New Chat',
      messages: [],
      model,
      createdAt: now,
      updatedAt: now,
    };

    this.sessions.set(sessionId, session);
    this.saveSessions();
    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  updateSession(sessionId: string, updates: Partial<ChatSession>): ChatSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: Date.now(),
    };

    this.sessions.set(sessionId, updatedSession);
    this.saveSessions();
    return updatedSession;
  }

  addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }): ChatMessage | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const messageId = message.id || uuidv4();
    
    // Check if message with this ID already exists to prevent duplicates
    const existingMessage = session.messages.find(msg => msg.id === messageId);
    if (existingMessage) {
      console.log('Message with ID already exists, skipping duplicate:', messageId);
      return existingMessage;
    }

    const newMessage: ChatMessage = {
      ...message,
      id: messageId,
      timestamp: Date.now(),
    };

    session.messages.push(newMessage);
    session.updatedAt = Date.now();

    // Auto-generate title from first user message
    if (session.messages.length === 1 && message.role === 'user' && session.title === 'New Chat') {
      session.title = this.generateTitle(message.content);
    }

    this.sessions.set(sessionId, session);
    this.saveSessions();
    return newMessage;
  }

  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      this.saveSessions();
    }
    return deleted;
  }

  clearAllSessions(): void {
    this.sessions.clear();
    this.saveSessions();
  }

  private generateTitle(content: string): string {
    // Generate a concise title from the first message
    const words = content.trim().split(/\s+/).slice(0, 6);
    let title = words.join(' ');
    
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    return title || 'New Chat';
  }

  getMessagesForContext(sessionId: string, maxMessages = 10): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    // Return last N messages for context, but ensure we have user-assistant pairs
    const messages = session.messages.slice(-maxMessages);
    return messages;
  }
}

export default new ChatService();
