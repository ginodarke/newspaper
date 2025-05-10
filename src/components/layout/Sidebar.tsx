import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Home, BookOpen, Search, Users, Settings, User, Globe, Briefcase, Heart, Film, Dumbbell, ChevronDown, ChevronUp, Newspaper, Zap, Bookmark } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const categories = [
  { key: 'general', label: 'General', icon: <Home size={18} /> },
  { key: 'business', label: 'Business', icon: <Briefcase size={18} /> },
  { key: 'health', label: 'Health', icon: <Heart size={18} /> },
  { key: 'entertainment', label: 'Entertainment', icon: <Film size={18} /> },
  { key: 'sports', label: 'Sports', icon: <Dumbbell size={18} /> },
  { key: 'technology', label: 'Technology', icon: <Settings size={18} /> },
  { key: 'science', label: 'Science', icon: <Globe size={18} /> },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>('categories');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15
      } 
    }
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <motion.aside 
      className="w-64 border-r border-border h-full bg-secondary-bg text-text-primary flex flex-col shadow-elevation-1 inner-light"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <span className="text-xl font-bold">
            <span className="text-primary">Newspaper</span>
            <span className="text-secondary">.AI</span>
          </span>
        </motion.div>
      </div>
      
      {/* User Profile Section */}
      {user ? (
        <motion.div 
          className="p-4 border-b border-border bg-primary-bg"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center font-medium shadow-elevation-1">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-text-primary">{user.email}</p>
              <p className="text-xs text-text-secondary">Personal Account</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="p-4 border-b border-border bg-primary-bg"
          variants={itemVariants}
        >
          <NavLink 
            to="/auth" 
            className="flex items-center justify-center w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-elevation-1"
          >
            Sign In
          </NavLink>
        </motion.div>
      )}
      
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <motion.div className="space-y-1" variants={itemVariants}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-md text-sm transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium shadow-elevation-1 translate-x-1' 
                  : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
              }`
            }
          >
            <Home size={18} className="mr-2.5" />
            Home
          </NavLink>
          
          <NavLink 
            to="/feed" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-md text-sm transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium shadow-elevation-1 translate-x-1' 
                  : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
              }`
            }
          >
            <Newspaper size={18} className="mr-2.5" />
            News Feed
          </NavLink>

          <NavLink 
            to="/local" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-md text-sm transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium shadow-elevation-1 translate-x-1' 
                  : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
              }`
            }
          >
            <Globe size={18} className="mr-2.5" />
            Local News
          </NavLink>

          <NavLink 
            to="/trending" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-md text-sm transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium shadow-elevation-1 translate-x-1' 
                  : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
              }`
            }
          >
            <Zap size={18} className="mr-2.5" />
            Trending
          </NavLink>
        </motion.div>
        
        {/* Categories Section */}
        <motion.div className="space-y-1" variants={itemVariants}>
          <motion.button 
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-text-primary hover:text-primary rounded-md bg-primary-bg/30 hover:bg-primary-bg/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <span>Categories</span>
            <motion.div
              animate={{ rotate: openSection === 'categories' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {openSection === 'categories' && (
              <motion.div 
                className="ml-2 space-y-1 border-l border-border/50 pl-3 mt-1"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {categories.map((category, index) => (
                  <motion.div 
                    key={category.key}
                    variants={itemVariants}
                    custom={index}
                  >
                    <NavLink 
                      to={`/category/${category.key}`}
                      className={({ isActive }) => 
                        `flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium shadow-elevation-1' 
                            : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
                        }`
                      }
                    >
                      {category.icon && <span className="mr-2.5">{category.icon}</span>}
                      {category.label}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* User Section */}
        {user && (
          <motion.div className="space-y-1" variants={itemVariants}>
            <motion.button 
              onClick={() => toggleSection('user')}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-text-primary hover:text-primary rounded-md bg-primary-bg/30 hover:bg-primary-bg/50 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <span>Your Account</span>
              <motion.div
                animate={{ rotate: openSection === 'user' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {openSection === 'user' && (
                <motion.div 
                  className="ml-2 space-y-1 border-l border-border/50 pl-3 mt-1"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.div variants={itemVariants}>
                    <NavLink 
                      to="/profile"
                      className={({ isActive }) => 
                        `flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium shadow-elevation-1' 
                            : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
                        }`
                      }
                    >
                      <User size={18} className="mr-2.5" />
                      Profile
                    </NavLink>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <NavLink 
                      to="/saved"
                      className={({ isActive }) => 
                        `flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium shadow-elevation-1' 
                            : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
                        }`
                      }
                    >
                      <Bookmark size={18} className="mr-2.5" />
                      Saved Articles
                    </NavLink>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <NavLink 
                      to="/settings"
                      className={({ isActive }) => 
                        `flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium shadow-elevation-1' 
                            : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
                        }`
                      }
                    >
                      <Settings size={18} className="mr-2.5" />
                      Settings
                    </NavLink>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </nav>
      
      {/* Footer */}
      <motion.div 
        className="border-t border-border p-4 bg-primary-bg-dark"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center">
          <p className="text-xs text-text-secondary">© {new Date().getFullYear()} Newspaper.AI</p>
        </div>
      </motion.div>
    </motion.aside>
  );
} 