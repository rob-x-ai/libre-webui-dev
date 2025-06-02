import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils';

interface MessageContentProps {
  content: string;
  className?: string;
}

export const MessageContent: React.FC<MessageContentProps> = ({
  content,
  className,
}) => {
  const { theme } = useAppStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              return (
                <div className="relative group">
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {match[1]}
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Copy code"
                    >
                      {copiedCode === codeString ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={theme.mode === 'dark' ? oneDark as any : oneLight as any}
                    language={match[1]}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none"
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className={cn(
                  'px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children, ...props }: any) {
            return <pre {...props}>{children}</pre>;
          },
          p({ children, ...props }) {
            return <p className="mb-3 last:mb-0" {...props}>{children}</p>;
          },
          ul({ children, ...props }) {
            return <ul className="list-disc list-inside mb-3 space-y-1" {...props}>{children}</ul>;
          },
          ol({ children, ...props }) {
            return <ol className="list-decimal list-inside mb-3 space-y-1" {...props}>{children}</ol>;
          },
          li({ children, ...props }) {
            return <li className="text-gray-700 dark:text-gray-300" {...props}>{children}</li>;
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-3"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          h1({ children, ...props }) {
            return <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100" {...props}>{children}</h1>;
          },
          h2({ children, ...props }) {
            return <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100" {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            return <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100" {...props}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
