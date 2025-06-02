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
      <div className="flex h-screen bg-gray-25 dark:bg-dark-100 text-gray-900 dark:text-dark-800">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-hidden bg-white dark:bg-dark-50">
            <ChatPage />
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'animate-slide-up',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
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
