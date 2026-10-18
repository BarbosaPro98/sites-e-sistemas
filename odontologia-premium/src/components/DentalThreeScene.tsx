"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export type SceneState = { scroll: number; kick: number };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Procedural molar: a deformed sphere (crown with four cusps and a central
 *  fissure, cervical constriction, two tapering roots). No external model. */
function useToothGeometry(segments: number) {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, segments, segments);
    const p = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const r = Math.hypot(v.x, v.z);
      const phi = Math.atan2(v.z, v.x);
      let nx: number, ny: number, nz: number;
      if (v.y >= 0) {
        const y = v.y;
        const top = smooth(0.5, 1, y);
        const cusp = 0.5 + 0.5 * Math.cos(4 * phi + Math.PI / 4);
        const radial = r * (0.82 + 0.18 * smooth(0, 0.28, y)) * (1 + 0.035 * cusp * top);
        nx = Math.cos(phi) * radial;
        nz = Math.sin(phi) * radial * 0.9;
        ny = 1.02 * Math.pow(y, 0.6);
        ny += 0.2 * cusp * top * smooth(0.12, 0.55, r);
        ny -= 0.13 * Math.exp(-(r * r) / 0.035) * top;
      } else {
        const s = -v.y;
        const k = smooth(0.22, 0.95, s);
        const sin2 = Math.sin(phi) ** 2;
        const radial = 0.82 * Math.pow(Math.max(r, 0), 0.45) * (1 - 0.5 * s) * (1 - 0.9 * k * sin2);
        nx = Math.cos(phi) * radial + 0.34 * k * Math.cos(phi) * (1 - sin2);
        nz = Math.sin(phi) * radial * 0.9;
        ny = -s * 1.7;
        nx += 0.08 * k * k * Math.sign(Math.cos(phi)) * Math.abs(Math.cos(phi)); // gentle root flare
      }
      p.setXYZ(i, nx, ny + 0.35, nz);
    }
    g.computeVertexNormals();
    return g;
  }, [segments]);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

function Sculpture({ state, segments }: { state: React.RefObject<SceneState>; segments: number }) {
  const group = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const kick = useRef(0);
  const geo = useToothGeometry(segments);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const s = state.current?.scroll ?? 0;
    kick.current = THREE.MathUtils.damp(kick.current, state.current?.kick ?? 0, 2.4, dt);
    const t = performance.now() / 1000;
    const targetY = t * 0.12 + s * Math.PI * 0.9 + kick.current + pointer.x * 0.25;
    const targetX = -0.18 + s * 0.35 - pointer.y * 0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt);
    g.position.y = Math.sin(t * 0.8) * 0.05;
    if (orbit.current) orbit.current.rotation.y = t * 0.35 + s * 2;
  });

  return (
    <group ref={group} scale={1.05}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial
          color="#f3ede3"
          roughness={0.22}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
          sheen={0.6}
          sheenRoughness={0.4}
          sheenColor="#e0ccaa"
          specularIntensity={0.9}
          ior={1.5}
        />
      </mesh>
      {/* Thin gold orbit: a quiet echo of the narrative dot */}
      <group rotation={[1.2, 0, 0.25]}>
        <mesh>
          <torusGeometry args={[1.75, 0.0055, 12, 220]} />
          <meshStandardMaterial color="#c5a46d" metalness={1} roughness={0.25} />
        </mesh>
        <group ref={orbit}>
          <mesh position={[1.75, 0, 0]}>
            <sphereGeometry args={[0.045, 24, 24]} />
            <meshStandardMaterial color="#e0ccaa" emissive="#c5a46d" emissiveIntensity={0.6} metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function DentalThreeScene({
  state,
  active,
  lowPower,
}: {
  state: React.RefObject<SceneState>;
  active: boolean;
  lowPower: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.75]}
      camera={{ position: [0, 0.1, 7.4], fov: 32 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-4, -1, -3]} intensity={1.1} color="#c5a46d" />
      <Sculpture state={state} segments={lowPower ? 96 : 180} />
      <Environment resolution={lowPower ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 2]} scale={[6, 1.4, 1]} rotation-x={Math.PI / 2} color="#fff8ef" />
        <Lightformer form="rect" intensity={1.4} position={[-4, 0.5, 1]} scale={[1.2, 5, 1]} rotation-y={Math.PI / 2} color="#ffffff" />
        <Lightformer form="rect" intensity={1.6} position={[4, -0.5, 0]} scale={[1.2, 5, 1]} rotation-y={-Math.PI / 2} color="#e0ccaa" />
        <Lightformer form="ring" intensity={0.8} position={[0, 0, -5]} scale={3} color="#581c2b" />
      </Environment>
    </Canvas>
  );
}
