'use client';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated torus knot that follows mouse
function TorusKnot({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = mouseRef.current;

    // Smooth rotation follows mouse
    meshRef.current.rotation.x += (y * 0.5 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (x * 0.5 - meshRef.current.rotation.y) * 0.05;

    // Continuous base rotation
    meshRef.current.rotation.z += 0.003;

    // Subtle scale pulse
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.35, 200, 16, 2, 3]} />
        <MeshDistortMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.1}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Orbiting satellite spheres
function OrbitingSpheres() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  const spheres = [
    { radius: 2.8, phase: 0,              color: '#06B6D4', size: 0.18 },
    { radius: 2.8, phase: Math.PI * 0.66, color: '#F59E0B', size: 0.14 },
    { radius: 2.8, phase: Math.PI * 1.33, color: '#EC4899', size: 0.16 },
    { radius: 3.5, phase: Math.PI * 0.25, color: '#7C3AED', size: 0.12 },
    { radius: 3.5, phase: Math.PI * 1.0,  color: '#06B6D4', size: 0.10 },
  ];

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(s.phase) * s.radius,
            Math.sin(s.phase * 0.7) * 0.8,
            Math.sin(s.phase) * s.radius,
          ]}
        >
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Wireframe icosahedron
function WireframeIcosahedron({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + mouseRef.current.x * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshStandardMaterial
        color="#06B6D4"
        wireframe
        opacity={0.15}
        transparent
        emissive="#06B6D4"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Scene({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <Stars radius={60} depth={30} count={800} factor={3} saturation={0} fade speed={1} />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#7C3AED" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#06B6D4" />
      <pointLight position={[0, 5, -5]} intensity={1} color="#F59E0B" />

      <WireframeIcosahedron mouseRef={mouseRef} />
      <TorusKnot mouseRef={mouseRef} />
      <OrbitingSpheres />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

export default function Scene3D() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div>
      <p style={{ color: '#64748b', fontFamily: 'Space Mono, monospace', fontSize: 13, marginBottom: 24 }}>
        Move your mouse over the canvas — the geometry tracks it in 3D space.
      </p>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 500,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(124,58,237,0.2)',
          background: 'radial-gradient(ellipse at center, #0d0d24 0%, #050510 100%)',
          boxShadow: '0 0 60px rgba(124,58,237,0.1)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene mouseRef={mouseRef} />
        </Canvas>
      </div>

      {/* Controls hint */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {[
          { key: 'Mouse move', desc: 'Rotate geometry' },
          { key: 'Click + drag', desc: 'Orbit camera' },
        ].map(hint => (
          <div key={hint.key} style={{
            flex: 1,
            padding: 12,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 10,
          }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#7C3AED', marginBottom: 4 }}>{hint.key}</div>
            <div style={{ color: '#475569', fontSize: 13 }}>{hint.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{
        marginTop: 24,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
      }}>
        <p style={{ color: '#475569', fontFamily: 'Space Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Stack
        </p>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
          <code style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: 4 }}>@react-three/fiber</code> mounts Three.js into React's render loop.
          {' '}<code style={{ color: '#22d3ee', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: 4 }}>useFrame</code> hooks give per-frame control.
          {' '}<code style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>MeshDistortMaterial</code> from drei adds vertex shader distortion.
          Mouse position is tracked on the container element and passed via ref to avoid React re-renders.
        </p>
      </div>
    </div>
  );
}
