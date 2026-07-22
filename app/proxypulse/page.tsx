'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';

// =====================================================================
// DESIGN TOKENS (ТУСКЛАЯ ПАЛИТРА)
// =====================================================================
const tokens = {
    void: "#070709",
    boneWhite: "#d4d4d4",
    ashGray: "#7a7a7a",
    electricIris: "#6c648c",
    saffronSpark: "#8a7f66",
    deepVerdant: "#587561",
    errorMuted: "#8c5a65"
};

// =====================================================================
// LIVE TERMINAL COMPONENT
// =====================================================================
const backendLogs = [
    { method: "GET", path: "/api/v1/go/metrics", status: 200, time: "12ms" },
    { method: "POST", path: "/auth/csharp/login", status: 201, time: "45ms" },
    { method: "GET", path: "/ws/stream/events", status: 101, time: "0ms" },
    { method: "PUT", path: "/api/users/update", status: 400, time: "89ms" },
    { method: "DEL", path: "/cache/redis/flush", status: 204, time: "5ms" },
    { method: "GET", path: "/api/healthz", status: 200, time: "2ms" },
    { method: "POST", path: "/grpc/payment.verify", status: 500, time: "1205ms" },
];

const LiveTerminal = () => {
    const [requests, setRequests] = useState<typeof backendLogs>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = backendLogs[index % backendLogs.length];
                index++;
                return [newReq, ...prev].slice(0, 6);
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full font-mono text-[13px] leading-[1.5] text-[#9a9a9a] relative z-10 flex flex-col h-[200px] overflow-hidden">
            <AnimatePresence mode="popLayout">
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}-${Date.now()}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.15, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[45px_1fr_40px_50px] gap-4 items-center h-8"
                    >
                        <span className={`font-[600] text-left ${req.method === 'GET' ? 'text-[#6c648c]' :
                                req.method === 'POST' ? 'text-[#587561]' :
                                    req.method === 'DEL' ? 'text-[#8a7f66]' : 'text-[#8a7f66]'
                            }`}>
                            {req.method}
                        </span>
                        <span className="text-[#d4d4d4] truncate">{req.path}</span>
                        <span className={`font-[600] text-right ${req.status >= 500 ? 'text-[#8c5a65]' :
                                req.status >= 400 ? 'text-[#8a7f66]' : 'text-[#587561]'
                            }`}>
                            {req.status}
                        </span>
                        <span className="text-right tabular-nums">{req.time}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// =====================================================================
// 3D ENGINE (WAIFU -> GLOBE -> NETWORK)
// =====================================================================
const EARTH_MAP = [
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                               XXXXXX                           ",
    "         XXXXX               XXXXXXXXXX                         ",
    "       XXXXXXXXX            XXXXXXXXXXXX     XX                 ",
    "      XXXXXXXXXXX           XXXXXXXXXXXXX   XXXX                ",
    "      XXXXXXXXXXXX          XXXXXXXXXXXXXX XXXXXX               ",
    "       XXXXXXXXXX           XXXXXXXXXXXXXXXXXXXX                ",
    "        XXXXXXXXX            XXXXXXXXXXXXXXXXXX                 ",
    "          XXXXX              XXXXXXXXXXXXXXXXX                  ",
    "           XXXX              XXXXXXXXXXXXXXXX                   ",
    "            XXX               XXXXXXXXXXXXXXX                   ",
    "            XXX                XXXXXXXXXXXXX                    ",
    "             XX                XXXXXXXXXXXX                     ",
    "             XX                 XXXXXXXX                        ",
    "                                 XXXXXX                         ",
    "                                  XXXX                          ",
    "                                                                ",
    "                                                                ",
    "                                               XXXX             ",
    "                 XXXX                        XXXXXXXX           ",
    "               XXXXXXXX                     XXXXXXXXXX          ",
    "                 XXXX                        XXXXXXXX           ",
    "                                                                "
];

const MorphingParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const scroll = useScroll();

    const { posWaifu, posGlobe, posNetwork, colors, hollows, alphas } = useMemo(() => {
        const numPoints = 22000;

        const posWaifu = new Float32Array(numPoints * 3);
        const posGlobe = new Float32Array(numPoints * 3);
        const posNetwork = new Float32Array(numPoints * 3);

        const colors = new Float32Array(numPoints * 3);
        const hollows = new Float32Array(numPoints);
        const alphas = new Float32Array(numPoints);

        const palette = [
            new THREE.Color(tokens.saffronSpark),
            new THREE.Color(tokens.ashGray),
            new THREE.Color(tokens.saffronSpark),
            new THREE.Color(tokens.electricIris),
            new THREE.Color(tokens.deepVerdant),
            new THREE.Color('#4a4a4a'),
        ];

        const networkNodes: THREE.Vector3[] = [];
        for (let j = 0; j < 25; j++) {
            networkNodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 16,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ));
        }

        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;
            const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const nx = Math.sin(phi) * Math.cos(theta);
            const ny = Math.cos(phi);
            const nz = Math.sin(phi) * Math.sin(theta);

            // --- 1. WAIFU ---
            let bx, by, bz;
            const part = i / numPoints;

            if (part < 0.12) {
                bx = nx * 0.9; by = ny * 0.9 + 3.8; bz = nz * 0.9;
            } else if (part < 0.35) {
                const isLeft = part < 0.235;
                const side = isLeft ? 1 : -1;
                const t = isLeft ? (part - 0.12) / 0.115 : (part - 0.235) / 0.115;
                bx = side * (0.9 + t * 2.0) + (Math.random() - 0.5) * 0.4;
                by = 3.8 - t * 4.5 + (Math.random() - 0.5) * 0.4;
                bz = -0.5 + Math.sin(t * Math.PI) * 1.5 + (Math.random() - 0.5) * 0.4;
            } else if (part < 0.6) {
                const t = (part - 0.35) / 0.25;
                const radius = 0.55 - Math.sin(t * Math.PI) * 0.15;
                const angle = Math.random() * Math.PI * 2;
                bx = Math.cos(angle) * radius; by = 1.0 + t * 2.0; bz = Math.sin(angle) * radius * 0.7;
            } else if (part < 0.85) {
                const t = (part - 0.6) / 0.25;
                const radius = 0.8 + (1.0 - t) * 2.0;
                const angle = Math.random() * Math.PI * 2;
                const ruffle = Math.sin(angle * 10) * 0.25;
                bx = Math.cos(angle) * (radius + ruffle); by = -1.5 + t * 2.5; bz = Math.sin(angle) * (radius + ruffle);
            } else {
                const isLeft = part < 0.925;
                const side = isLeft ? 1 : -1;
                const t = isLeft ? (part - 0.85) / 0.075 : (part - 0.925) / 0.075;
                const radius = 0.35 - t * 0.15;
                const angle = Math.random() * Math.PI * 2;
                bx = side * 0.5 + Math.cos(angle) * radius; by = -5.5 + t * 4.0; bz = Math.sin(angle) * radius;
            }
            posWaifu[i3] = bx + 2.0; posWaifu[i3 + 1] = by - 0.5; posWaifu[i3 + 2] = bz;

            // --- 2. GLOBE ---
            const planetRadius = 6.5;
            const offsetY = -4.0;
            const offsetX = 2.0;

            posGlobe[i3] = nx * planetRadius + offsetX;
            posGlobe[i3 + 1] = ny * planetRadius + offsetY;
            posGlobe[i3 + 2] = nz * planetRadius;

            const u = 0.5 + Math.atan2(nz, nx) / (2 * Math.PI);
            const v = 0.5 - Math.asin(ny) / Math.PI;
            const mapX = Math.floor(u * 64) % 64;
            const mapY = Math.floor(v * EARTH_MAP.length);
            const safeY = Math.max(0, Math.min(EARTH_MAP.length - 1, mapY));
            alphas[i] = EARTH_MAP[safeY][mapX] === 'X' ? 1.0 : (Math.random() > 0.9 ? 0.4 : 0.0);

            // --- 3. NETWORK ---
            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const netDist = Math.random();
            posNetwork[i3] = targetNode.x + (Math.random() - 0.5) * 6 * netDist + offsetX;
            posNetwork[i3 + 1] = targetNode.y + (Math.random() - 0.5) * 6 * netDist;
            posNetwork[i3 + 2] = targetNode.z + (Math.random() - 0.5) * 6 * netDist;

            // --- COLORS ---
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
            hollows[i] = Math.random() > 0.5 ? 1.0 : 0.0;
        }

        return { posWaifu, posGlobe, posNetwork, colors, hollows, alphas };
    }, []);

    const uniforms = useMemo(() => ({
        uProgress: { value: 0 },
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uProgress.value,
                scroll.offset,
                0.1
            );
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group position={[1.5, 0, 0]}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-posWaifu" count={posWaifu.length / 3} array={posWaifu} itemSize={3} />
                    <bufferAttribute attach="attributes-posGlobe" count={posGlobe.length / 3} array={posGlobe} itemSize={3} />
                    <bufferAttribute attach="attributes-posNetwork" count={posNetwork.length / 3} array={posNetwork} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
                    <bufferAttribute attach="attributes-hollow" count={hollows.length} array={hollows} itemSize={1} />
                    <bufferAttribute attach="attributes-targetAlpha" count={alphas.length} array={alphas} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    ref={materialRef}
                    transparent
                    depthWrite={false}
                    blending={THREE.NormalBlending}
                    uniforms={uniforms}
                    vertexShader={`
            uniform float uProgress;
            uniform float uTime;
            
            attribute vec3 posWaifu;
            attribute vec3 posGlobe;
            attribute vec3 posNetwork;
            attribute vec3 color;
            attribute float hollow;
            attribute float targetAlpha;
            
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            vec3 curlNoise(vec3 p) {
              return vec3(
                sin(p.y * 2.0 + uTime) * cos(p.z * 2.0),
                sin(p.z * 2.0 + uTime) * cos(p.x * 2.0),
                sin(p.x * 2.0 + uTime) * cos(p.y * 2.0)
              ) * 0.8;
            }

            void main() {
              vColor = color;
              vHollow = hollow;
              
              vec3 finalPos;
              float currentAlpha = 1.0;
              float turbulence = 0.0;
              
              if (uProgress < 0.5) {
                float t = uProgress * 2.0; 
                finalPos = mix(posWaifu, posGlobe, t);
                currentAlpha = mix(1.0, targetAlpha, t);
                turbulence = sin(t * 3.14159);
              } else {
                float t = (uProgress - 0.5) * 2.0;
                finalPos = mix(posGlobe, posNetwork, t);
                currentAlpha = mix(targetAlpha, 1.0, t);
                turbulence = sin(t * 3.14159);
              }
              
              vAlpha = currentAlpha;
              vec3 noise = curlNoise(finalPos) * turbulence * 1.5;
              vec4 mvPosition = modelViewMatrix * vec4(finalPos + noise, 1.0);
              
              gl_PointSize = 35.0 * (1.0 / -mvPosition.z); 
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            void main() {
              if (vAlpha < 0.05) discard; 
              vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
              float angle = 0.5; 
              float s = sin(angle), c = cos(angle);
              uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
              
              float a = atan(uv.x, uv.y) + 3.14159;
              float r = 3.14159 * 2.0 / 3.0;
              float d = cos(floor(0.5 + a / r) * r - a) * length(uv);
              float alpha = 1.0 - step(0.45, d); 
              
              if (vHollow > 0.5) alpha -= 1.0 - step(0.25, d);
              if (alpha < 0.1) discard;
              
              gl_FragColor = vec4(vColor, alpha * vAlpha * 0.5);
            }
          `}
                />
            </points>
        </group>
    );
};

