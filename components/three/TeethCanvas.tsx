"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Referensi model: "Teeth" — Poly by Google (CC BY 3.0) via Poly Pizza.
// File berisi 28 gigi (Box001–Box031, Box026 tidak ada) + 2 mesh gusi
// (Box015, Box030) yang tidak ikut di-clone → hanya gigi yang tampil.
const GUM_NODES = new Set(["Box015", "Box030"]);
const ARCH_HEIGHT = 3.4; // tinggi set gigi setelah dinormalisasi
const HERO_HEIGHT = 1.35; // tinggi premolar di layar hero

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const easeOutBack = (v: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (v - 1) ** 3 + c1 * (v - 1) ** 2;
};

type ToothDatum = {
  wrapper: THREE.Group;
  seated: THREE.Vector3; // posisi slot asli (unit skala)
  scatter: THREE.Vector3; // posisi awal menyebar (unit skala)
  mat: THREE.MeshPhysicalMaterial;
  rank: number; // 0 = insisif tengah → naik ke molar
  isHero: boolean;
};

type SceneData = {
  root: THREE.Group;
  teeth: ToothDatum[];
  premolarScale: number;
  heroBaseY: number; // rotasi dasar premolar agar mahkota menghadap kamera
};

function prepareScene(scene: THREE.Group): SceneData {
  scene.updateMatrixWorld(true);

  type Raw = { node: THREE.Mesh; center: THREE.Vector3; size: THREE.Vector3 };
  const raws: Raw[] = [];
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && !GUM_NODES.has(m.name)) {
      const box = new THREE.Box3().setFromObject(m);
      raws.push({ node: m, center: box.getCenter(new THREE.Vector3()), size: box.getSize(new THREE.Vector3()) });
    }
  });

  const midY = raws.reduce((s, r) => s + r.center.y, 0) / raws.length;
  const centroid = (list: Raw[]) => {
    const c = new THREE.Vector3();
    list.forEach((r) => c.add(r.center));
    return c.divideScalar(Math.max(1, list.length));
  };
  const arch = {
    upper: centroid(raws.filter((r) => r.center.y > midY)),
    lower: centroid(raws.filter((r) => r.center.y <= midY)),
  };

  // rank: sudut terkecil dari depan lengkung = gigi depan
  const angleAbs = (r: Raw) => {
    const c = r.center.y > midY ? arch.upper : arch.lower;
    return Math.abs(Math.atan2(r.center.z - c.z, r.center.x - c.x));
  };
  const ranked = [...raws].sort((a, b) => angleAbs(a) - angleAbs(b));
  const rankByName = new Map(ranked.map((r, i) => [r.node.name, i] as const));
  const pickName = ranked[6]?.node.name ?? ranked[0]?.node.name ?? "Box001";

  const totalBox = new THREE.Box3();
  raws.forEach((r) => totalBox.expandByObject(r.node));
  const fullHeight = totalBox.getSize(new THREE.Vector3()).y;
  const S = ARCH_HEIGHT / fullHeight; // faktor skala mentah → unit dunia
  const fullCenter = totalBox.getCenter(new THREE.Vector3());

  // Bangun root sendiri: geometri dibake (pusat gigi di origin, diskala ke unit dunia)
  const root = new THREE.Group();
  const teeth: ToothDatum[] = [];
  for (const raw of raws) {
    const isHero = raw.node.name === pickName;
    const geom = raw.node.geometry.clone();
    geom.translate(-raw.center.x, -raw.center.y, -raw.center.z); // pusat gigi → origin
    geom.scale(S, S, S); // raw unit → unit dunia
    // Model low-poly punya verteks terbelah (shading datar). Gabungkan verteks
    // yang berhimpit lalu hitung ulang normal → permukaan enamel jadi halus.
    const smoothed = mergeVertices(geom, 1e-4);
    smoothed.computeVertexNormals();
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f7f2e6"),
      roughness: 0.18,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.25,
      specularIntensity: 1.2,
      envMapIntensity: 1.15,
      transparent: !isHero,
      opacity: isHero ? 1 : 0,
    });
    const mesh = new THREE.Mesh(smoothed, mat);
    mesh.position.set(0, 0, 0);
    const wrapper = new THREE.Group();
    wrapper.add(mesh);
    root.add(wrapper);

    const seated = raw.center.clone().sub(fullCenter).multiplyScalar(S); // relatif ke pusat set gigi
    const archC = raw.center.y > midY ? arch.upper : arch.lower;
    const outward = new THREE.Vector3(raw.center.x - archC.x, 0, raw.center.z - archC.z);
    if (outward.lengthSq() < 1e-6) outward.set(1, 0, 0);
    outward.normalize();
    const scatter = seated
      .clone()
      .addScaledVector(outward, 1.15)
      .add(new THREE.Vector3(0, raw.center.y > midY ? 1.0 : -1.0, 0));

    teeth.push({
      wrapper,
      seated,
      scatter,
      mat,
      rank: rankByName.get(raw.node.name) ?? 0,
      isHero,
    });

    // Variasi warna email antar gigi — sangat halus agar tidak tampak seragam buatan.
    mat.color.offsetHSL(0, 0, (teeth.length * 0.004) % 0.014);
  }

  const pmRaw = ranked[6] ?? ranked[0];
  const premolarScale = pmRaw ? HERO_HEIGHT / (pmRaw.size.y * S) : 1;

  // rotasi dasar: mahkota gigi menghadap keluar lengkung; +π supaya sisi mahkota (bukal) ke kamera
  const pmArchC = pmRaw ? (pmRaw.center.y > midY ? arch.upper : arch.lower) : new THREE.Vector3();
  const pmOut = pmRaw
    ? new THREE.Vector3(pmRaw.center.x - pmArchC.x, 0, pmRaw.center.z - pmArchC.z).normalize()
    : new THREE.Vector3(0, 0, 1);
  const heroBaseY = Math.atan2(pmOut.x, pmOut.z) + Math.PI;

  return { root, teeth, premolarScale, heroBaseY };
}

