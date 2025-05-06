import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NewspaperModel, AnimatedBackground } from '../components/3DElements';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {/* Add the 3D background properly contained in Canvas */}
      <HomeBackground />
      <AnimatedBackground />
      
      <h1 className="text-4xl font-bold mb-6">Newspaper.AI</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Personalized news summaries powered by AI. Get the news that matters to you,
        summarized in seconds.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/auth" 
          className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
} 