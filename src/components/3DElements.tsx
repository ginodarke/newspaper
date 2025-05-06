import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function NewspaperModel(props: any) {
  const { nodes, materials } = useGLTF("/newspaper.glb") as any;
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  // Fallback to a simple cube if model isn't loaded
  if (!nodes) {
    return (
      <mesh {...props} castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    );
  }

  return (
    <group ref={group} {...props} dispose={null}>
      {/* This would use the actual newspaper model when available */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function NewspaperScene() {
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NewspaperModel position={[0, 0, 0]} scale={[1, 1, 1]} />
        </Float>
        <ContactShadows position={[0, -1.5, 0]} scale={5} blur={2.5} opacity={0.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export function NewsGlobe({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const dimensions = {
    small: { width: "w-32 h-32", containerClass: "w-32 h-32" },
    medium: { width: "w-48 h-48", containerClass: "w-48 h-48" },
    large: { width: "w-64 h-64", containerClass: "w-64 h-64" }
  };

  return (
    <div className={`${dimensions[size].containerClass} relative`}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
          <mesh castShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#1e40af" metalness={0.1} roughness={0.8} />
            <mesh position={[0, 0, 1.01]} scale={0.2}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </mesh>
        </Float>
        <ContactShadows position={[0, -1.5, 0]} scale={5} blur={2.5} opacity={0.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-10">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    setPositions(positions);
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.075;
    }
  });
  
  if (!positions) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#3b82f6" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
} 