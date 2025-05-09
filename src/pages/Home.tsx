import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, UserPlus, Globe, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary">Newspaper</span>
            <span className="text-secondary">.AI</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stay informed with AI-powered news summaries personalized for you.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/feed" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg inline-flex items-center gap-2 text-lg font-medium"
            >
              <Newspaper className="w-5 h-5" />
              Browse News
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
            
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all shadow-lg inline-flex items-center gap-2 text-lg font-medium"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Browse news without an account, or sign up for personalized recommendations.
          </motion.p>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Experience News <span className="text-primary">Reimagined</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Summaries</h3>
              <p className="text-muted-foreground">Get concise AI-powered summaries of every article, saving you time and keeping you informed.</p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="h-12 w-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Impact</h3>
              <p className="text-muted-foreground">Understand how each news story might affect you personally based on your location and interests.</p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl border border-border bg-card shadow-sm"
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Relevance</h3>
              <p className="text-muted-foreground">Discover news that matters to your community and location, beyond just national headlines.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Join thousands of readers who get their news summarized by AI.
          </p>
          <Link 
            to="/feed" 
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg inline-flex items-center gap-2 text-lg font-medium"
          >
            Browse News Now
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Newspaper.AI • Powered by AI technology and multiple news sources
          </p>
        </div>
      </footer>
    </div>
  );
} 