function TeethRig({
  progressRef,
  dragRef,
  reducedRef,
}: {
  progressRef: React.RefObject<number>;
  dragRef: React.RefObject<{ yaw: number; pitch: number }>;
  reducedRef: React.RefObject<boolean>;
}) {
  const { scene } = useGLTF("/models/teeth.glb");
  const rig = useRef<THREE.Group>(null);
  const heroRef = useRef<THREE.Group>(null);
  const data = useMemo<SceneData>(() => prepareScene(scene), [scene]);
  const camera = useThree((s) => s.camera);
  const heroPos = useMemo(() => new THREE.Vector3(0, 0.74, 0), []);

  useEffect(() => {
    useGLTF.preload("/models/teeth.glb");
  }, []);

  useFrame(({ clock }) => {
    if (!rig.current) return;
    const t = clock.getElapsedTime();
    const p = reducedRef.current ? 1 : progressRef.current || 0;
    const drag = dragRef.current || { yaw: 0, pitch: 0 };

    const tt = smooth(clamp01((p - 0.42) / 0.44)); // 0 = hero → 1 = set lengkap
    const zoom = (camera as THREE.PerspectiveCamera).aspect < 0.8 ? 1.35 : 1;

    const heroZ = 4.4 - Math.min(p, 0.42) * 0.5;
    const z = p < 0.42 ? heroZ : THREE.MathUtils.lerp(3.9, 13.2, tt) + (p > 0.86 ? ((p - 0.86) / 0.14) * 0.7 : 0);
    camera.position.set(0, THREE.MathUtils.lerp(0.3, 1.15, tt), z * zoom);
    camera.lookAt(0, THREE.MathUtils.lerp(0.5, 0.1, tt), 0);

    // assemblage: arah depan model ≈ azimut 120° → diputar agar smile menghadap kamera
    rig.current.rotation.y = -2.1 + Math.sin(t * 0.3) * 0.08 + drag.yaw * 0.55;
    rig.current.position.y = Math.sin(t * 0.7) * 0.045 + 0.45 * tt;

    // gigi premolar hero: kanan-tengah di desktop, tengah-bawah di mobile.
    // Offset layar dikonversi ke koordinat lokal rig (rig dirotasi ±2.1 rad).
    const isWide = (camera as THREE.PerspectiveCamera).aspect > 1.05;
    const wx = isWide ? 1.25 : 0;
    const rigRot = rig.current.rotation.y;
    heroPos.set(wx * Math.cos(rigRot), isWide ? 0.3 : 0.74, wx * Math.sin(rigRot));

    const hero = heroRef.current;
    const float = new THREE.Vector3(); // vektor bantu, dipakai ulang per gigi
    for (const tooth of data.teeth) {
      const show = p > 0.28 || tooth.isHero;
      tooth.wrapper.visible = show;
      if (tooth.isHero && hero) {
        // premolar hero: berputar & mengambang di depan, lalu pulang ke slotnya.
        // Rotasi di-lerp ke 0 (identitas) sehingga mendarat persis dengan orientasi
        // gigi-gigi lain di lengkung; idle-float ikut masuk seiring pendaratan.
        hero.position
          .lerpVectors(heroPos, tooth.seated, tt)
          .add(
            float
              .set(
                Math.sin(t * 1.1 + tooth.rank * 0.9) * 0.014,
                Math.sin(t * 1.4 + tooth.rank * 0.7 + 1.3) * 0.02,
                Math.cos(t * 0.9 + tooth.rank * 0.6) * 0.014,
              )
              .multiplyScalar(tt),
          );
        hero.scale.setScalar(THREE.MathUtils.lerp(data.premolarScale, 1, tt));
        hero.rotation.y =
          (data.heroBaseY + 0.65) * (1 - tt) +
          (t * 0.55 + Math.sin(t * 0.5) * 0.05) * (1 - tt);
        hero.rotation.z = -0.07 * (1 - tt);
        hero.rotation.x = -0.28 * (1 - tt) + drag.pitch * (1 - tt);
        continue;
      }
      const delay = 0.05 + (tooth.rank / 13) * 0.26;
      const e = easeOutBack(clamp01((tt - delay) / 0.42));
      tooth.wrapper.position
        .lerpVectors(tooth.scatter, tooth.seated, e)
        .add(
          float
            .set(
              Math.sin(t * 1.1 + tooth.rank * 0.9) * 0.014,
              Math.sin(t * 1.4 + tooth.rank * 0.7 + 1.3) * 0.02,
              Math.cos(t * 0.9 + tooth.rank * 0.6) * 0.014,
            )
            .multiplyScalar(e),
        );
      tooth.wrapper.rotation.z = (1 - e) * Math.sin(tooth.rank * 2.7) * 0.3;
      const op = clamp01(e * 1.6);
      tooth.mat.opacity = op;
      tooth.mat.transparent = op < 1;
      tooth.mat.depthWrite = op > 0.5;
    }
  });

  // temukan wrapper hero setelah mount
  useEffect(() => {
    const hero = data.teeth.find((t) => t.isHero);
    if (hero) heroRef.current = hero.wrapper;
  }, [data]);

  return (
    <group ref={rig}>
      <primitive object={data.root} />
    </group>
  );
}

export default function TeethCanvas({
  progressRef,
  dragRef,
  reducedRef,
}: {
  progressRef: React.RefObject<number>;
  dragRef: React.RefObject<{ yaw: number; pitch: number }>;
  reducedRef: React.RefObject<boolean>;
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ fov: 34, position: [0, 0.3, 4.4], near: 0.1, far: 80 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.5, 4, 3.5]} intensity={2.7} />
      <directionalLight position={[-4.5, 1, 2.5]} intensity={1.8} color="#a8ecdc" />
      <directionalLight position={[0, -3, 2]} intensity={0.4} color="#eef4fb" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.6} position={[0, 3, 2]} scale={[6, 4, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-4, 1, -2]} scale={[4, 3, 1]} color="#d6f7ef" />
        <Lightformer intensity={0.7} position={[4, -1, 1]} scale={[3, 2, 1]} color="#eef6ff" />
        <Lightformer intensity={0.5} position={[-2, -2, -3]} scale={[3, 2, 1]} color="#ffe9c4" />
      </Environment>
      <Suspense fallback={null}>
        <TeethRig progressRef={progressRef} dragRef={dragRef} reducedRef={reducedRef} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/teeth.glb");
