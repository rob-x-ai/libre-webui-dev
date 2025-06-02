import React, { useState } from 'react';
import { Menu, Settings, Bot } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsModal } from '@/components/SettingsModal';
import { useChatStore } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  className,
}) => {
  const { currentSession, models, updateCurrentSessionModel } = useChatStore();
  const { sidebarOpen } = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleModelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value;
    if (currentSession && newModel !== currentSession.model) {
      try {
        await updateCurrentSessionModel(newModel);
      } catch (error) {
        console.error('Failed to update session model:', error);
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          className
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 p-0"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentSession?.title || 'Libre WebUI'}
              </h1>
              {currentSession && models.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Model:</span>
                  <Select
                    value={currentSession.model}
                    onChange={handleModelChange}
                    options={models.map(model => ({ 
                      value: model.name, 
                      label: model.name 
                    }))}
                    className="text-xs min-w-0 py-1 px-2 h-6"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            title="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </>
  );
};
