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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <span className="text-xl font-bold">Newspaper.AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/feed" className="text-sm font-medium transition-colors hover:text-primary">
            Feed
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
            Categories
          </Link>
          <Link to="/saved" className="text-sm font-medium transition-colors hover:text-primary">
            Saved
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <div className="relative">
            <button
              className="p-2 hover:bg-accent rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {isSearchOpen && (
              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-12 w-72 rounded-md border bg-background p-2 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 bg-transparent px-2 py-1 text-sm outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
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
            className="p-2 hover:bg-accent rounded-full"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
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
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-full"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 