'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';

const tokens = {
    void: "#000000",
    boneWhite: "#ffffff",
    electricIris: "#8052ff",
    saffronSpark: "#ffb829",
    deepVerdant: "#15846e",
    stemBlue: "#45bcf2"
};

const DalaLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L22 20H2L12 2Z" fill="url(#paint0_linear)" />
        <defs>
            <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor={tokens.electricIris} />
                <stop offset="1" stopColor={tokens.deepVerdant} />
            </linearGradient>
        </defs>
    </svg>
);

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
    const [requests, setRequests] = useState([]);

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
        <div className="w-full font-mono text-[12px] md:text-[14px] leading-[1.5] text-[#bdbdbd] relative z-10 flex flex-col h-[200px] overflow-hidden">
            <AnimatePresence mode="popLayout">
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}-${Date.now()}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.12, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[35px_1fr_30px_40px] md:grid-cols-[45px_1fr_40px_50px] gap-2 md:gap-4 items-center h-8"
                    >
                        <span className={`font-[600] text-left ${req.method === 'GET' ? 'text-[#8052ff]' : req.method === 'POST' ? 'text-[#15846e]' : req.method === 'DEL' ? 'text-[#e845f2]' : 'text-[#ffb829]'}`}>
                            {req.method}
                        </span>
                        <span className="text-[#ffffff] truncate">{req.path}</span>
                        <span className={`font-[600] text-right ${req.status >= 500 ? 'text-[#e845f2]' : req.status >= 400 ? 'text-[#ffb829]' : 'text-[#15846e]'}`}>
                            {req.status}
                        </span>
                        <span className="text-right tabular-nums">{req.time}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

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
    const pointsRef = useRef(null);
    const materialRef = useRef(null);
    const scroll = useScroll();
    const { size } = useThree();

    const isMobile = size.width < 768;

    const { positions, posGlobe, posNetwork, colors, hollows, alphas } = useMemo(() => {
        const numPoints = 22000;

        const positions = new Float32Array(numPoints * 3);
        const posGlobe = new Float32Array(numPoints * 3);
        const posNetwork = new Float32Array(numPoints * 3);

        const colors = new Float32Array(numPoints * 3);
        const hollows = new Float32Array(numPoints);
        const alphas = new Float32Array(numPoints);

        const palette = [
            new THREE.Color(tokens.boneWhite),
            new THREE.Color(tokens.saffronSpark),
            new THREE.Color(tokens.electricIris),
            new THREE.Color(tokens.stemBlue),
            new THREE.Color(tokens.deepVerdant),
        ];

        const networkNodes = [];
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

            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const netDist = Math.random();
            posNetwork[i3] = targetNode.x + (Math.random() - 0.5) * 6 * netDist;
            posNetwork[i3 + 1] = targetNode.y + (Math.random() - 0.5) * 6 * netDist;
            posNetwork[i3 + 2] = targetNode.z + (Math.random() - 0.5) * 6 * netDist;

            const color = (by > 1.2 || Math.random() > 0.7) ? palette[0] : palette[Math.floor(Math.random() * palette.length)];
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
            const offset = scroll.offset;
            let target = 0;
            if (offset < 0.25) target = 0;
            else if (offset < 0.75) target = 0.5;
            else target = 1.0;

            materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uProgress.value,
                target,
                0.08
            );
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group position={isMobile ? [0, -2.5, 0] : [4.5, -0.5, 0]} scale={isMobile ? 0.65 : 1}>
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
                    blending={THREE.AdditiveBlending}
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
              
              gl_FragColor = vec4(vColor, alpha * vAlpha); 
            }
          `}
                />
            </points>
        </group>
    );
};

const ScrollNav = () => {
    const scroll = useScroll();
    const [active, setActive] = useState(0);

    useFrame(() => {
        const offset = scroll.offset;
        let index = 0;
        if (offset > 0.25 && offset < 0.75) index = 1;
        else if (offset >= 0.75) index = 2;
        if (active !== index) setActive(index);
    });

    const handleScroll = (dir) => {
        const target = active + dir;
        if (target >= 0 && target <= 2) {
            scroll.el.scrollTo({ top: scroll.el.clientHeight * target, behavior: 'smooth' });
        }
    };

    return (
        <Scroll html>
            <div className="fixed bottom-[24px] md:bottom-[40px] left-1/2 -translate-x-1/2 flex items-center gap-[24px] z-[100] pointer-events-auto bg-[#000000]/60 backdrop-blur-md border border-[#1a1a1a] rounded-full px-[20px] py-[10px]">
                <button
                    onClick={() => handleScroll(-1)}
                    disabled={active === 0}
                    className={`p-[8px] transition-all duration-300 ${active === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:text-[#8052ff]'}`}
                    aria-label="Scroll Up"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                </button>

                <div className="flex gap-[12px]">
                    {[0, 1, 2].map((i) => (
                        <button
                            key={i}
                            onClick={() => scroll.el.scrollTo({ top: scroll.el.clientHeight * i, behavior: 'smooth' })}
                            className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${active === i ? 'bg-[#8052ff] scale-150' : 'bg-[#ffffff]/30 hover:bg-[#ffffff]/60'}`}
                            aria-label={`Go to section ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => handleScroll(1)}
                    disabled={active === 2}
                    className={`p-[8px] transition-all duration-300 ${active === 2 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:text-[#8052ff]'}`}
                    aria-label="Scroll Down"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>
            </div>
        </Scroll>
    );
};

export default function Page() {
    return (
        <main className="w-full h-screen bg-[#000000] overflow-hidden relative selection:bg-[#8052ff] selection:text-white">
            <nav className="fixed top-0 left-0 w-full z-50 py-[20px] md:py-[24px] px-[20px] md:px-[60px] flex justify-between items-center mix-blend-difference pointer-events-auto">
                <div className="flex items-center gap-[12px]">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#manifesto" className="text-[12px] lg:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#docs" className="text-[12px] lg:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#github" className="text-[12px] lg:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">GitHub</Link>
                </div>
                <div className="flex items-center">
                    <button className="bg-[#8052ff] text-[#ffffff] text-[12px] md:text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[16px] py-[12px] md:py-[14.4px] hover:bg-[#6c40e6] transition-colors">
                        Request Access
                    </button>
                </div>
            </nav>

            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#000000']} />
                    <ScrollControls pages={3} damping={0.25}>
                        <MorphingParticles />
                        <ScrollNav />

                        <Scroll html style={{ width: '100%', height: '100%' }}>
                            <div className="relative w-full h-[300vh] text-[#ffffff] font-sans pointer-events-none">

                                <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-start pt-[120px] md:pt-0 md:justify-center px-[20px] md:px-[60px]">
                                    <div className="max-w-[540px] pointer-events-auto mix-blend-difference">
                                        <span className="text-[12px] md:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829] mb-[20px] md:mb-[24px] block">
                                            Network Observability
                                        </span>
                                        <h1 className="text-[56px] md:text-[78px] lg:text-[113px] font-[400] leading-[1.0] tracking-[-2.2px] md:tracking-[-3.12px] lg:tracking-[-4.52px] text-[#ffffff] mb-[24px] md:mb-[30px]">
                                            See your network. Live.
                                        </h1>
                                        <p className="text-[14px] md:text-[18px] font-[200] leading-[1.5] text-[#ffffff] max-w-[480px] mb-[36px] md:mb-[48px]">
                                            Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                                        </p>
                                        <button className="bg-[#8052ff] text-[#ffffff] text-[12px] md:text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[20px] md:px-[24px] py-[14px] md:py-[16px] hover:bg-[#6c40e6] transition-colors">
                                            Deploy Proxy
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute top-[100vh] left-0 w-full h-screen flex flex-col justify-start pt-[120px] md:pt-0 md:justify-center px-[20px] md:px-[60px]">
                                    <div className="max-w-[500px] pointer-events-auto">
                                        <h2 className="text-[40px] md:text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[20px] md:mb-[24px]">
                                            Global traffic layer.
                                        </h2>
                                        <p className="text-[14px] md:text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] mb-[36px] md:mb-[48px]">
                                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive global map. See where your requests bottleneck geographically.
                                        </p>

                                        <div className="bg-[#000000]/40 backdrop-blur-md border border-[#1a1a1a] rounded-[20px] md:rounded-[24px] p-[20px] md:p-[24px] w-full max-w-[460px]">
                                            <span className="text-[10px] md:text-[12px] font-[600] text-[#15846e] uppercase tracking-[0.35px] mb-[16px] block border-b border-[#1a1a1a] pb-3">
                                                Agent Proxy Activity
                                            </span>
                                            <LiveTerminal />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-[200vh] left-0 w-full h-screen flex flex-col justify-start pt-[120px] md:pt-0 md:justify-center px-[20px] md:px-[60px] pb-[100px]">
                                    <div className="w-full flex flex-col lg:flex-row items-start md:items-center gap-[40px] md:gap-[60px] lg:gap-[120px] pointer-events-auto">
                                        <div className="flex-1 w-full max-w-[520px]">
                                            <h2 className="text-[40px] md:text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[20px] md:mb-[24px]">
                                                Connect every microservice.
                                            </h2>
                                            <p className="text-[14px] md:text-[18px] font-[200] leading-[1.5] text-[#bdbdbd]">
                                                Whether you are writing distributed services in Go or enterprise backends in C#. ProxyPulse maps dependencies dynamically, revealing the hidden neural network of your architecture.
                                            </p>
                                        </div>

                                        <div className="flex-1 w-full flex flex-col gap-[32px] md:gap-[48px]">
                                            <div className="flex flex-col gap-[6px]">
                                                <span className="text-[12px] md:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829]">Backend & Frontend</span>
                                                <p className="text-[20px] md:text-[27px] font-[400] leading-[1.0] text-[#ffffff]">Debug APIs instantly.</p>
                                            </div>
                                            <div className="flex flex-col gap-[6px]">
                                                <span className="text-[12px] md:text-[14px] font-[600] uppercase tracking-[0.35px] text-[#8052ff]">DevOps / Infra</span>
                                                <p className="text-[20px] md:text-[27px] font-[400] leading-[1.0] text-[#bdbdbd]">Monitor proxy layer health.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <footer className="absolute bottom-0 left-0 w-full px-[20px] md:px-[60px] pt-[40px] md:pt-[60px] pb-[100px] md:pb-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px] border-t border-[#1a1a1a] bg-[#000000] pointer-events-auto">
                                        <div className="flex flex-col gap-[16px]">
                                            <div className="flex items-center gap-[12px]">
                                                <DalaLogo />
                                                <span className="text-[18px] md:text-[24px] font-[400] tracking-[-0.5px] text-[#ffffff]">ProxyPulse</span>
                                            </div>
                                            <p className="text-[12px] md:text-[14px] font-[400] text-[#9a9a9a] max-w-[300px]">
                                                The observability platform built for high-performance engineering teams.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-[36px] md:gap-[48px] text-[12px] md:text-[14px] font-[600] text-[#9a9a9a] uppercase tracking-[0.35px]">
                                            <div className="flex flex-col gap-[12px] md:gap-[16px]">
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Manifesto</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Documentation</Link>
                                                <Link href="#" className="hover:text-[#ffffff] transition-colors">Agent GitHub</Link>
                                            </div>
                                            <div className="flex flex-col gap-[12px] md:gap-[16px]">
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