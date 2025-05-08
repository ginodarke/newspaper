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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-7xl">
        {/* Mobile menu button */}
        <button
          className="mr-4 p-2 rounded-md md:hidden hover:bg-accent hover:text-accent-foreground"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Newspaper<span className="text-secondary">.AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/feed" className="transition-colors hover:text-primary">
            Feed
          </Link>
          <Link to="/categories" className="text-muted-foreground transition-colors hover:text-primary">
            Categories
          </Link>
          <Link to="/saved" className="text-muted-foreground transition-colors hover:text-primary">
            Saved
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Search Button & Form */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {isSearchOpen && (
              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-12 w-64 sm:w-72 rounded-md border bg-popover p-2 shadow-lg text-popover-foreground"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
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
            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* User Menu or Sign In Button */}
          {user ? (
            <div className="relative flex items-center space-x-2">
              <Link 
                to="/onboarding"
                className="hidden sm:block text-sm font-medium text-muted-foreground transition-colors hover:text-primary mr-2"
              >
                Set Up Profile
              </Link>
              <button
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
                aria-label="User menu"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 