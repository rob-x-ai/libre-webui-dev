import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChatPage } from '@/pages';
import { useAppStore } from '@/store/appStore';
import { useInitializeApp } from '@/hooks/useInitializeApp';
import websocketService from '@/utils/websocket';

const App: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore();

  // Initialize the app
  useInitializeApp();

  // Initialize WebSocket connection
  React.useEffect(() => {
    websocketService.connect().catch(console.error);
    
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-hidden">
            <ChatPage />
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
