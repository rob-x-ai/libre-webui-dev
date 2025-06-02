import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0"
      title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme.mode === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};
