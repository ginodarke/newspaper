import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NewspaperModel, AnimatedBackground } from '../components/3DElements';
import { motion } from 'framer-motion';

// Separate component for 3D background elements properly wrapped in Canvas
function HomeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <NewspaperModel position={[0, 0, -1]} scale={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-to-b from-blue-600 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white">
      {/* Add the 3D background properly contained in Canvas */}
      <HomeBackground />
      <AnimatedBackground />
      
      <motion.div 
        className="max-w-4xl p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Newspaper<span className="text-blue-300">.AI</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto text-blue-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Personalized news summaries powered by AI. Get the news that matters to you,
          summarized in seconds.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link 
            to="/auth" 
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
          >
            Get Started
          </Link>
          
          <Link 
            to="/feed" 
            className="px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
          >
            Browse News
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-16 text-sm text-blue-200 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        No account needed to browse. Sign up for personalized recommendations.
      </motion.div>
    </div>
  );
} 