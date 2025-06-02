import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useChatStore } from '@/store/chatStore';
import { ChatSession } from '@/types';
import { formatTimestamp, truncateText, cn } from '@/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const {
    sessions,
    currentSession,
    setCurrentSession,
    createSession,
    deleteSession,
    updateSessionTitle,
    selectedModel,
    models,
  } = useChatStore();

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleCreateSession = async () => {
    if (!selectedModel) return;
    await createSession(selectedModel);
    // On mobile, close sidebar after creating session
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session);
    // On mobile, close sidebar after selecting session
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete session clicked:', sessionId);
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        console.log('Attempting to delete session:', sessionId);
        await deleteSession(sessionId);
        console.log('Session deleted successfully');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleStartEditing = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveEdit = async (sessionId: string) => {
    if (editingTitle.trim()) {
      await updateSessionTitle(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Libre WebUI
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleCreateSession}
              disabled={!selectedModel || models.length === 0}
              className="w-full"
              size="sm"
              title={!selectedModel || models.length === 0 ? 'No models available. Please ensure Ollama is running and models are installed.' : ''}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            
            {/* Model status indicator */}
            {models.length === 0 && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  No models available. Please ensure Ollama is running and models are installed.
                </p>
              </div>
            )}
            
            {selectedModel && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Using model: <span className="font-medium">{selectedModel}</span>
                </p>
              </div>
            )}
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chats yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'group relative rounded-lg p-3 cursor-pointer transition-colors',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        currentSession?.id === session.id &&
                          'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                      )}
                      onClick={() => handleSelectSession(session)}
                    >
                      {editingSessionId === session.id ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(session.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            className="text-sm h-8"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveEdit(session.id)}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {truncateText(session.title, 30)}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTimestamp(session.updatedAt)} • {session.model}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleStartEditing(session, e)}
                                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                                title="Rename chat"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete chat"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {session.messages.length > 0 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                              {truncateText(session.messages[session.messages.length - 1]?.content || '', 60)}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {models.length > 0 && (
                <p>
                  Using <span className="font-medium">{selectedModel || 'No model selected'}</span>
                </p>
              )}
              <p className="mt-1">
                {sessions.length} chat{sessions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
