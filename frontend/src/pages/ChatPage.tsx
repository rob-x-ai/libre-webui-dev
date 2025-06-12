import React from 'react';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { Logo } from '@/components/Logo';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { Select } from '@/components/ui';

export const ChatPage: React.FC = () => {
  const { currentSession, models, selectedModel, setSelectedModel, createSession } = useChatStore();
  const { sendMessage, stopGeneration, isStreaming } = useChat(currentSession?.id || '');

  const handleModelChange = async (model: string) => {
    setSelectedModel(model);
    if (!currentSession) {
      await createSession(model);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!currentSession) return;
    sendMessage(message);
  };

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <Logo size="lg" className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-800 mb-3">
            Welcome to Libre WebUI
          </h2>
          <p className="text-gray-600 dark:text-dark-600 mb-8 leading-relaxed">
            Select a model and start a conversation with your AI assistant
          </p>
          
          {models.length > 0 ? (
            <div className="space-y-6">
              <Select
                label="Choose a model"
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                options={models.map(model => ({
                  value: model.name,
                  label: model.name
                }))}
                className="text-left"
              />
              {selectedModel && (
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    Click "New Chat" in the sidebar to begin your conversation
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl">
                <p className="text-sm text-warning-700 dark:text-warning-300 mb-4">
                  No models available. Make sure Ollama is running and has models installed.
                </p>
                <code className="block text-xs bg-warning-100 dark:bg-warning-900/40 p-3 rounded-lg font-mono">
                  ollama pull llama3.2:3b
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatMessages 
        messages={currentSession.messages}
        isStreaming={isStreaming}
        className="flex-1"
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        onStopGeneration={stopGeneration}
        disabled={!currentSession}
      />
    </div>
  );
};
