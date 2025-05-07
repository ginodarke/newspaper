import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-30
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 bg-card border-r border-border
        `}>
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-8">
              {children}
            </div>

            {/* Right sidebar for desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-8">
                {/* Add widgets here */}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
} 