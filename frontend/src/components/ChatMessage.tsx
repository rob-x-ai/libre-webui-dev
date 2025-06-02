import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { MessageContent } from '@/components/ui';
import { formatTimestamp, cn } from '@/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  className,
}) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 p-6 transition-colors group',
        isUser 
          ? 'bg-transparent' 
          : 'bg-gray-25 dark:bg-dark-100/50',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-700 text-white dark:bg-dark-600'
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
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-dark-800">
            {isUser ? 'You' : 'Assistant'}
          </span>
          {message.model && !isUser && (
            <span className="text-xs text-gray-500 dark:text-dark-600 bg-gray-100 dark:bg-dark-200 px-2 py-0.5 rounded-full">
              {message.model}
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-dark-500">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className="text-gray-700 dark:text-dark-700">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="relative">
              <MessageContent content={message.content} />
              {isStreaming && (
                <div className="inline-block w-2 h-5 bg-primary-500 animate-pulse ml-1 rounded-sm" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