// =====================================================================
// MAIN LAYOUT
// =====================================================================
export default function Page() {
    return (
        <main className="w-full h-screen bg-[#070709] overflow-hidden relative selection:bg-[#6c648c] selection:text-white">

            {/* 3D CANVAS - Строго на фоне */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#070709']} />
                    <ScrollControls pages={3} damping={0.25}>
                        <MorphingParticles />

                        {/* HTML OVERLAY */}
                        <Scroll html style={{ width: '100%', height: '100%' }}>
                            <div className="relative w-full h-[300vh] text-zinc-300 font-sans pointer-events-none">

                                {/* НАВИГАЦИЯ */}
                                <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 md:px-16 lg:px-24 py-8 pointer-events-auto z-50">
                                    <div className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                                        <div className="w-5 h-5 flex flex-wrap gap-[1px]">
                                            <div className="w-[9px] h-[9px] bg-[#6c648c] rounded-tl-sm"></div>
                                            <div className="w-[9px] h-[9px] bg-[#587561] rounded-tr-sm"></div>
                                            <div className="w-[9px] h-[9px] bg-[#8a7f66] rounded-bl-sm"></div>
                                            <div className="w-[9px] h-[9px] bg-[#d4d4d4] rounded-br-sm"></div>
                                        </div>
                                        PROXYPULSE
                                    </div>
                                    <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-widest items-center text-zinc-400">
                                        <Link href="#manifesto" className="hover:text-white transition">MANIFESTO</Link>
                                        <Link href="#docs" className="hover:text-white transition">DOCS</Link>
                                        <Link href="#github" className="hover:text-white transition">GITHUB</Link>
                                        <button className="bg-[#6c648c] text-[#d4d4d4] px-6 py-2.5 rounded-full hover:bg-[#5a5375] transition">
                                            DEPLOY AGENT
                                        </button>
                                    </div>
                                </nav>

                                {/* ЭКРАН 1: ВАЙФУ */}
                                <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-2xl mt-12 pointer-events-auto relative z-10">
                                        <span className="text-[10px] text-[#8a7f66] font-bold tracking-widest mb-4 uppercase block">
                                            Network Observability
                                        </span>
                                        <h1 className="text-6xl lg:text-8xl font-medium text-[#d4d4d4] mb-6 leading-[0.95] tracking-tight">
                                            See your <br />
                                            network. <br />
                                            Live.
                                        </h1>
                                        <div className="mt-8">
                                            <p className="max-w-[400px] text-zinc-400 text-sm leading-relaxed mb-8 font-light">
                                                Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                                            </p>
                                            <button className="bg-[#6c648c] text-[#d4d4d4] px-7 py-3 rounded-full text-xs font-bold tracking-wider hover:bg-[#5a5375] transition">
                                                REQUEST ACCESS
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ЭКРАН 2: ПЛАНЕТА С ТЕРМИНАЛОМ */}
                                <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-xl pointer-events-auto relative z-10">
                                        <h2 className="text-5xl lg:text-6xl font-medium text-[#d4d4d4] mb-6 leading-tight tracking-tight">
                                            Global traffic <br /> layer.
                                        </h2>
                                        <p className="max-w-[400px] text-zinc-400 text-sm leading-relaxed mb-8 font-light">
                                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive global map. See where your requests bottleneck geographically.
                                        </p>

                                        {/* ВЕРНУЛ БЛОК С ЛОГАМИ */}
                                        <div className="bg-[#070709]/60 backdrop-blur-md border border-[#1a1a1a] rounded-[24px] p-[24px] w-full max-w-[460px]">
                                            <span className="text-[12px] font-[600] text-[#587561] uppercase tracking-[0.35px] mb-[16px] block border-b border-[#1a1a1a] pb-3">
                                                Agent Proxy Activity
                                            </span>
                                            <LiveTerminal />
                                        </div>
                                    </div>
                                </div>

                                {/* ЭКРАН 3: СЕТЬ И ФУТЕР */}
                                <div className="absolute top-[200vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-xl pointer-events-auto relative z-10 mb-20">
                                        <h2 className="text-5xl lg:text-6xl font-medium text-[#d4d4d4] mb-8 leading-tight tracking-tight">
                                            Connect every <br /> microservice.
                                        </h2>
                                        <p className="max-w-[440px] text-zinc-400 text-sm leading-relaxed mb-10 font-light">
                                            Whether you are writing distributed services in <span className="text-[#6c648c] font-medium">Go</span> or enterprise backends in <span className="text-[#8a7f66] font-medium">C#</span>. ProxyPulse maps dependencies dynamically, revealing the hidden neural network of your architecture.
                                        </p>

                                        <div className="flex gap-12">
                                            <div>
                                                <p className="text-[10px] text-[#8a7f66] font-bold tracking-widest mb-2 uppercase">Backend & Frontend</p>
                                                <p className="text-xl text-[#d4d4d4] font-medium">Debug APIs</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#587561] font-bold tracking-widest mb-2 uppercase">DevOps / Infra</p>
                                                <p className="text-xl text-[#d4d4d4] font-medium">Monitor proxies</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ВЕРНУЛ ФУТЕР ВНИЗ СТРАНИЦЫ */}
                                    <footer className="absolute bottom-10 left-0 w-full px-8 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-end pointer-events-auto border-t border-[#1a1a1a] pt-8">
                                        <div className="flex flex-col gap-[12px] mb-8 md:mb-0">
                                            <div className="flex items-center gap-[12px]">
                                                <span className="text-[20px] font-[500] tracking-widest text-[#d4d4d4]">PROXYPULSE</span>
                                            </div>
                                            <p className="text-[12px] font-[400] text-zinc-500 max-w-[280px]">
                                                The observability platform built for high-performance engineering teams.
                                            </p>
                                        </div>

                                        <div className="flex gap-[48px] text-[11px] font-[600] text-zinc-500 uppercase tracking-widest">
                                            <div className="flex flex-col gap-[12px]">
                                                <Link href="#" className="hover:text-[#d4d4d4] transition-colors">Manifesto</Link>
                                                <Link href="#" className="hover:text-[#d4d4d4] transition-colors">Documentation</Link>
                                            </div>
                                            <div className="flex flex-col gap-[12px]">
                                                <Link href="#" className="hover:text-[#d4d4d4] transition-colors">Agent GitHub</Link>
                                                <Link href="#" className="hover:text-[#d4d4d4] transition-colors">Twitter (X)</Link>
                                            </div>
                                        </div>
                                    </footer>
                                </div>

                            </div>
                        </Scroll>
                    </ScrollControls>
                </Canvas>
            </div>
        </main>
    );
}