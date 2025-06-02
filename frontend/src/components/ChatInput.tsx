import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const { isGenerating } = useAppStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isGenerating) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStopGeneration = () => {
    onStopGeneration();
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);  return (
    <div className="border-t border-gray-100 dark:border-dark-200 bg-white dark:bg-dark-100 p-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            className={cn(
              'min-h-[52px] max-h-[200px] resize-none bg-gray-50 dark:bg-dark-50 border-gray-200 dark:border-dark-300',
              'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-400',
              'focus:bg-white dark:focus:bg-dark-50'
            )}
            rows={1}
          />
        </div>

        <div className="flex flex-col justify-end">
          {isGenerating ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleStopGeneration}
              className="h-[52px] w-[52px] p-0 border-gray-200 dark:border-dark-300 hover:border-gray-300 dark:hover:border-dark-400"
              title="Stop generation"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!message.trim() || disabled}
              className="h-[52px] w-[52px] p-0 shadow-md hover:shadow-lg disabled:shadow-sm"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-dark-600 text-center">
        Libre WebUI • Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};
