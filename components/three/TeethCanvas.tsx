"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type TeethCanvasProps = {
  reducedMotion: boolean;
  progress?: number;
  autoRotate?: boolean;
  active?: boolean;
  onReady?: () => void;
  onLoadProgress?: (value: number) => void;
  onError?: () => void;
  label?: string;
};

type ModelPart = {
  name: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  matrix: THREE.Matrix4;
};
type FitBounds = { horizontalRadius: number; halfHeight: number };
const DEFAULT_HERO_SLOT = "tooth_U_M1_R";
const REST_YAW = -0.14;
const START_ROTATION = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0.12, -0.07));

function capturePart(mesh: THREE.Mesh): ModelPart {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  mesh.matrixWorld.decompose(position, quaternion, scale);
  const cloneMaterial = (source: THREE.Material) => {
    if (!(source instanceof THREE.MeshStandardMaterial)) return source.clone();
    if (source.name === "enamel_ivory") {
      const material = new THREE.MeshPhysicalMaterial({
        color: source.color.clone(), map: source.map, normalMap: source.normalMap, normalScale: source.normalScale.clone(),
        roughness: 0.21, roughnessMap: source.roughnessMap, metalness: 0,
        vertexColors: source.vertexColors, side: source.side,
        ior: 1.52, clearcoat: 0.4, clearcoatRoughness: 0.13, specularIntensity: 0.9, envMapIntensity: 0.7,
      });
      material.name = source.name;
      material.customProgramCacheKey = () => "dava-ivory-enamel-v1";
      return material;
    }
    const material = source.clone();
    if (source.name === "root_dentin") {
      material.roughness = 0.64;
      material.envMapIntensity = 0.4;
      material.onBeforeCompile = (shader) => {
        shader.vertexShader = `varying vec3 vDentinPosition;\n${shader.vertexShader}`.replace("#include <begin_vertex>", "#include <begin_vertex>\nvDentinPosition = position;");
        shader.fragmentShader = `
          varying vec3 vDentinPosition;
          float dentinHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
          float dentinNoise(vec3 p) {
            vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(dentinHash(i), dentinHash(i+vec3(1,0,0)), f.x), mix(dentinHash(i+vec3(0,1,0)), dentinHash(i+vec3(1,1,0)), f.x), f.y), mix(mix(dentinHash(i+vec3(0,0,1)), dentinHash(i+vec3(1,0,1)), f.x), mix(dentinHash(i+vec3(0,1,1)), dentinHash(i+vec3(1,1,1)), f.x), f.y), f.z);
          }
          ${shader.fragmentShader}`
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nfloat dentinGrain = dentinNoise(vDentinPosition * vec3(240.0, 180.0, 240.0));\nroughnessFactor = clamp(roughnessFactor + (dentinGrain - 0.5) * 0.025, 0.5, 0.8);")
          .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
            float dentinFibres = dentinNoise(vDentinPosition * vec3(280.0, 24.0, 280.0));
            float dentinHeight = (dentinGrain - 0.5) * 0.00007 + (dentinFibres - 0.5) * 0.00004;
            vec3 dentinDx = dFdx(-vViewPosition), dentinDy = dFdy(-vViewPosition);
            vec3 dentinR1 = cross(dentinDy, normal), dentinR2 = cross(normal, dentinDx);
            float dentinDet = dot(dentinDx, dentinR1);
            vec3 dentinGradient = sign(dentinDet) * (dFdx(dentinHeight) * dentinR1 + dFdy(dentinHeight) * dentinR2);
            normal = normalize(max(abs(dentinDet), 0.00000001) * normal - dentinGradient);
          `);
      };
      material.customProgramCacheKey = () => "dava-fine-dentin-v2";
    }
    return material;
  };
  return {
    name: mesh.name,
    geometry: mesh.geometry,
    material: Array.isArray(mesh.material) ? mesh.material.map(cloneMaterial) : cloneMaterial(mesh.material),
    position, quaternion, scale, matrix: mesh.matrixWorld.clone(),
  };
}

function partBounds(parts: ModelPart[]) {
  const bounds = new THREE.Box3();
  parts.forEach((part) => {
    if (!part.geometry.boundingBox) part.geometry.computeBoundingBox();
    bounds.union(part.geometry.boundingBox!.clone().applyMatrix4(part.matrix));
  });
  return bounds;
}

function fitBounds(parts: ModelPart[], transform: THREE.Matrix4): FitBounds {
  let horizontalRadius = 0;
  let halfHeight = 0;
  const vertex = new THREE.Vector3();
  parts.forEach((part) => {
    const positions = part.geometry.getAttribute("position");
    const matrix = transform.clone().multiply(part.matrix);
    for (let index = 0; index < positions.count; index++) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(matrix);
      horizontalRadius = Math.max(horizontalRadius, Math.hypot(vertex.x, vertex.z));
      halfHeight = Math.max(halfHeight, Math.abs(vertex.y));
    }
  });
  return { horizontalRadius, halfHeight };
}

/** Preserve the new model's compact crowns, closed gingiva, normals and authored materials. */
function prepareModel(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  const parts: ModelPart[] = [];
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) parts.push(capturePart(object as THREE.Mesh));
  });
  const mouth = parts.filter(({ name }) => name.startsWith("tooth_") || name === "gum_upper" || name === "gum_lower");
  const crown = parts.find(({ name }) => name === "hero_molar_crown");
  const roots = parts.find(({ name }) => name === "hero_molar_roots");
  const heroMetadata = scene.getObjectByName("hero_molar")?.userData ?? {};
  const slotName = typeof heroMetadata.slot === "string" ? heroMetadata.slot : DEFAULT_HERO_SLOT;
  const crownRotationX = typeof heroMetadata.crownRotationX === "number" ? heroMetadata.crownRotationX : Math.PI;
  const slot = mouth.find(({ name }) => name === slotName);
  if (mouth.filter(({ name }) => name.startsWith("tooth_")).length !== 28 || !crown || !roots || !slot) throw new Error("The visual asset is incomplete.");

  const center = partBounds(mouth).getCenter(new THREE.Vector3());
  const recenter = new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z);
  const heroBounds = partBounds([crown, roots]);
  const heroCenter = heroBounds.getCenter(new THREE.Vector3());
  const heroSize = heroBounds.getSize(new THREE.Vector3());
  const heroScale = 3.6 / Math.max(heroSize.x, heroSize.y, heroSize.z);
  const startPosition = heroCenter.clone().applyQuaternion(START_ROTATION).multiplyScalar(-heroScale);
  const startMatrix = new THREE.Matrix4().compose(startPosition, START_ROTATION, new THREE.Vector3(heroScale, heroScale, heroScale));

  // New video-matched lower molar is upright; older authored assets declare the upper Rx(PI) crown.
  const destination = recenter.clone().multiply(slot.matrix).multiply(new THREE.Matrix4().makeRotationX(-crownRotationX));
  const endPosition = new THREE.Vector3();
  const endRotation = new THREE.Quaternion();
  const endScale = new THREE.Vector3();
  destination.decompose(endPosition, endRotation, endScale);
  if (!roots.geometry.boundingBox) roots.geometry.computeBoundingBox();
  const rootAttachmentY = roots.geometry.boundingBox!.max.y;

  return {
    parts, mouth, crown, roots, center, slotName, heroScale, startPosition, endPosition, endRotation, endScale, rootAttachmentY,
    heroFit: fitBounds([crown, roots], startMatrix),
    mouthFit: fitBounds(mouth, recenter),
  };
}

function setReveal(material: THREE.Material | THREE.Material[], amount: number) {
  (Array.isArray(material) ? material : [material]).forEach((item) => {
    const transparent = amount < 0.999;
    if (item.transparent !== transparent) { item.transparent = transparent; item.needsUpdate = true; }
    item.opacity = amount;
    item.depthWrite = amount > 0.75;
  });
}

function Part({ part }: { part: ModelPart }) {
  return <mesh geometry={part.geometry} material={part.material} position={part.position} quaternion={part.quaternion} scale={part.scale} />;
}

function DentalModel({ progress = 0, onReady, idle, reducedMotion }: Pick<TeethCanvasProps, "progress" | "onReady" | "reducedMotion"> & { idle: boolean }) {
  const { scene } = useGLTF("/models/dava-dentition.glb");
  const model = useMemo(() => prepareModel(scene), [scene]);
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const reportedReady = useRef(false);
  const assembly = THREE.MathUtils.smoothstep(progress, 0.12, 0.78);
  const reveal = THREE.MathUtils.smoothstep(progress, 0.28, 0.8);
  const absorb = THREE.MathUtils.smoothstep(progress, 0.38, 0.72);
  const position = model.startPosition.clone().lerp(model.endPosition, assembly);
  position.y += Math.sin(assembly * Math.PI) * 0.2;
  const quaternion = START_ROTATION.clone().slerp(model.endRotation, assembly);
  const scale = new THREE.Vector3(model.heroScale, model.heroScale, model.heroScale).lerp(model.endScale, assembly);

  useEffect(() => {
    model.mouth.forEach((part) => setReveal(part.material, reveal));
    setReveal(model.roots.material, 1 - THREE.MathUtils.smoothstep(absorb, 0.45, 1));
  }, [absorb, model, reveal]);

  useFrame((_, delta) => {
    if (!reportedReady.current) {
      reportedReady.current = true;
      requestAnimationFrame(() => onReady?.());
    }
    if (!idle || !group.current) return;
    elapsed.current += delta;
    group.current.rotation.y = REST_YAW + elapsed.current * 0.19;
  });

  useEffect(() => {
    if (progress >= 0.1 && progress <= 0.88) {
      elapsed.current = 0;
      if (group.current) group.current.rotation.y = REST_YAW;
    }
  }, [progress]);

  useEffect(() => () => model.parts.forEach(({ material }) => (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose())), [model]);

  return <>
    <group ref={group} rotation={[0.035, REST_YAW, 0]}>
      <group position={model.center.clone().negate()} visible={reveal > 0.001}>
        {model.mouth.filter(({ name }) => name !== model.slotName).map((part) => <Part key={part.name} part={part} />)}
      </group>
      <group position={position} quaternion={quaternion} scale={scale}>
        <Part part={model.crown} />
        <group position={[0, model.rootAttachmentY, 0]} scale={[1 - absorb * 0.3, Math.max(0.001, 1 - absorb), 1 - absorb * 0.3]} visible={absorb < 0.999}>
          <group position={[0, -model.rootAttachmentY, 0]}><Part part={model.roots} /></group>
        </group>
      </group>
    </group>
    <ViewControls reducedMotion={reducedMotion} progress={progress} heroBounds={model.heroFit} mouthBounds={model.mouthFit} />
  </>;
}

function ViewControls({ reducedMotion, progress, heroBounds, mouthBounds }: { reducedMotion: boolean; progress: number; heroBounds: FitBounds; mouthBounds: FitBounds }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const assembling = useRef(false);
  const { camera, gl, invalidate, size } = useThree();
  const assembly = THREE.MathUtils.smoothstep(progress, 0.12, 0.78);
  const aspect = Math.max(0.1, size.width / Math.max(1, size.height));
  const tangent = Math.tan(THREE.MathUtils.degToRad(17));
  const distanceFor = ({ horizontalRadius, halfHeight }: FitBounds) => {
    const radius = horizontalRadius + halfHeight * 0.035;
    const height = halfHeight + horizontalRadius * 0.035;
    // Fit the rotating silhouette to the horizontal frustum without excessive portrait whitespace.
    const horizontalDistance = Math.hypot(radius, radius / (tangent * aspect));
    return Math.max(height / tangent + radius, horizontalDistance) * 1.06;
  };
  const distance = THREE.MathUtils.lerp(distanceFor(heroBounds), distanceFor(mouthBounds), assembly);

  useEffect(() => { gl.domElement.style.touchAction = "pan-y"; }, [gl]);
  useEffect(() => {
    const target = controls.current?.target ?? new THREE.Vector3();
    camera.position.sub(target).setLength(distance).add(target);
    controls.current?.update();
    invalidate();
  }, [camera, distance, invalidate]);
  useEffect(() => {
    if (progress > 0.1 && !assembling.current) {
      camera.position.set(0, 0.1, distance);
      controls.current?.target.set(0, 0, 0);
      controls.current?.update();
      invalidate();
    }
    assembling.current = progress > 0.1;
  }, [camera, distance, invalidate, progress]);

  return <OrbitControls ref={controls} enabled={progress < 0.1 || progress > 0.88} enablePan={false} enableZoom={false} enableDamping={!reducedMotion} dampingFactor={0.09} minPolarAngle={Math.PI * 0.3} maxPolarAngle={Math.PI * 0.7} />;
}

function LoadingProgress({ onProgress }: { onProgress?: (value: number) => void }) {
  const { progress, total } = useProgress();
  useEffect(() => { if (total > 0) onProgress?.(progress); }, [onProgress, progress, total]);
  return null;
}

export default function TeethCanvas({ reducedMotion, progress = 0, autoRotate = true, active = true, onReady, onLoadProgress, onError, label = "3D visual" }: TeethCanvasProps) {
  return <Canvas
    dpr={[1, 1.6]}
    frameloop={active && autoRotate && !reducedMotion ? "always" : "demand"}
    camera={{ fov: 34, position: [0, 0.1, 9], near: 0.1, far: 60 }}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 0.98;
      gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); onError?.(); }, { once: true });
    }}
    className="cursor-grab active:cursor-grabbing"
    style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
    aria-label={label}
  >
    <ambientLight intensity={0.42} />
    <directionalLight position={[3.5, 4.5, 5]} intensity={2.5} color="#fff8ee" />
    <directionalLight position={[-4, 1, 3]} intensity={0.65} color="#edf0f5" />
    <directionalLight position={[1, 3, -4]} intensity={1.8} color="#fff9ed" />
    <Environment resolution={64} frames={1}>
      <Lightformer intensity={1.8} position={[-3, 4, 4]} scale={[2, 5, 1]} color="#fffaf4" />
      <Lightformer intensity={0.9} position={[4, 1, -3]} scale={[1.5, 4, 1]} color="#f1f3f7" />
    </Environment>
    <LoadingProgress onProgress={onLoadProgress} />
    <Suspense fallback={null}><DentalModel progress={progress} onReady={onReady} reducedMotion={reducedMotion} idle={autoRotate && !reducedMotion && active} /></Suspense>
  </Canvas>;
}
