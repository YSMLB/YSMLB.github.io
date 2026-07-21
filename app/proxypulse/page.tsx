"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as THREE from 'three';

// =====================================================================
// DESIGN TOKENS
// =====================================================================
const tokens = {
    void: "#000000",
    boneWhite: "#ffffff",
    ashGray: "#9a9a9a",
    silverMist: "#bdbdbd",
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

// =====================================================================
// 3D MATH & NOISE ENGINE
// =====================================================================
const pseudoNoise3D = (x: number, y: number, z: number) => {
    let n = Math.sin(x * 1.2 + y) + Math.sin(y * 1.2 + z) + Math.sin(z * 1.2 + x);
    n += Math.sin(x * 2.5 - y * 1.5) * 0.5 + Math.cos(z * 2.5 + x * 1.5) * 0.5;
    return n;
};

// =====================================================================
// PURE WEBGL ENGINE: HIGH-FIDELITY POINT CLOUDS
// =====================================================================
const WebGLConstellation = ({ activeShape }: { activeShape: string }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const shapeRef = useRef(activeShape);

    useEffect(() => {
        shapeRef.current = activeShape;
    }, [activeShape]);

    useEffect(() => {
        if (!mountRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width < 768;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0006);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
        camera.position.z = 1000;
        camera.position.x = isMobile ? 0 : -350;
        camera.position.y = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const PARTICLE_COUNT = isMobile ? 8000 : 20000;
        const AMBIENT_COUNT = isMobile ? 500 : 1500;

        const geometry = new THREE.CircleGeometry(3.0, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        const instancedMesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
        const ambientMesh = new THREE.InstancedMesh(geometry, material, AMBIENT_COUNT);

        scene.add(instancedMesh);
        scene.add(ambientMesh);

        const targets = {
            brain: { pos: [] as THREE.Vector3[] },
            globe: { pos: [] as THREE.Vector3[] },
            network: { pos: [] as THREE.Vector3[] }
        };

        const currentPositions: THREE.Vector3[] = [];
        const rotations: number[] = [];
        const scales: number[] = [];
        const spinSpeeds: number[] = [];
        const dummy = new THREE.Object3D();
        const tempColor = new THREE.Color();

        // --------------------------------------------------------
        // 1. ГЕНЕРАЦИЯ МОЗГА
        // --------------------------------------------------------
        let brainPointsFound = 0;
        while (brainPointsFound < PARTICLE_COUNT) {
            const x = (Math.random() - 0.5) * 450;
            const y = (Math.random() - 0.5) * 350;
            const z = (Math.random() - 0.5) * 400;

            let isBrain = false;

            if (y < -80 && y > -200 && Math.abs(x) < 30 && Math.abs(z) < 40) {
                isBrain = true;
            } else {
                const isLeft = x < -5;
                const isRight = x > 5;

                if (isLeft || isRight) {
                    const cx = isLeft ? x + 40 : x - 40;
                    const cy = y;
                    const cz = z;

                    const dist = (cx * cx) / (110 * 110) + (cy * cy) / (130 * 130) + (cz * cz) / (160 * 160);

                    if (dist < 1.0) {
                        const noiseVal = pseudoNoise3D(x * 0.03, y * 0.03, z * 0.03);
                        if (Math.abs(noiseVal) > 0.4 || dist > 0.85) {
                            isBrain = true;
                        }
                    }
                }
            }

            if (isBrain) {
                const tilt = 0.2;
                const tiltedY = y * Math.cos(tilt) - z * Math.sin(tilt);
                const tiltedZ = y * Math.sin(tilt) + z * Math.cos(tilt);

                targets.brain.pos.push(new THREE.Vector3(x, tiltedY + 50, tiltedZ));
                brainPointsFound++;
            }
        }

        // --------------------------------------------------------
        // 2. ГЕНЕРАЦИЯ ПЛАНЕТЫ
        // --------------------------------------------------------
        const R = 320;
        let globePointsFound = 0;
        let pIndex = 0;

        while (globePointsFound < PARTICLE_COUNT) {
            const phi = Math.acos(1 - 2 * (pIndex / (PARTICLE_COUNT * 2.5)));
            const theta = Math.PI * (1 + Math.sqrt(5)) * pIndex;

            const gx = R * Math.cos(theta) * Math.sin(phi);
            const gy = R * Math.cos(phi);
            const gz = R * Math.sin(theta) * Math.sin(phi);

            const continentNoise = pseudoNoise3D(gx * 0.008, gy * 0.008, gz * 0.008);

            if (continentNoise > 0.2) {
                targets.globe.pos.push(new THREE.Vector3(gx, gy, gz));
                globePointsFound++;
            } else if (Math.random() > 0.97) {
                targets.globe.pos.push(new THREE.Vector3(gx, gy, gz));
                globePointsFound++;
            }
            pIndex++;
        }

        // --------------------------------------------------------
        // 3. ГЕНЕРАЦИЯ СЕТИ
        // --------------------------------------------------------
        const networkNodes: THREE.Vector3[] = [];
        for (let j = 0; j < 35; j++) {
            networkNodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 900,
                (Math.random() - 0.5) * 700,
                (Math.random() - 0.5) * 700
            ));
        }

        for (let k = 0; k < PARTICLE_COUNT; k++) {
            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const dist = Math.pow(Math.random(), 2);

            let nx = targetNode.x + (Math.random() - 0.5) * 450 * dist;
            let ny = targetNode.y + (Math.random() - 0.5) * 450 * dist;
            let nz = targetNode.z + (Math.random() - 0.5) * 450 * dist;
            targets.network.pos.push(new THREE.Vector3(nx, ny, nz));

            currentPositions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            ));
            rotations.push(Math.random() * Math.PI * 2);
            scales.push(Math.random() * 0.8 + 0.4);
            spinSpeeds.push((Math.random() - 0.5) * 0.08);
        }

        // ГЛУБИНА
        const ambientSpeeds: THREE.Vector3[] = [];
        for (let j = 0; j < AMBIENT_COUNT; j++) {
            dummy.position.set(
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 4000
            );
            dummy.rotation.z = Math.random() * Math.PI;
            dummy.scale.setScalar(Math.random() * 2.0 + 0.5);
            dummy.updateMatrix();
            ambientMesh.setMatrixAt(j, dummy.matrix);

            tempColor.setHex(Math.random() > 0.5 ? 0x8052ff : 0x15846e);
            ambientMesh.setColorAt(j, tempColor);

            ambientSpeeds.push(new THREE.Vector3(
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.2
            ));
        }
        if (ambientMesh.instanceColor) ambientMesh.instanceColor.needsUpdate = true;

        let time = 0;
        let animationFrameId: number;

        const animate = () => {
            time += 0.0015;

            instancedMesh.rotation.y = time;
            instancedMesh.rotation.x = Math.sin(time * 0.5) * 0.1;
            ambientMesh.rotation.y = time * 0.3;

            const activeTargets = shapeRef.current === 'globe' ? targets.globe :
                shapeRef.current === 'network' ? targets.network : targets.brain;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const current = currentPositions[i];
                const tPos = activeTargets.pos[i];

                current.x += (tPos.x - current.x) * 0.07;
                current.y += (tPos.y - current.y) * 0.07;
                current.z += (tPos.z - current.z) * 0.07;

                rotations[i] += spinSpeeds[i];

                dummy.position.copy(current);
                dummy.rotation.z = rotations[i];
                dummy.scale.setScalar(scales[i]);

                const breathe = Math.sin(time * 10 + i * 0.1) * 2.0;
                dummy.position.x += breathe;

                let cx = dummy.position.x;
                let cy = dummy.position.y;
                let cz = dummy.position.z;

                if (cy < -30 && Math.abs(cx) < 50 && cz < 50) {
                    tempColor.setHex(0x45bcf2);
                } else if (cy > 90) {
                    tempColor.setHex(0x15846e);
                } else if (cz > 130) {
                    tempColor.setHex(0xffffff);
                } else if (cx < -20) {
                    tempColor.setHex(0xffb829);
                } else {
                    tempColor.setHex(0x8052ff);
                }

                if (i % 20 === 0) tempColor.setHex(0xffffff);

                instancedMesh.setColorAt(i, tempColor);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

            for (let i = 0; i < AMBIENT_COUNT; i++) {
                ambientMesh.getMatrixAt(i, dummy.matrix);
                dummy.position.setFromMatrixPosition(dummy.matrix);

                dummy.position.add(ambientSpeeds[i]);
                const B = 2000;
                if (dummy.position.x > B) dummy.position.x = -B;
                else if (dummy.position.x < -B) dummy.position.x = B;
                if (dummy.position.y > B) dummy.position.y = -B;
                else if (dummy.position.y < -B) dummy.position.y = B;
                if (dummy.position.z > B) dummy.position.z = -B;
                else if (dummy.position.z < -B) dummy.position.z = B;

                dummy.rotation.z += 0.01;
                dummy.updateMatrix();
                ambientMesh.setMatrixAt(i, dummy.matrix);
            }
            ambientMesh.instanceMatrix.needsUpdate = true;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            camera.position.x = w < 768 ? 0 : -350;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            mountRef.current?.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none bg-[#000000]" />
    );
};

// =====================================================================
// LIVE TERMINAL
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
        <div className="w-full font-mono text-[14px] leading-[1.5] text-[#bdbdbd] relative z-10 flex flex-col">
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

// =====================================================================
// MAIN LAYOUT
// =====================================================================
export default function ProxyPulse() {
    const [activeShape, setActiveShape] = useState('brain');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const shape = entry.target.getAttribute('data-shape');
                    if (shape) setActiveShape(shape);
                }
            });
        }, { threshold: 0.4 });

        const sections = document.querySelectorAll('.shape-trigger');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    return (
        <div className="bg-[#000000] text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-[#ffffff] overflow-x-hidden relative">

            <WebGLConstellation activeShape={activeShape} />

            <nav className="fixed top-0 left-0 w-full z-50 py-[24px] px-[24px] md:px-[60px] flex justify-between items-center mix-blend-difference">
                <div className="flex items-center gap-[12px]">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#manifesto" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#docs" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#github" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">GitHub</Link>
                </div>
                <div className="flex items-center">
                    <button className="bg-[#8052ff] text-[#ffffff] text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[16px] py-[14.4px] hover:bg-[#6c40e6] transition-colors">
                        Request Access
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1440px] mx-auto px-[24px] md:px-[60px]">

                {/* 1. МОЗГ */}
                <section data-shape="brain" className="shape-trigger flex flex-col justify-center min-h-screen pt-[120px] pb-[120px] pointer-events-none">
                    <div className="w-full max-w-[540px] pointer-events-auto mix-blend-difference">
                        <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829] mb-[24px] block">
                            Network Observability
                        </span>
                        <h1 className="text-[78px] lg:text-[113px] font-[400] leading-[1.0] tracking-[-3.12px] lg:tracking-[-4.52px] text-[#ffffff] mb-[30px]">
                            See your network. Live.
                        </h1>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#ffffff] max-w-[480px] mb-[48px]">
                            Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                        </p>
                        <button className="bg-[#8052ff] text-[#ffffff] text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[24px] py-[16px] hover:bg-[#6c40e6] transition-colors">
                            Deploy Proxy
                        </button>
                    </div>
                </section>

                {/* 2. ПЛАНЕТА */}
                <section data-shape="globe" className="shape-trigger flex flex-col justify-center min-h-screen py-[120px] pointer-events-none">
                    <div className="w-full max-w-[500px] pointer-events-auto mix-blend-difference">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Global traffic layer.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] mb-[48px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive global map. See where your requests bottleneck geographically.
                        </p>
                        <div className="bg-[#000000]/40 backdrop-blur-md border border-[#1a1a1a] rounded-[24px] p-[24px] w-full max-w-[460px]">
                            <span className="text-[12px] font-[600] text-[#15846e] uppercase tracking-[0.35px] mb-[16px] block border-b border-[#1a1a1a] pb-3">
                                Agent Proxy Activity
                            </span>
                            <LiveTerminal />
                        </div>
                    </div>
                </section>

                {/* 3. СЕТЬ */}
                <section data-shape="network" className="shape-trigger flex flex-col justify-center min-h-screen py-[120px] pointer-events-none">
                    <div className="w-full max-w-[500px] pointer-events-auto mix-blend-difference">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Connect every microservice.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px] mb-[48px]">
                            Whether you are writing distributed services in Go or enterprise backends in C#. ProxyPulse maps dependencies dynamically, revealing the hidden neural network of your architecture.
                        </p>

                        <div className="flex flex-col gap-[36px]">
                            <div className="flex flex-col gap-[6px]">
                                <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829]">Backend & Frontend</span>
                                <p className="text-[27px] font-[400] leading-[1.0] text-[#ffffff]">Debug APIs instantly.</p>
                            </div>
                            <div className="flex flex-col gap-[6px]">
                                <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#8052ff]">DevOps / Infra</span>
                                <p className="text-[27px] font-[400] leading-[1.0] text-[#bdbdbd]">Monitor proxy layer health.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="relative z-10 w-full max-w-[1440px] mx-auto px-[24px] md:px-[60px] py-[60px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px] border-t border-[#1a1a1a] bg-[#000000]">
                <div className="flex flex-col gap-[16px]">
                    <div className="flex items-center gap-[12px]">
                        <DalaLogo />
                        <span className="text-[24px] font-[400] tracking-[-0.5px] text-[#ffffff]">ProxyPulse</span>
                    </div>
                    <p className="text-[14px] font-[400] text-[#9a9a9a] max-w-[300px]">
                        The observability platform built for high-performance engineering teams.
                    </p>
                </div>
                <div className="flex flex-wrap gap-[48px] text-[14px] font-[600] text-[#9a9a9a] uppercase tracking-[0.35px]">
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
    );
}