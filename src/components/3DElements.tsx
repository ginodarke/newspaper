import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Environment, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Animated 3D newspaper model
export function NewspaperModel({ 
  position = [0, 0, 0], 
  scale = 0.5 
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  
  // This would load an actual model in production
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1, 1.4, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.1}
        color="#000000"
        maxWidth={0.9}
        textAlign="center"
      >
        Newspaper.AI
      </Text>
    </group>
  );
}

// Floating text with animation
export function FloatingText({ 
  text, 
  position = [0, 0, 0], 
  color = "#000000", 
  fontSize = 0.1 
}: {
  text: string;
  position?: [number, number, number];
  color?: string;
  fontSize?: number;
}) {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group ref={textRef} position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

// A complete 3D scene with lighting, controls, etc.
export function NewspaperScene({ 
  children 
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="city" />
      {children}
    </Canvas>
  );
}

// A globe component with customizable size
export function NewsGlobe({ 
  size = "medium", 
  position = [0, 0, 0] 
}: {
  size?: "small" | "medium" | "large" | number;
  position?: [number, number, number];
}) {
  // Update the path to look for the image in the public directory
  const earthTexture = useTexture('/earth.jpg');
  const globeRef = useRef<THREE.Mesh>(null);
  
  // Convert string sizes to numeric values
  const getSizeValue = (size: "small" | "medium" | "large" | number): number => {
    if (typeof size === 'number') return size;
    
    const sizeMap = {
      small: 1,
      medium: 1.5,
      large: 2
    };
    
    return sizeMap[size];
  };
  
  const numericSize = getSizeValue(size);
  
  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Add error handling for texture loading
  if (!earthTexture) {
    return (
      <Sphere ref={globeRef} args={[numericSize, 32, 32]} position={position}>
        <meshStandardMaterial color="#1e40af" />
      </Sphere>
    );
  }

  return (
    <Sphere ref={globeRef} args={[numericSize, 32, 32]} position={position}>
      <meshStandardMaterial map={earthTexture} />
    </Sphere>
  );
}

// Animated background with particles
export function AnimatedBackground() {
  return (
    <Canvas>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 20]} />
      <ParticleField />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

// A field of particles that rotate
function ParticleField() {
  const { viewport } = useThree();
  const [particles] = useState(() => {
    const temp = [];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * 10;
      
      temp.push({ position: [x, y, z] });
    }
    
    return temp;
  });
  
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
} 