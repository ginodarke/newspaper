import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-700 text-white dark:bg-slate-900 backdrop-blur supports-[backdrop-filter]:bg-blue-700/95 dark:supports-[backdrop-filter]:bg-slate-900/90">
      <div className="container flex h-16 items-center max-w-7xl">
        {/* Mobile menu button */}
        <button
          className="mr-4 md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">Newspaper<span className="text-blue-300">.AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/feed" className="text-sm font-medium transition-colors hover:text-blue-200 text-white">
            Feed
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-blue-200 text-white">
            Categories
          </Link>
          <Link to="/saved" className="text-sm font-medium transition-colors hover:text-blue-200 text-white">
            Saved
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <div className="relative">
            <button
              className="p-2 hover:bg-blue-600 dark:hover:bg-slate-800 rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-white" />
            </button>

            {isSearchOpen && (
              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-12 w-72 rounded-md border border-blue-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 bg-transparent px-2 py-1 text-sm outline-none text-blue-900 dark:text-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 dark:bg-blue-700 px-3 py-1 text-sm text-white"
                  >
                    Search
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-blue-600 dark:hover:bg-slate-800 rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-white" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="p-2 hover:bg-accent rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative flex items-center space-x-2">
              <Link 
                to="/onboarding"
                className="hidden md:block text-sm font-medium transition-colors hover:text-blue-200 mr-2"
              >
                Set Up Profile
              </Link>
              <button
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 dark:hover:bg-slate-800 rounded-full"
                aria-label="User menu"
              >
                <User className="h-5 w-5 text-white" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-white text-blue-700 dark:bg-blue-200 dark:text-blue-900 px-4 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 