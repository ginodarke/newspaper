import { Link } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { NewspaperModel, AnimatedBackground } from '../components/3DElements';
// import { motion } from 'framer-motion';

// Separate component for 3D background elements properly wrapped in Canvas
// function HomeBackground() {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full -z-10">
//       <Canvas>
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//         <NewspaperModel position={[0, 0, -1]} scale={1} />
//         <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
//       </Canvas>
//     </div>
//   );
// }

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900">
      {/* Simplified content */}
      <div className="max-w-4xl p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Newspaper<span className="text-blue-800 dark:text-blue-200">.AI</span>
        </h1>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Personalized news summaries powered by AI. Get the news that matters to you,
          summarized in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/auth" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            Get Started
          </Link>
          
          <Link 
            to="/feed" 
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all shadow-lg"
          >
            Browse News
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        No account needed to browse. Sign up for personalized recommendations.
      </div>
    </div>
  );
} 