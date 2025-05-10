import React, { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Pages that should use a special layout without sidebar (full screen)
  const fullScreenPaths = ['/auth', '/onboarding'];
  const isFullScreenPage = fullScreenPaths.includes(location.pathname);
  
  if (isFullScreenPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <div className={`md:block ${isSidebarOpen ? 'block' : 'hidden'} fixed md:relative z-30 md:z-auto inset-y-0 left-0`}>
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <main className="flex-1 overflow-auto px-4 py-6 bg-primary-bg">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
} 