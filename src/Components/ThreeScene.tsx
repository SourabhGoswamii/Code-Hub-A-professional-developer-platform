"use client";

import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas className="h-[800px]">
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 2, 2]} intensity={0.8} />
      <mesh scale={1.5}>
        <Sphere args={[1.6, 100, 100]}>
          <MeshDistortMaterial
            color="#94a3b8"
            attach="material"
            distort={0.3}
            speed={1}
            roughness={0.4}
            metalness={0.8}
          />
        </Sphere>
      </mesh>
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.3}
        enablePan={false}
      />
    </Canvas>
  );
}