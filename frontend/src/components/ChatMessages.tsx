import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/utils';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  streamingMessage?: string;
  isStreaming?: boolean;
  className?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  streamingMessage,
  isStreaming = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
          <p className="text-sm">
            Send a message to begin chatting with your AI assistant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
        className
      )}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={isStreaming && message === messages[messages.length - 1]}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
