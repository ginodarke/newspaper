import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Search, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <header className="sticky top-0 z-overlay w-full border-b border-border bg-primary-bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-primary-bg-dark/80">
      <div className="container flex h-16 items-center max-w-7xl">
        {/* Mobile menu button */}
        <motion.button
          className="mr-4 p-2 rounded-md md:hidden hover:bg-primary-bg-light text-text-primary"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-6 w-6" />
        </motion.button>

        {/* Logo */}
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <motion.span 
            className="text-xl font-bold" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-primary">Newspaper</span>
            <span className="text-secondary">.AI</span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/feed" className="transition-colors text-text-primary hover:text-primary">
            Feed
          </Link>
          <Link to="/categories" className="text-text-secondary transition-colors hover:text-primary">
            Categories
          </Link>
          <Link to="/saved" className="text-text-secondary transition-colors hover:text-primary">
            Saved
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Search Button & Form */}
          <div className="relative">
            <motion.button
              className="p-2 rounded-full text-text-primary hover:bg-primary-bg-light"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            {isSearchOpen && (
              <motion.form
                onSubmit={handleSearch}
                className="absolute right-0 top-12 w-64 sm:w-72 rounded-md border border-border bg-secondary-bg p-2 shadow-elevation-2 text-text-primary"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 bg-transparent px-2 py-1 text-sm outline-none text-text-primary placeholder:text-text-secondary"
                    autoFocus
                  />
                  <motion.button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                    whileTap={{ scale: 0.95 }}
                  >
                    Search
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-primary hover:bg-primary-bg-light"
            aria-label="Toggle theme"
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          {/* User Menu or Sign In Button */}
          {user ? (
            <div className="relative flex items-center space-x-2">
              <Link 
                to="/onboarding"
                className="hidden sm:block text-sm font-medium text-text-secondary transition-colors hover:text-primary mr-2"
              >
                Set Up Profile
              </Link>
              <motion.button
                className="flex items-center space-x-2 p-2 rounded-full text-text-primary hover:bg-primary-bg-light"
                aria-label="User menu"
                onClick={() => navigate('/profile')}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5" />
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow-elevation-1 hover:bg-primary/90 h-9 px-4 py-2"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
} 