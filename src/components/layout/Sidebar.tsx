import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Home, BookOpen, Search, Users, Settings, User, Globe, Briefcase, Heart, Film, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle';

export const categories = [
  { key: 'general', label: 'General', icon: <Home size={20} /> },
  { key: 'business', label: 'Business', icon: <Briefcase size={20} /> },
  { key: 'health', label: 'Health', icon: <Heart size={20} /> },
  { key: 'entertainment', label: 'Entertainment', icon: <Film size={20} /> },
  { key: 'sports', label: 'Sports', icon: <Dumbbell size={20} /> },
  { key: 'technology', label: 'Technology', icon: <Settings size={20} /> },
  { key: 'science', label: 'Science', icon: <Globe size={20} /> },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>('categories');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  return (
    <aside className="w-64 border-r border-border h-full bg-card text-card-foreground flex flex-col">
      {/* User Profile Section */}
      {user ? (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center font-medium">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">Personal Account</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-border">
          <NavLink 
            to="/auth" 
            className="flex items-center justify-center w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Sign In
          </NavLink>
        </div>
      )}
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              }`
            }
          >
            <Home size={18} className="mr-2" />
            Home
          </NavLink>
          
          <NavLink 
            to="/feed" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              }`
            }
          >
            <BookOpen size={18} className="mr-2" />
            News Feed
          </NavLink>
        </div>
        
        {/* Categories Section */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md"
          >
            <span>Categories</span>
            {openSection === 'categories' ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          
          {openSection === 'categories' && (
            <div className="ml-2 space-y-1 border-l border-border pl-3 mt-1">
              {categories.map((category) => (
                <NavLink 
                  key={category.key}
                  to={`/category/${category.key}`}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-1.5 rounded-md text-sm ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                    }`
                  }
                >
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        
        {/* User Section */}
        {user && (
          <div className="space-y-1">
            <button 
              onClick={() => toggleSection('user')}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md"
            >
              <span>Your Account</span>
              {openSection === 'user' ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            
            {openSection === 'user' && (
              <div className="ml-2 space-y-1 border-l border-border pl-3 mt-1">
                <NavLink 
                  to="/profile"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-1.5 rounded-md text-sm ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                    }`
                  }
                >
                  <User size={18} className="mr-2" />
                  Profile
                </NavLink>
                
                <NavLink 
                  to="/settings"
                  className={({ isActive }) => 
                    `flex items-center px-3 py-1.5 rounded-md text-sm ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                    }`
                  }
                >
                  <Settings size={18} className="mr-2" />
                  Settings
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Newspaper.AI</p>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
} 