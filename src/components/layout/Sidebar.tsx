import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Clock, 
  Map, 
  Globe, 
  User, 
  Settings, 
  LogOut,
  Bookmark,
  Search,
  PanelRight,
  Newspaper,
  Zap,
  Target,
  Library,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const categories = [
  { name: 'Technology', icon: <Zap size={16} /> },
  { name: 'Business', icon: <Newspaper size={16} /> },
  { name: 'Politics', icon: <Globe size={16} /> },
  { name: 'Health', icon: <Target size={16} /> },
  { name: 'Science', icon: <Library size={16} /> }
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    categories: false,
    account: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get user's first name or username for display
  const displayName = user?.email ? user.email.split('@')[0] : 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Animation variants
  const sidebarVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  // Check if a route is active or its parent is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.aside 
      className="w-64 h-screen bg-primary-bg sticky top-0 border-r border-border shadow-elevation-1 dark:shadow-none overflow-hidden"
      initial="initial"
      animate="animate"
      variants={sidebarVariants}
    >
      <div className="h-full flex flex-col">
        {/* User Profile Section */}
        <div className="p-4 border-b border-border bg-primary-bg-light inner-light-top">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white shadow-elevation-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-bold">{userInitial}</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary truncate">
                {displayName}
              </h3>
              {user && (
                <p className="text-xs text-text-secondary truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
          <motion.div 
            className="px-2 space-y-1"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Navigation */}
            <div className="mb-4">
              <h4 className="px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Discover
              </h4>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/" icon={<Home size={18} />} label="Home" active={location.pathname === '/'} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/trending" icon={<TrendingUp size={18} />} label="Trending" active={isActive('/trending')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/local" icon={<Map size={18} />} label="Local" active={isActive('/local')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/national" icon={<Globe size={18} />} label="National" active={isActive('/national')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/foryou" icon={<Target size={18} />} label="For You" active={isActive('/foryou')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/search" icon={<Search size={18} />} label="Search" active={isActive('/search')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/recent" icon={<Clock size={18} />} label="Recently Read" active={isActive('/recent')} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <NavLink to="/saved" icon={<Bookmark size={18} />} label="Saved Articles" active={isActive('/saved')} />
              </motion.div>
            </div>
            
            {/* Categories Section */}
            <div className="mb-4">
              <motion.button
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg"
                onClick={() => toggleSection('categories')}
                whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <Newspaper size={18} className="mr-3 text-text-secondary" />
                  <span>Categories</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.categories ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-text-secondary" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <motion.div 
                      className="pt-1 pl-10 pr-2 space-y-1"
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {categories.map((category) => (
                        <motion.div key={category.name} variants={itemVariants}>
                          <NavLink 
                            to={`/category/${category.name.toLowerCase()}`} 
                            icon={category.icon} 
                            label={category.name} 
                            compact
                            active={location.pathname === `/category/${category.name.toLowerCase()}`}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </nav>

        {/* Footer Actions */}
        <div className="px-2 py-4 border-t border-border bg-primary-bg/50">
          <motion.div 
            className="space-y-1"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Account Section */}
            <motion.button
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors rounded-lg"
              onClick={() => toggleSection('account')}
              whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <User size={18} className="mr-3 text-text-secondary" />
                <span>Account</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.account ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-text-secondary" />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {expandedSections.account && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    className="pt-1 pl-10 pr-2 space-y-1"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <NavLink to="/profile" icon={<User size={16} />} label="Profile" compact active={isActive('/profile')} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <NavLink to="/settings" icon={<Settings size={16} />} label="Settings" compact active={isActive('/settings')} />
                    </motion.div>
                    {user && (
                      <motion.div variants={itemVariants}>
                        <button
                          className="flex items-center w-full px-3 py-2 text-xs font-medium text-text-secondary hover:text-primary transition-colors rounded-md"
                          onClick={signOut}
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div variants={itemVariants}>
              <NavLink to="/about" icon={<PanelRight size={18} />} label="About" active={isActive('/about')} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  compact?: boolean;
}

function NavLink({ to, icon, label, active = false, compact = false }: NavLinkProps) {
  return (
    <Link to={to}>
      <motion.div
        className={`flex items-center px-3 py-${compact ? '2' : '2.5'} rounded-lg relative ${
          active 
            ? 'text-primary font-medium bg-primary/10 shadow-elevation-1 inner-light' 
            : 'text-text-secondary hover:text-text-primary'
        } transition-all`}
        whileHover={!active ? { backgroundColor: 'rgba(var(--primary-rgb), 0.05)', y: -1 } : {}}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`${active ? 'text-primary' : 'text-text-secondary'} mr-3`}>
          {icon}
        </span>
        <span className={`text-${compact ? 'xs' : 'sm'}`}>{label}</span>
        {active && (
          <motion.div 
            className="absolute left-0 top-1/2 h-6 w-0.5 bg-primary rounded-full transform -translate-y-1/2"
            layoutId="activeIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
} 