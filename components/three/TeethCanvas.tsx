"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const HERO_NAME = "tooth_U_M1_R";

function createHeroGeometry(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  const pieces: THREE.BufferGeometry[] = [];

  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const toothName = mesh.name.startsWith("tooth_")
      ? mesh.name
      : mesh.parent?.name.startsWith("tooth_")
        ? mesh.parent.name
        : mesh.name;
    if (toothName !== HERO_NAME) return;

    const geometry = mesh.geometry.clone();
    geometry.applyMatrix4(mesh.matrixWorld);
    pieces.push(geometry);
  });

  if (pieces.length === 0) return null;

  const merged = pieces.length === 1 ? pieces[0] : mergeGeometries(pieces, false);
  pieces.forEach((geometry) => {
    if (geometry !== merged) geometry.dispose();
  });
  if (!merged) return null;

  const smoothGeometry = mergeVertices(merged, 1e-4);
  if (smoothGeometry !== merged) merged.dispose();
  smoothGeometry.computeVertexNormals();
  smoothGeometry.computeBoundingBox();

  const bounds = smoothGeometry.boundingBox;
  if (!bounds) return smoothGeometry;
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 2.35 / Math.max(size.x, size.y, size.z);
  smoothGeometry.translate(-center.x, -center.y, -center.z);
  smoothGeometry.scale(scale, scale, scale);
  smoothGeometry.computeBoundingSphere();
  return smoothGeometry;
}

function HeroTooth({ reducedMotion, compact }: { reducedMotion: boolean; compact: boolean }) {
  const { scene } = useGLTF("/models/teeth-real.glb");
  const geometry = useMemo(() => createHeroGeometry(scene), [scene]);

  if (!geometry) return null;

  return (
    <Float
      speed={reducedMotion ? 0 : 1.15}
      rotationIntensity={reducedMotion ? 0 : 0.11}
      floatIntensity={reducedMotion ? 0 : 0.12}
    >
      <group
        position={[0, compact ? 0.58 : 0, 0]}
        scale={compact ? 0.62 : 1}
        rotation={[Math.PI + 0.4, 0.62, -0.06]}
      >
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#fffaf2"
            roughness={0.2}
            metalness={0}
            clearcoat={0.95}
            clearcoatRoughness={0.18}
            specularIntensity={1.15}
            envMapIntensity={1.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function TeethCanvas({ reducedMotion, compact }: { reducedMotion: boolean; compact: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ fov: 33, position: [0, 0, 4.9], near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
      className="cursor-grab active:cursor-grabbing"
      style={{ position: "absolute", inset: 0, touchAction: "none" }}
      aria-label="Render gigi geraham 3D"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4.5, 4]} intensity={3.1} color="#ffffff" />
      <directionalLight position={[-3.5, 1.5, 2]} intensity={2.1} color="#c7a5ff" />
      <directionalLight position={[0, -3, 1]} intensity={0.75} color="#f3eaff" />
      <pointLight position={[2, 0, -2]} intensity={18} distance={8} color="#8b5cf6" />

      <Environment resolution={96}>
        <Lightformer intensity={2.6} position={[0, 3, 2]} scale={[5, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.6} position={[-3, 1, -2]} scale={[4, 3, 1]} color="#c8a8ff" />
        <Lightformer intensity={0.75} position={[3, -2, 1]} scale={[3, 2, 1]} color="#f2eaff" />
      </Environment>

      <Suspense fallback={null}>
        <HeroTooth reducedMotion={reducedMotion} compact={compact} />
      </Suspense>
      <OrbitControls
        enablePan
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2 - 0.45}
        maxPolarAngle={Math.PI / 2 + 0.45}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.55}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/teeth-real.glb");
