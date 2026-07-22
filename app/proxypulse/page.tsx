'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';

// =====================================================================
// DESIGN TOKENS (СТРОГАЯ, ТУСКЛАЯ ПАЛИТРА)
// =====================================================================
const tokens = {
    bg: "#050506",
    border: "#1a1a1a",
    textMuted: "#7a7a7a",
    textBase: "#a1a1aa",
    textHighlight: "#d4d4d4",
    accentPurple: "#6c648c",
    accentGreen: "#587561",
    accentGold: "#8a7f66",
    error: "#8c5a65"
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
                return [newReq, ...prev].slice(0, 7);
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full font-mono text-[12px] leading-[1.6] text-zinc-500 relative z-10 flex flex-col h-[220px] overflow-hidden">
            <AnimatePresence mode="popLayout">
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}-${Date.now()}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.12, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[45px_1fr_40px_40px] gap-4 items-center py-1.5 border-b border-[#1a1a1a]/50"
                    >
                        <span className={`font-medium ${req.method === 'GET' ? 'text-[#6c648c]' :
                                req.method === 'POST' ? 'text-[#587561]' :
                                    req.method === 'DEL' ? 'text-[#8a7f66]' : 'text-[#8a7f66]'
                            }`}>
                            {req.method}
                        </span>
                        <span className="text-[#a1a1aa] truncate">{req.path}</span>
                        <span className={`text-right ${req.status >= 500 ? 'text-[#8c5a65]' :
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
// 3D ENGINE (PYRAMID -> GLOBE -> NETWORK)
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

    const { positions, posGlobe, posNetwork, colors, hollows, alphas } = useMemo(() => {
        const numPoints = 22000;

        const positions = new Float32Array(numPoints * 3);
        const posGlobe = new Float32Array(numPoints * 3);
        const posNetwork = new Float32Array(numPoints * 3);

        const colors = new Float32Array(numPoints * 3);
        const hollows = new Float32Array(numPoints);
        const alphas = new Float32Array(numPoints);

        const palette = [
            new THREE.Color(tokens.accentGold),
            new THREE.Color(tokens.textMuted),
            new THREE.Color(tokens.accentPurple),
            new THREE.Color(tokens.accentGreen),
            new THREE.Color('#333333'),
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

            // --- 1. ПИРАМИДА (Строгая геометрия) ---
            let bx, by, bz;
            const isBase = Math.random() < 0.2; // 20% точек формируют ровное дно

            if (isBase) {
                bx = (Math.random() - 0.5) * 5.6;
                bz = (Math.random() - 0.5) * 5.6;
                by = -2.0;
            } else {
                const y = Math.random() * 4.0 - 2.0; // Высота от -2 до 2
                const w = (2.0 - y) * 0.7; // Сужение к вершине
                const side = Math.floor(Math.random() * 4);
                const t = (Math.random() - 0.5) * w * 2;

                if (side === 0) { bx = -w; bz = t; }
                else if (side === 1) { bx = w; bz = t; }
                else if (side === 2) { bx = t; bz = -w; }
                else { bx = t; bz = w; }
                by = y;
            }

            positions[i3] = bx + 2.5;
            positions[i3 + 1] = by;
            positions[i3 + 2] = bz;

            // --- 2. GLOBE ---
            const planetRadius = 6.0;
            const offsetY = -4.0;
            const offsetX = 2.5;

            posGlobe[i3] = nx * planetRadius + offsetX;
            posGlobe[i3 + 1] = ny * planetRadius + offsetY;
            posGlobe[i3 + 2] = nz * planetRadius;

            const u = 0.5 + Math.atan2(nz, nx) / (2 * Math.PI);
            const v = 0.5 - Math.asin(ny) / Math.PI;
            const mapX = Math.floor(u * 64) % 64;
            const mapY = Math.floor(v * EARTH_MAP.length);
            const safeY = Math.max(0, Math.min(EARTH_MAP.length - 1, mapY));
            alphas[i] = EARTH_MAP[safeY][mapX] === 'X' ? 1.0 : (Math.random() > 0.9 ? 0.3 : 0.0);

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

        return { positions, posGlobe, posNetwork, colors, hollows, alphas };
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
            <points ref={pointsRef} frustumCulled={false}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
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
                finalPos = mix(position, posGlobe, t);
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
              
              gl_FragColor = vec4(vColor, alpha * vAlpha * 0.4); // Тусклый режим
            }
          `}
                />
            </points>
        </group>
    );
};

