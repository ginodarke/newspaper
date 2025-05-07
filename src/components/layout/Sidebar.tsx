import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Newspaper,
  Bookmark,
  Clock,
  Settings,
  TrendingUp,
  Globe,
  Briefcase,
  Film,
  Music,
  Gamepad2,
  Heart,
  MapPin
} from 'lucide-react';

const categories = [
  { name: 'Trending', icon: TrendingUp, path: '/trending' },
  { name: 'World', icon: Globe, path: '/category/world' },
  { name: 'Business', icon: Briefcase, path: '/category/business' },
  { name: 'Entertainment', icon: Film, path: '/category/entertainment' },
  { name: 'Music', icon: Music, path: '/category/music' },
  { name: 'Gaming', icon: Gamepad2, path: '/category/gaming' },
  { name: 'Health', icon: Heart, path: '/category/health' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/feed"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/feed')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/local"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/local')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <MapPin className="h-5 w-5" />
          <span>Local News</span>
        </Link>

        <Link
          to="/latest"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/latest')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <Newspaper className="h-5 w-5" />
          <span>Latest News</span>
        </Link>

        <Link
          to="/saved"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/saved')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span>Saved Articles</span>
        </Link>

        <Link
          to="/history"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/history')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <Clock className="h-5 w-5" />
          <span>Reading History</span>
        </Link>
      </nav>

      {/* Categories Section */}
      <div className="p-4 border-t">
        <h3 className="px-3 text-sm font-semibold text-muted-foreground mb-2">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.path}
                to={category.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(category.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t">
        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
} 