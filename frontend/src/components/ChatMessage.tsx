import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { MessageContent } from '@/components/ui';
import { formatTimestamp, cn } from '@/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 p-4 transition-colors',
        isUser 
          ? 'bg-transparent' 
          : 'bg-gray-50 dark:bg-gray-900/50'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-900'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {isUser ? 'You' : 'Assistant'}
          </span>
          {message.model && !isUser && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.model}
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className="text-gray-700 dark:text-gray-300">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="relative">
              <MessageContent content={message.content} />
              {isStreaming && (
                <div className="inline-block w-2 h-4 bg-gray-600 dark:bg-gray-400 animate-pulse ml-1" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
