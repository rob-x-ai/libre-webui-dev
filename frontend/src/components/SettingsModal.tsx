import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, User, Bot, Database, Shield, Palette, Settings, Monitor, MessageSquare, Cpu } from 'lucide-react';
import { Button, Select, Textarea } from '@/components/ui';
import { ModelTools } from '@/components/ModelTools';
import { useChatStore } from '@/store/chatStore';
import { useAppStore } from '@/store/appStore';
import { preferencesApi, ollamaApi } from '@/utils/api';
import toast from 'react-hot-toast';

interface SystemInfo {
  ollamaVersion?: string;
  modelsCount: number;
  sessionsCount: number;
  isHealthy: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { models, selectedModel, setSelectedModel, systemMessage, setSystemMessage, clearAllSessions, loading, sessions } = useChatStore();
  const { theme, setTheme, preferences, setPreferences } = useAppStore();
  const [activeTab, setActiveTab] = useState('general');
  const [tempSystemMessage, setTempSystemMessage] = useState(systemMessage);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    modelsCount: 0,
    sessionsCount: 0,
    isHealthy: false,
  });

  // Load system information
  useEffect(() => {
    if (isOpen) {
      loadSystemInfo();
      setTempSystemMessage(systemMessage);
    }
  }, [isOpen, systemMessage, models, sessions]);

  const loadSystemInfo = async () => {
    try {
      const [healthResponse, versionResponse] = await Promise.all([
        ollamaApi.checkHealth().catch(() => ({ success: false })),
        ollamaApi.getVersion().catch(() => ({ success: false, data: null })),
      ]);

      setSystemInfo({
        ollamaVersion: versionResponse.success && versionResponse.data ? versionResponse.data.version : undefined,
        modelsCount: models.length,
        sessionsCount: sessions.length,
        isHealthy: healthResponse.success,
      });
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<typeof preferences>) => {
    try {
      const response = await preferencesApi.updatePreferences(updates);
      if (response.success && response.data) {
        setPreferences(response.data);
        toast.success('Settings updated successfully');
      }
    } catch (error: any) {
      toast.error('Failed to update settings: ' + error.message);
    }
  };

  if (!isOpen) return null;

  const handleThemeChange = (mode: 'light' | 'dark') => {
    const newTheme = { mode };
    setTheme(newTheme);
    handleUpdatePreferences({ theme: newTheme });
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value;
    setSelectedModel(newModel);
    handleUpdatePreferences({ defaultModel: newModel });
    toast.success('Default model updated');
  };

  const handleSystemMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempSystemMessage(event.target.value);
  };

  const handleSystemMessageSave = () => {
    setSystemMessage(tempSystemMessage);
    handleUpdatePreferences({ systemMessage: tempSystemMessage });
    toast.success('System message updated');
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      await clearAllSessions();
      loadSystemInfo(); // Refresh system info
      toast.success('All chat sessions deleted');
    }
  };

  const handleExportData = () => {
    const data = {
      preferences,
      sessions,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `libre-webui-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'system', label: 'System', icon: Monitor },
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                General Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    More languages coming soon
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enable keyboard shortcuts
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                      defaultChecked={false}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show typing indicators
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                System Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${systemInfo.isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ollama Status
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {systemInfo.isHealthy ? 'Healthy' : 'Offline'}
                  </p>
                  {systemInfo.ollamaVersion && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      v{systemInfo.ollamaVersion}
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-3 w-3 text-gray-500 dark:text-dark-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Models
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {systemInfo.modelsCount}
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chat Sessions
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {systemInfo.sessionsCount}
                  </p>
                </div>

                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-3 w-3 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Model
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {selectedModel || 'Not set'}
                  </p>
                </div>
              </div>

              <Button
                onClick={loadSystemInfo}
                variant="outline"
                size="sm"
              >
                Refresh Status
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Appearance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center gap-2 h-12 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme.mode === 'light'
                      ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400'
                      : 'border border-gray-300 text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 dark:border-dark-300 dark:text-dark-700 dark:bg-dark-25 dark:hover:bg-dark-200 dark:hover:border-dark-400'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center gap-2 h-12 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    theme.mode === 'dark'
                      ? 'bg-dark-300 text-dark-800 border border-dark-400 shadow-sm hover:bg-dark-400 focus:ring-dark-500'
                      : 'border border-gray-300 text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 dark:border-dark-300 dark:text-dark-700 dark:bg-dark-25 dark:hover:bg-dark-200 dark:hover:border-dark-400'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Coming soon
              </p>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                  defaultChecked={true}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Model Settings
              </h3>
              <div className="space-y-6">
                {/* Default Model Selection */}
                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    This model will be used for new conversations
                  </p>
                </div>

                {/* Current Model Info */}
                {selectedModel && (
                  <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Current Model Information
                    </label>
                    <div className="bg-gray-50 dark:bg-dark-50 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate ml-2">
                            {selectedModel}
                          </span>
                        </div>
                        {(() => {
                          const model = models.find(m => m.name === selectedModel);
                          if (model?.details) {
                            return (
                              <>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {model.details.parameter_size}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Family:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {model.details.family}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Format:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
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

                {/* System Message */}
                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    System Message
                  </label>
                  <Textarea
                    value={tempSystemMessage}
                    onChange={handleSystemMessageChange}
                    placeholder="Enter a system message that will be added to the beginning of new chat sessions..."
                    className="w-full min-h-[100px] bg-gray-50 dark:bg-dark-50 border-gray-200 dark:border-dark-300 text-gray-900 dark:text-gray-100"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This message will be automatically added to the start of new conversations to set the AI's behavior and context.
                    </p>
                    <Button
                      onClick={handleSystemMessageSave}
                      size="sm"
                      disabled={loading || tempSystemMessage === systemMessage}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                {/* Model Parameters */}
                <div className="bg-white dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Model Parameters (Beta)
                  </label>
                  <div className="bg-gray-50 dark:bg-dark-50 border border-gray-200 dark:border-dark-300 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-dark-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Advanced Configuration
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-dark-600">
                        Coming Soon
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Temperature:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">0.7</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Top P:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">0.9</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-dark-100 rounded-md border border-gray-200 dark:border-dark-300">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Max Tokens:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">2048</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Model Tools Section */}
              <div className="mt-6">
                <ModelTools />
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Data Management
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Export Data
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Download your settings and chat history as a JSON file.
                    </p>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Export All Data
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Clear Sessions
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Delete all chat sessions permanently. This cannot be undone.
                    </p>
                    <Button
                      onClick={handleClearAllHistory}
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                      disabled={sessions.length === 0 || loading}
                    >
                      {loading ? 'Clearing...' : `Clear All Sessions (${sessions.length})`}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    About Libre WebUI
                  </h4>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-lg p-4 border border-gray-200 dark:border-dark-300">
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <p>
                        <strong>Privacy First:</strong> All your data stays on your machine. No telemetry, no tracking.
                      </p>
                      <p>
                        <strong>Open Source:</strong> 100% free and open source software licensed under MIT.
                      </p>
                      <p>
                        <strong>Local Inference:</strong> Powered by Ollama for completely offline AI inference.
                      </p>
                      <p className="pt-2 border-t border-gray-200 dark:border-dark-300 italic">
                        "Like Rick Rubin strips music to its essence, Libre WebUI strips away UI complexity. Simple. Minimal. Effective."
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                      defaultChecked={false}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Send usage analytics (helps improve the app)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-dark-300 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
                      defaultChecked={true}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Keep conversations private (local storage only)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-100 text-gray-900 dark:text-gray-100"
                    placeholder="Your name"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
        <div className="bg-white dark:bg-dark-25 rounded-lg sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-200 animate-scale-in flex flex-col h-full max-h-[95vh] sm:max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-dark-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          ? 'bg-gray-100 dark:bg-dark-100 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
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

            {/* Tab Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
