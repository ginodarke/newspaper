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

export const categories = [
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

  // Common link classes
  const linkClasses = "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-primary text-primary-foreground";
  const inactiveClasses = "hover:bg-accent hover:text-accent-foreground text-muted-foreground";

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b border-border">
          <Link to="/profile" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <span className="text-lg font-semibold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">{user.email}</p>
              <p className="text-xs text-muted-foreground truncate">View Profile</p>
            </div>
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/feed"
          className={`${linkClasses} ${isActive('/feed') ? activeClasses : inactiveClasses}`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Link to Onboarding (Profile Setup) - Consider moving to user dropdown/profile page */}
        {/* {user && (
          <Link
            to="/onboarding"
            className={`${linkClasses} ${isActive('/onboarding') ? activeClasses : inactiveClasses}`}
          >
            <Settings className="h-5 w-5" />
            <span>Set Up Profile</span>
          </Link>
        )} */}

        <Link
          to="/latest"
          className={`${linkClasses} ${isActive('/latest') ? activeClasses : inactiveClasses}`}
        >
          <Newspaper className="h-5 w-5" />
          <span>Latest News</span>
        </Link>

        <Link
          to="/saved"
          className={`${linkClasses} ${isActive('/saved') ? activeClasses : inactiveClasses}`}
        >
          <Bookmark className="h-5 w-5" />
          <span>Saved Articles</span>
        </Link>

        <Link
          to="/history"
          className={`${linkClasses} ${isActive('/history') ? activeClasses : inactiveClasses}`}
        >
          <Clock className="h-5 w-5" />
          <span>Reading History</span>
        </Link>
      </nav>

      {/* Categories Section */}
      <div className="p-4 border-t border-border">
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
                className={`${linkClasses} ${isActive(category.path) ? activeClasses : inactiveClasses}`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Settings Section - Placeholder, potentially move to profile */}
      <div className="p-4 border-t border-border">
        <Link
          to="/profile"
          className={`${linkClasses} ${isActive('/settings') ? activeClasses : inactiveClasses}`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
} 