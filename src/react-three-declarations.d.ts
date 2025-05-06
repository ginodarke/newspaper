declare module '@react-three/fiber' {
  import * as THREE from 'three';
  import * as React from 'react';
  
  export function useFrame(callback: (state: any) => void): void;
  export function useThree(): { viewport: any };
  
  export const Canvas: React.FC<{
    shadows?: boolean;
    camera?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }>;
  
  export interface ExtendedColors<T> extends T {}
  export interface NodeProps<T, U> extends T {}
  export interface Overwrite<T, U> extends T {}
}

declare module '@react-three/drei' {
  import * as React from 'react';
  
  export function OrbitControls(props: any): JSX.Element;
  export function PerspectiveCamera(props: any): JSX.Element;
  export function Text(props: any): JSX.Element;
  export function Environment(props: any): JSX.Element;
  export function Sphere(props: any): JSX.Element;
  export function useTexture(url: string): any;
}

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    boxGeometry: any;
    meshStandardMaterial: any;
    pointsMaterial: any;
    bufferGeometry: any;
    bufferAttribute: any;
    ambientLight: any;
    spotLight: any;
    points: any;
    color: any;
    fog: any;
  }
} 