// =====================================================================
// MAIN LAYOUT (СТРОГИЙ IT-ДИЗАЙН)
// =====================================================================
export default function Page() {
    return (
        <main className="w-full h-screen bg-[#050506] overflow-hidden relative selection:bg-[#6c648c] selection:text-white">

            {/* 3D CANVAS */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#050506']} />
                    <ScrollControls pages={3} damping={0.25}>
                        <MorphingParticles />

                        {/* HTML OVERLAY */}
                        <Scroll html style={{ width: '100%', height: '100%' }}>
                            <div className="relative w-full h-[300vh] text-zinc-300 font-sans pointer-events-none">

                                {/* СТРОГАЯ НАВИГАЦИЯ */}
                                <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 border-b border-[#1a1a1a] bg-[#050506]/80 backdrop-blur-md pointer-events-auto z-50">
                                    <div className="text-[14px] font-medium tracking-widest text-zinc-300 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#6c648c] rounded-full animate-pulse"></div>
                                        PROXYPULSE
                                    </div>
                                    <div className="hidden md:flex gap-8 text-[12px] font-medium tracking-wide text-zinc-500">
                                        <Link href="#dashboard" className="hover:text-zinc-300 transition">Dashboard</Link>
                                        <Link href="#api" className="hover:text-zinc-300 transition">API Reference</Link>
                                        <Link href="#docs" className="hover:text-zinc-300 transition">Documentation</Link>
                                    </div>
                                    <button className="text-[12px] font-medium border border-[#1a1a1a] bg-[#0a0a0c] text-zinc-400 px-5 py-2 hover:border-[#6c648c] hover:text-white transition">
                                        Deploy Agent
                                    </button>
                                </nav>

                                {/* ЭКРАН 1: ПИРАМИДА (Strict tech intro) */}
                                <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-xl mt-16 pointer-events-auto relative z-10">
                                        <div className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#0a0a0c] px-3 py-1 mb-6">
                                            <span className="w-1.5 h-1.5 bg-[#587561]"></span>
                                            <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">v2.0.4 Online</span>
                                        </div>

                                        <h1 className="text-5xl lg:text-6xl font-medium text-zinc-200 mb-6 tracking-tight leading-[1.1]">
                                            Network <br /> Observability <br /> Platform.
                                        </h1>

                                        <p className="max-w-[420px] text-zinc-500 text-[14px] leading-relaxed mb-10">
                                            Monitor, debug, and trace your API requests in real-time. Built for distributed systems running Go and C#. No more dead logs, just pure network visibility.
                                        </p>

                                        <div className="flex gap-4">
                                            <button className="bg-[#6c648c] text-white px-6 py-2.5 text-[13px] font-medium hover:bg-[#5a5375] transition">
                                                Initialize Setup
                                            </button>
                                            <button className="border border-[#1a1a1a] text-zinc-400 px-6 py-2.5 text-[13px] font-medium hover:bg-[#1a1a1a] transition">
                                                View GitHub
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ЭКРАН 2: ПЛАНЕТА С ТЕРМИНАЛОМ */}
                                <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-xl pointer-events-auto relative z-10">
                                        <h2 className="text-4xl lg:text-5xl font-medium text-zinc-200 mb-6 tracking-tight">
                                            Global Traffic Map.
                                        </h2>
                                        <p className="max-w-[400px] text-zinc-500 text-[14px] leading-relaxed mb-10">
                                            Analyze latency and request bottlenecks across regions. ProxyPulse agent intercepts HTTP/gRPC traffic with near-zero overhead.
                                        </p>

                                        {/* СТРОГИЙ ТЕРМИНАЛ */}
                                        <div className="bg-[#0a0a0c]/80 backdrop-blur-md border border-[#1a1a1a] p-5 w-full max-w-[460px] shadow-2xl">
                                            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3 mb-3">
                                                <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">
                                                    Live Proxy Feed
                                                </span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 bg-[#8c5a65]"></div>
                                                    <div className="w-2 h-2 bg-[#8a7f66]"></div>
                                                    <div className="w-2 h-2 bg-[#587561]"></div>
                                                </div>
                                            </div>
                                            <LiveTerminal />
                                        </div>
                                    </div>
                                </div>

                                {/* ЭКРАН 3: СЕТЬ И ФУТЕР */}
                                <div className="absolute top-[200vh] left-0 w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
                                    <div className="max-w-xl pointer-events-auto relative z-10 mb-20">
                                        <h2 className="text-4xl lg:text-5xl font-medium text-zinc-200 mb-6 tracking-tight">
                                            Microservice <br /> Topology.
                                        </h2>
                                        <p className="max-w-[440px] text-zinc-500 text-[14px] leading-relaxed mb-10">
                                            Automatically map dependencies between your backend services. Detect failing nodes, analyze bandwidth consumption, and optimize your architecture dynamically.
                                        </p>

                                        <div className="grid grid-cols-2 gap-8 border-t border-[#1a1a1a] pt-8 max-w-[400px]">
                                            <div>
                                                <p className="text-[11px] text-zinc-600 font-mono mb-2 uppercase">Core Protocol</p>
                                                <p className="text-[15px] text-zinc-300">HTTP/1.1, HTTP/2, WebSocket</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-zinc-600 font-mono mb-2 uppercase">Agent Perf</p>
                                                <p className="text-[15px] text-zinc-300">&lt; 2MB RAM / Node</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* СТРОГИЙ ФУТЕР */}
                                    <footer className="absolute bottom-0 left-0 w-full px-8 py-6 border-t border-[#1a1a1a] bg-[#050506]/90 backdrop-blur flex flex-col md:flex-row justify-between items-center pointer-events-auto">
                                        <div className="text-[12px] text-zinc-600 font-mono">
                                            © 2026 ProxyPulse / Triple G
                                        </div>
                                        <div className="flex gap-6 text-[12px] font-medium text-zinc-500 mt-4 md:mt-0">
                                            <Link href="#" className="hover:text-zinc-300 transition">Terms</Link>
                                            <Link href="#" className="hover:text-zinc-300 transition">Privacy</Link>
                                            <Link href="#" className="hover:text-zinc-300 transition">System Status</Link>
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