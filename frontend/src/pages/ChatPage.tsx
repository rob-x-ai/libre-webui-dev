import React from 'react';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { Select } from '@/components/ui';
import { Bot } from 'lucide-react';

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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Bot className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Libre WebUI
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select a model and start a conversation with your AI assistant
          </p>
          
          {models.length > 0 ? (
            <div className="space-y-4">
              <Select
                label="Choose a model"
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                options={models.map(model => ({
                  value: model.name,
                  label: model.name
                }))}
              />
              {selectedModel && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click "New Chat" in the sidebar or select a model to begin
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No models available. Make sure Ollama is running and has models installed.
              </p>
              <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                ollama pull llama2
              </code>
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
