"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Text,
  Hud,
  OrthographicCamera,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export const sharedRotation = new THREE.Euler();
export const sharedState = {
  manualX: 0,
  manualY: 0,
  isDragging: false,
};
export let forceResetRotation = false;

export function resetModelRotation() {
  forceResetRotation = true;
}

interface ModelSettings {
  color: string;
  scale: number;
  speed: number;
}

function SolidGlassY({
  color,
  scaleMult,
  speed,
}: {
  color: string;
  scaleMult: number;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, -1.5);
    shape.lineTo(0.4, -1.5);
    shape.lineTo(0.4, 0);
    shape.lineTo(1.5, 1.8);
    shape.lineTo(0.7, 1.8);
    shape.lineTo(0, 0.4);
    shape.lineTo(-0.7, 1.8);
    shape.lineTo(-1.5, 1.8);
    shape.lineTo(-0.4, 0);
    shape.lineTo(-0.4, -1.5);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    }).center();
  }, []);

  useFrame((state) => {
    if (group.current) {
      if (forceResetRotation) {
        sharedState.manualX = THREE.MathUtils.lerp(sharedState.manualX, 0, 0.1);
        sharedState.manualY = THREE.MathUtils.lerp(sharedState.manualY, 0, 0.1);
        if (
          Math.abs(sharedState.manualX) < 0.01 &&
          Math.abs(sharedState.manualY) < 0.01
        ) {
          forceResetRotation = false;
        }
      }

      const isMobile = viewport.width < 5;
      const ptrX = (state.pointer.y * Math.PI) / (isMobile ? 6 : 4);
      const ptrY = (state.pointer.x * Math.PI) / (isMobile ? 6 : 4);

      const targetX = ptrX + sharedState.manualX;
      const targetY = ptrY + sharedState.manualY;

      const lerpFactor = Math.max(0.01, speed * 0.15);

      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX,
        lerpFactor
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY,
        lerpFactor
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        0,
        lerpFactor
      );

      sharedRotation.copy(group.current.rotation);
    }
  });

  const isMobile = viewport.width < 5;
  const baseScale = isMobile
    ? viewport.width / 3.5
    : Math.min(viewport.width / 8, 1.5);

  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={group} scale={baseScale * scaleMult}>
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            color={new THREE.Color(color)}
            background={new THREE.Color("#000000")}
            thickness={6.0}
            roughness={0.0}
            transmission={1}
            ior={1.35}
            chromaticAberration={1.5}
            anisotropy={0.8}
            clearcoat={1}
            resolution={128}
            samples={3}
          />
        </mesh>
      </group>
    </Float>
  );
}

