'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';

// =====================================================================
// DESIGN TOKENS (MUTED / DUSTY PALETTE)
// =====================================================================
const tokens = {
    void: "#000000",
    boneWhite: "#ffffff",
    ashGray: "#7a7a7a",
    dustyOrange: "#cc7722", // Тот самый приглушенный оранжевый/ржавый
    darkTeal: "#1a5b60",    // Глубокий бирюзовый
    mutedBlue: "#334f73",   // Тусклый синий
};

const DalaLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L22 20H2L12 2Z" fill="url(#paint0_linear)" />
        <defs>
            <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor={tokens.ashGray} />
                <stop offset="1" stopColor={tokens.boneWhite} />
            </linearGradient>
        </defs>
    </svg>
);

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
        <div className="w-full font-mono text-[14px] leading-[1.5] text-[#9a9a9a] relative z-10 flex flex-col h-[200px] overflow-hidden">
            <AnimatePresence mode="popLayout">
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}-${Date.now()}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.12, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[45px_1fr_40px_50px] gap-4 items-center h-8"
                    >
                        <span className={`font-[600] text-left ${req.method === 'GET' ? 'text-[#334f73]' : req.method === 'POST' ? 'text-[#1a5b60]' : req.method === 'DEL' ? 'text-[#7a7a7a]' : 'text-[#cc7722]'}`}>
                            {req.method}
                        </span>
                        <span className="text-[#d4d4d4] truncate">{req.path}</span>
                        <span className={`font-[600] text-right ${req.status >= 500 ? 'text-[#cc7722]' : req.status >= 400 ? 'text-[#cc7722]' : 'text-[#1a5b60]'}`}>
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
// 3D ENGINE (MUTED COLORS & SHARP TRIANGLES)
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

        // Строгая, тусклая палитра как на референсе
        const palette = [
            new THREE.Color(tokens.dustyOrange),
            new THREE.Color(tokens.darkTeal),
            new THREE.Color(tokens.mutedBlue),
            new THREE.Color(tokens.ashGray),
            new THREE.Color(tokens.boneWhite),
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

            // --- 1. ПИРАМИДА (По центру) ---
            let bx, by, bz;
            const isBase = Math.random() < 0.2;

            if (isBase) {
                bx = (Math.random() - 0.5) * 5.6;
                bz = (Math.random() - 0.5) * 5.6;
                by = -2.0;
            } else {
                const y = Math.random() * 4.0 - 2.0;
                const w = (2.0 - y) * 0.7;
                const side = Math.floor(Math.random() * 4);
                const t = (Math.random() - 0.5) * w * 2;

                if (side === 0) { bx = -w; bz = t; }
                else if (side === 1) { bx = w; bz = t; }
                else if (side === 2) { bx = t; bz = -w; }
                else { bx = t; bz = w; }
                by = y;
            }

            positions[i3] = bx;
            positions[i3 + 1] = by;
            positions[i3 + 2] = bz;

            // --- 2. ПЛАНЕТА ---
            const planetRadius = 6.0;
            posGlobe[i3] = nx * planetRadius;
            posGlobe[i3 + 1] = ny * planetRadius;
            posGlobe[i3 + 2] = nz * planetRadius;

            const u = 0.5 + Math.atan2(nz, nx) / (2 * Math.PI);
            const v = 0.5 - Math.asin(ny) / Math.PI;
            const mapX = Math.floor(u * 64) % 64;
            const mapY = Math.floor(v * EARTH_MAP.length);
            const safeY = Math.max(0, Math.min(EARTH_MAP.length - 1, mapY));
            alphas[i] = EARTH_MAP[safeY][mapX] === 'X' ? 1.0 : (Math.random() > 0.9 ? 0.3 : 0.0);

            // --- 3. СЕТЬ ---
            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const netDist = Math.random();
            posNetwork[i3] = targetNode.x + (Math.random() - 0.5) * 6 * netDist;
            posNetwork[i3 + 1] = targetNode.y + (Math.random() - 0.5) * 6 * netDist;
            posNetwork[i3 + 2] = targetNode.z + (Math.random() - 0.5) * 6 * netDist;

            // Цвета (смещены в сторону тусклых тонов, белых частиц намного меньше)
            const isRareWhite = Math.random() > 0.95;
            const color = isRareWhite ? palette[4] : palette[Math.floor(Math.random() * 4)];

            colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
            // Делаем часть треугольников полыми (контурными), как на референсе
            hollows[i] = Math.random() > 0.6 ? 1.0 : 0.0;
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
        // Фиксируем позицию модели справа
        <group position={[4.5, -0.5, 0]}>
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
                    blending={THREE.NormalBlending} // Вернули матовое смешивание без неонового свечения
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
              
              // Чуть уменьшили размер для большей четкости (как мелкие песчинки на скрине)
              gl_PointSize = 28.0 * (1.0 / -mvPosition.z); 
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
                    fragmentShader={`
            varying vec3 vColor;
            varying float vHollow;
            varying float vAlpha;

            void main() {
              if (vAlpha < 0.05) discard; 
              
              // Рисуем строгий треугольник (как на референсе)
              vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
              float angle = 0.0; // Прямое положение
              float s = sin(angle), c = cos(angle);
              uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
              
              float a = atan(uv.x, uv.y) + 3.14159;
              float r = 3.14159 * 2.0 / 3.0;
              float d = cos(floor(0.5 + a / r) * r - a) * length(uv);
              
              // Внешний контур треугольника
              float alpha = 1.0 - smoothstep(0.4, 0.45, d); 
              
              // Делаем часть треугольников контурными (полыми)
              if (vHollow > 0.5) {
                  alpha -= 1.0 - smoothstep(0.2, 0.25, d);
              }
              
              if (alpha < 0.1) discard;
              
              // Убрали множитель *1.2, чтобы цвета оставались матовыми
              gl_FragColor = vec4(vColor, alpha * vAlpha * 0.85); 
            }
          `}
                />
            </points>
        </group>
    );
};

