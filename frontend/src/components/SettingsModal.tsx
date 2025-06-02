import React from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { useChatStore } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { models, selectedModel, setSelectedModel, clearAllSessions, loading } = useChatStore();
  const { theme, setTheme } = useAppStore();

  if (!isOpen) return null;

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setTheme({ mode });
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      await clearAllSessions();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Theme Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={theme.mode === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme.mode === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>

            {/* Default Model Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Model
              </label>
              <Select
                value={selectedModel || ''}
                onChange={handleModelChange}
                options={[
                  { value: '', label: 'Select a model' },
                  ...models.map((model) => ({
                    value: model.name,
                    label: model.name
                  }))
                ]}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This model will be used for new conversations
              </p>
            </div>

            {/* Model Information */}
            {selectedModel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Model Info
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="ml-1 text-gray-900 dark:text-gray-100">
                        {selectedModel}
                      </span>
                    </div>
                    {(() => {
                      const model = models.find(m => m.name === selectedModel);
                      if (model?.details) {
                        return (
                          <>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Size:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">
                                {model.details.parameter_size}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Family:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">
                                {model.details.family}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Format:</span>
                              <span className="ml-1 text-gray-900 dark:text-gray-100">
                                {model.details.format}
                              </span>
                            </div>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Management
              </label>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                      Clear All Chat History
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-400 mb-3">
                      This will permanently delete all your chat sessions and messages. This action cannot be undone.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllHistory}
                      disabled={loading}
                      className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {loading ? 'Clearing...' : 'Clear All History'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
