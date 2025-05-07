import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NewspaperModel } from '../components/3DElements';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Separate component for 3D elements to ensure they're inside a Canvas
function AuthBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <NewspaperModel position={[2, 0, 0]} scale={1.5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = useAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await auth.signIn(email, password);
        if (error) throw error;
        navigate('/feed');
      } else {
        const { error } = await auth.signUp(email, password);
        if (error) throw error;
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };
  
  // Container animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // Item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background with 3D elements */}
      <AuthBackground />
      
      <motion.div 
        className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Sign in to access your personalized news feed' 
              : 'Sign up to get started with personalized news'
            }
          </p>
        </motion.div>
        
        {error && (
          <motion.div
            className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}
        
        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          variants={itemVariants}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>{isLogin ? 'Sign In' : 'Sign Up'}</>
            )}
          </motion.button>
          
          <motion.div className="text-center mt-4" variants={itemVariants}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
      
      <motion.p 
        className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        By using Newspaper.AI, you agree to our Terms of Service and Privacy Policy.
      </motion.p>
    </div>
  );
} 