// =====================================================================
// MAIN LAYOUT (FIXED BLURRED NAV + MUTED DESIGN)
// =====================================================================
export default function Page() {
    return (
        <main className="w-full h-screen bg-[#000000] overflow-hidden relative selection:bg-[#334f73] selection:text-white">

            {/* 
        ИДЕАЛЬНАЯ НАВИГАЦИЯ
        - bg-[#000000]/80 + backdrop-blur-md для читаемости поверх любых элементов
        - Убран mix-blend-difference, чтобы ничего не моргало
        - Добавлена тонкая граница снизу
      */}
            <nav className="fixed top-0 left-0 w-full z-50 py-[20px] px-[24px] md:px-[60px] flex justify-between items-center bg-[#000000]/80 backdrop-blur-md border-b border-[#ffffff]/10 pointer-events-auto transition-all duration-300">
                <div className="flex items-center gap-[12px] cursor-pointer hover:opacity-80 transition-opacity">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#manifesto" className="text-[12px] font-[600] uppercase tracking-[0.5px] text-[#7a7a7a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#docs" className="text-[12px] font-[600] uppercase tracking-[0.5px] text-[#7a7a7a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#github" className="text-[12px] font-[600] uppercase tracking-[0.5px] text-[#7a7a7a] hover:text-[#ffffff] transition-colors">GitHub</Link>
                </div>
                <div className="flex items-center">
                    <button className="bg-[#ffffff] text-[#000000] text-[13px] font-[700] uppercase tracking-[0.5px] rounded-[24px] px-[20px] py-[12px] hover:bg-[#d4d4d4] transition-colors">
                        Request Access
                    </button>
                </div>
            </nav>

            {/* 3D CANVAS */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#000000']} />
                    <ScrollControls pages={3} damping={0.25}>
                        <MorphingParticles />

                        {/* HTML OVERLAY */}
                        <Scroll html style={{ width: '100%', height: '100%' }}>
                            <div className="relative w-full h-[300vh] text-[#ffffff] font-sans pointer-events-none">

                                {/* ЭКРАН 1: ПИРАМИДА */}
                                <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center px-[24px] md:px-[60px]">
                                    <div className="max-w-[540px] mt-[120px] pointer-events-auto">
                                        <span className="text-[13px] font-[600] uppercase tracking-[1px] text-[#cc7722] mb-[24px] block">
                                            Network Observability
                                        </span>
                                        <h1 className="text-[78px] lg:text-[113px] font-[400] leading-[1.0] tracking-[-3.12px] lg:tracking-[-4.52px] text-[#ffffff] mb-[30px]">
                                            See your network. Live.
                                        </h1>
                                        <p className="text-[18px] font-[300] leading-[1.6] text-[#9a9a9a] max-w-[480px] mb-[48px]">
                                            Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                                        </p>
                                        <button className="bg-[#ffffff] text-[#000000] text-[14px] font-[700] uppercase tracking-[0.5px] rounded-[24px] px-[28px] py-[18px] hover:bg-[#d4d4d4] transition-colors">
                                            Deploy Proxy
                                        </button>
                                    </div>
                                </div>

                                {/* ЭКРАН 2: ПЛАНЕТА С ТЕРМИНАЛОМ */}
                                <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-center px-[24px] md:px-[60px]">
                                    <div className="max-w-[500px] pointer-events-auto">
                                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                                            Global traffic layer.
                                        </h2>
                                        <p className="text-[18px] font-[300] leading-[1.6] text-[#9a9a9a] mb-[48px]">
                                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive global map. See where your requests bottleneck geographically.
                                        </p>

                                        <div className="bg-[#050505]/60 backdrop-blur-md border border-[#1a1a1a] rounded-[24px] p-[24px] w-full max-w-[460px]">
                                            <span className="text-[12px] font-[600] text-[#1a5b60] uppercase tracking-[1px] mb-[16px] block border-b border-[#1a1a1a] pb-3">
                                                Agent Proxy Activity
                                            </span>
                                            <LiveTerminal />
                                        </div>
                                    </div>
                                </div>

                                {/* ЭКРАН 3: СЕТЬ И ФУТЕР */}
                                <div className="absolute top-[200vh] left-0 w-full h-screen flex flex-col justify-center px-[24px] md:px-[60px]">
                                    <div className="w-full flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px] pointer-events-auto">
                                        <div className="flex-1 w-full max-w-[520px]">
                                            <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                                                Connect every microservice.
                                            </h2>
                                            <p className="text-[18px] font-[300] leading-[1.6] text-[#9a9a9a]">
                                                Whether you are writing distributed services in Go or enterprise backends in C#. ProxyPulse maps dependencies dynamically, revealing the hidden neural network of your architecture.
                                            </p>
                                        </div>

                                        <div className="flex-1 w-full flex flex-col gap-[48px]">
                                            <div className="flex flex-col gap-[8px]">
                                                <span className="text-[13px] font-[600] uppercase tracking-[1px] text-[#cc7722]">Backend & Frontend</span>
                                                <p className="text-[27px] font-[400] leading-[1.1] text-[#ffffff]">Debug APIs instantly.</p>
                                            </div>
                                            <div className="flex flex-col gap-[8px]">
                                                <span className="text-[13px] font-[600] uppercase tracking-[1px] text-[#334f73]">DevOps / Infra</span>
                                                <p className="text-[27px] font-[400] leading-[1.1] text-[#9a9a9a]">Monitor proxy layer health.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ФУТЕР */}
                                    <footer className="absolute bottom-0 left-0 w-full px-[24px] md:px-[60px] py-[60px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px] border-t border-[#1a1a1a] bg-[#000000] pointer-events-auto">
                                        <div className="flex flex-col gap-[16px]">
                                            <div className="flex items-center gap-[12px]">
                                                <DalaLogo />
                                                <span className="text-[24px] font-[400] tracking-[-0.5px] text-[#ffffff]">ProxyPulse</span>
                                            </div>
                                            <p className="text-[14px] font-[400] text-[#7a7a7a] max-w-[300px]">
                                                The observability platform built for high-performance engineering teams.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-[48px] text-[13px] font-[600] text-[#7a7a7a] uppercase tracking-[0.5px]">
                                            <div className="flex flex-col gap-[16px]">
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Manifesto</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Documentation</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Agent GitHub</Link>
                                            </div>
                                            <div className="flex flex-col gap-[16px]">
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Twitter (X)</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">LinkedIn</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Contact</Link>
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