const LedBillboardWall = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseInit = useRef(false);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(
        state.size.width,
        state.size.height
      );

      if (
        state.pointer.x === 0 &&
        state.pointer.y === 0 &&
        !mouseInit.current
      ) {
        materialRef.current.uniforms.uMouse.value.set(-999, -999);
      } else {
        mouseInit.current = true;
        materialRef.current.uniforms.uMouse.value.lerp(
          new THREE.Vector2(state.pointer.x, state.pointer.y),
          0.15
        );
      }
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec2 vScreenPos;
    void main() {
      vUv = uv;
      vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vScreenPos = clipPos.xy / clipPos.w;
      gl_Position = clipPos;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec2 vScreenPos;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    
    void main() {
      vec2 gridScale = vec2(80.0, 40.0); 
      vec2 uv = vUv * gridScale;
      vec2 panelId = floor(uv);
      vec2 panelUv = fract(uv);

      float border = step(0.08, panelUv.x) * step(panelUv.x, 0.92) * 
                     step(0.08, panelUv.y) * step(panelUv.y, 0.92);

      vec3 color = vec3(0.02, 0.02, 0.03);

      vec2 screen = vScreenPos;
      screen.x *= uResolution.x / uResolution.y;
      vec2 mouse = uMouse;
      mouse.x *= uResolution.x / uResolution.y;

      float distToMouse = distance(screen, mouse);

      float ripple = sin(distToMouse * 15.0 - uTime * 3.0) * 0.5 + 0.5;
      float glowIntensity = smoothstep(0.6, 0.0, distToMouse) * ripple;

      float rand = fract(sin(dot(panelId, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 neonColor = mix(vec3(0.5, 0.0, 0.8), vec3(0.0, 0.8, 0.4), step(0.5, rand));
      neonColor = mix(neonColor, vec3(0.0, 0.4, 1.0), step(0.8, rand)); 

      color += neonColor * glowIntensity * 0.8;
      color *= border; 

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <cylinderGeometry
        args={[25, 25, 30, 32, 16, true, -Math.PI / 2.5, Math.PI / 1.25]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(-999, -999) },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

function TrackingAxes() {
  const { size } = useThree();
  const axesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [dragData, setDragData] = useState({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  useFrame(() => {
    if (axesRef.current && !forceResetRotation) {
      axesRef.current.rotation.copy(sharedRotation);
    } else if (axesRef.current && forceResetRotation) {
      axesRef.current.rotation.set(0, 0, 0);
    }
  });

  if (size.width < 768) return null;

  const zoom = 50;
  const xPos = size.width / 2 / zoom - 3.5;
  const yPos = size.height / 2 / zoom - 2.5;

  const handlePointerDown = (e: THREE.Event & { stopPropagation: () => void; target: { setPointerCapture: (id: number) => void }; pointerId: number; clientX: number; clientY: number }) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    sharedState.isDragging = true;
    setDragData({ isDragging: true, lastX: e.clientX, lastY: e.clientY });
  };

  const handlePointerMove = (e: THREE.Event & { clientX: number; clientY: number }) => {
    if (dragData.isDragging) {
      const deltaX = e.clientX - dragData.lastX;
      const deltaY = e.clientY - dragData.lastY;
      sharedState.manualX += deltaY * 0.01;
      sharedState.manualY += deltaX * 0.01;
      setDragData({ isDragging: true, lastX: e.clientX, lastY: e.clientY });
    }
  };

  const handlePointerUp = (e: THREE.Event & { stopPropagation: () => void; target: { releasePointerCapture: (id: number) => void }; pointerId: number }) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    sharedState.isDragging = false;
    setDragData((prev) => ({ ...prev, isDragging: false }));
  };

  return (
    <group
      position={[xPos, yPos, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      scale={hovered || dragData.isDragging ? 1.1 : 0.8}
    >
      <group ref={axesRef}>
        <mesh position={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial
            color={hovered || dragData.isDragging ? "#ffffff" : "#ff2222"}
          />
        </mesh>
        <Text
          position={[1.2, 0, 0]}
          fontSize={0.3}
          color={hovered || dragData.isDragging ? "#ffffff" : "#ff2222"}
        >
          X
        </Text>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial
            color={hovered || dragData.isDragging ? "#ffffff" : "#22ff22"}
          />
        </mesh>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color={hovered || dragData.isDragging ? "#ffffff" : "#22ff22"}
        >
          Y
        </Text>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial
            color={hovered || dragData.isDragging ? "#ffffff" : "#2222ff"}
          />
        </mesh>
        <Text
          position={[0, 0, 1.2]}
          fontSize={0.3}
          color={hovered || dragData.isDragging ? "#ffffff" : "#2222ff"}
        >
          Z
        </Text>
        <mesh>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <mesh visible={false} scale={3.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.0} />
      </mesh>

      <Text
        position={[0, -1.8, 0]}
        fontSize={0.15}
        color={hovered || dragData.isDragging ? "#ffffff" : "#888888"}
        letterSpacing={0.1}
        onClick={(e) => {
          e.stopPropagation();
          forceResetRotation = true;
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
      >
        CLICK TO RESET
      </Text>
      {dragData.isDragging && (
        <Text
          position={[0, -2.1, 0]}
          fontSize={0.12}
          color="#00ffcc"
          letterSpacing={0.1}
        >
          DRAGGING...
        </Text>
      )}
    </group>
  );
}

function PostEffects() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  if (isMobile) return null;

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        luminanceThreshold={0.4}
        mipmapBlur={false}
        intensity={1.5}
        resolutionScale={0.5}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}

interface Scene3DProps {
  modelSettings: ModelSettings;
}

export default function Scene3D({ modelSettings }: Scene3DProps) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 40 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <LedBillboardWall />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={4}
          color="#ffffff"
        />
        <directionalLight
          position={[-10, -10, -10]}
          intensity={2}
          color="#ffffff"
        />
        <Environment preset="studio" environmentIntensity={1.0} />
        <SolidGlassY
          color={modelSettings.color}
          scaleMult={modelSettings.scale}
          speed={modelSettings.speed}
        />
        <PostEffects />
        <Hud>
          <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
          <ambientLight intensity={1} />
          <TrackingAxes />
        </Hud>
      </Canvas>
    </div>
  );
}

export type { ModelSettings };
