import React, { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsModal } from '@/components/SettingsModal';
import { Logo } from '@/components/Logo';
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
          'flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-200 bg-white/80 dark:bg-dark-50/80 backdrop-blur-sm',
          className
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-dark-200"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-dark-800 leading-tight">
                {currentSession?.title || 'Libre WebUI'}
              </h1>
              {currentSession && models.length > 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-dark-500">Model:</span>
                  <Select
                    value={currentSession.model}
                    onChange={handleModelChange}
                    options={models.map(model => ({ 
                      value: model.name, 
                      label: model.name 
                    }))}
                    className="text-xs min-w-0 py-1 px-2 h-6 border-0 bg-gray-50 dark:bg-dark-200 rounded-lg"
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
            className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-dark-200"
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
