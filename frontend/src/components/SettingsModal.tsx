import React, { useState } from 'react';
import { X, Moon, Sun, User, Bot, Database, Shield, Palette, Settings } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { ModelTools } from '@/components/ModelTools';
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
  const [activeTab, setActiveTab] = useState('general');

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

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'models', label: 'Models', icon: Bot },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                General Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                    Language
                  </label>
                  <Select
                    value="en"
                    onChange={() => {}}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                    ]}
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                    More languages coming soon
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-700">
                      Enable keyboard shortcuts
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked={false}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-700">
                      Show typing indicators
                    </span>
                  </label>
                </div>
              </div>
              </div>
            </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                Appearance
              </h3>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                Chat Density
              </label>
              <Select
                value="comfortable"
                onChange={() => {}}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'spacious', label: 'Spacious' },
                ]}
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                Coming soon
              </p>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  defaultChecked={true}
                />
                <span className="text-sm text-gray-700 dark:text-dark-700">
                  Enable animations
                </span>
              </label>
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                Model Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
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
                  <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                    This model will be used for new conversations
                  </p>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                    Model Parameters (Beta)
                  </label>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                      Advanced model configuration coming soon
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-600">Temperature:</span>
                        <span className="text-gray-900 dark:text-dark-800">0.7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-600">Top P:</span>
                        <span className="text-gray-900 dark:text-dark-800">0.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ModelTools />
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                Data Management
              </h3>
              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                    Export Data
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Export Conversations
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Export Settings
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                    Coming soon
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-700">
                      Auto-save conversations
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked={false}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-700">
                      Send usage analytics (helps improve the app)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-dark-700">
                      Keep conversations private (local storage only)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                    Data Retention
                  </label>
                  <Select
                    value="forever"
                    onChange={() => {}}
                    options={[
                      { value: '7days', label: '7 days' },
                      { value: '30days', label: '30 days' },
                      { value: '6months', label: '6 months' },
                      { value: 'forever', label: 'Forever' },
                    ]}
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-800 mb-4">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Local User
                      </h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        You're using Libre WebUI in local mode. Account sync and cloud features coming soon.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-200"
                    placeholder="Your name"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-600 mt-1">
                    Coming soon
                  </p>
                </div>
                <div>
                  <Button variant="outline" size="sm" disabled>
                    Sign In / Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl mx-4 max-h-[95vh] sm:max-h-[90vh]">
        <div className="bg-white dark:bg-dark-50 rounded-lg sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-200 animate-scale-in flex flex-col h-full max-h-[95vh] sm:max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-dark-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-dark-800">
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

          <div className="flex flex-1 min-h-0">
            {/* Sidebar Tabs */}
            <div className="w-48 sm:w-64 border-r border-gray-100 dark:border-dark-200 p-3 sm:p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-left rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                          : 'text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium truncate">{tab.label}</span>
                      {tab.id === 'models' && (
                        <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 sm:px-2 py-0.5 rounded-full hidden sm:inline">
                          Beta
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-100 dark:border-dark-200">
            <Button variant="outline" onClick={onClose} size="md">
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
