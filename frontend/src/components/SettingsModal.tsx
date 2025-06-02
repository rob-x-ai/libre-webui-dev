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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">
        <div className="bg-white dark:bg-dark-50 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-200 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-800">
              Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-dark-200"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {/* Theme Settings */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-dark-800 mb-3">
                Appearance
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={theme.mode === 'light' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center gap-2 h-12"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme.mode === 'dark' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center gap-2 h-12"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>

            {/* Default Model Settings */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-dark-800 mb-3">
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
              <p className="text-xs text-gray-500 dark:text-dark-600 mt-2">
                This model will be used for new conversations
              </p>
            </div>

            {/* Model Information */}
            {selectedModel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                  Current Model Info
                </label>
                <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 dark:text-dark-600">Name:</span>
                      <span className="ml-1 text-gray-900 dark:text-dark-800">
                        {selectedModel}
                      </span>
                    </div>
                    {(() => {
                      const model = models.find(m => m.name === selectedModel);
                      if (model?.details) {
                        return (
                          <>
                            <div>
                              <span className="text-gray-500 dark:text-dark-600">Size:</span>
                              <span className="ml-1 text-gray-900 dark:text-dark-800">
                                {model.details.parameter_size}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-dark-600">Family:</span>
                              <span className="ml-1 text-gray-900 dark:text-dark-800">
                                {model.details.family}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-dark-600">Format:</span>
                              <span className="ml-1 text-gray-900 dark:text-dark-800">
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
              <label className="block text-sm font-semibold text-gray-900 dark:text-dark-800 mb-3">
                Data Management
              </label>
              <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-error-600 dark:text-error-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-error-800 dark:text-error-200 mb-2">
                      Clear All Chat History
                    </h4>
                    <p className="text-xs text-error-700 dark:text-error-300 mb-4">
                      This will permanently delete all your chat sessions and messages. This action cannot be undone.
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleClearAllHistory}
                      disabled={loading}
                    >
                      {loading ? 'Clearing...' : 'Clear All History'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-dark-200">
            <Button variant="outline" onClick={onClose} size="md">
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
