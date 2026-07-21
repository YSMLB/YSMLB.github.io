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
    deepVerdant: "#15846e"
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
// PURE WEBGL THREE.JS ENGINE (VOLUMETRIC & DEEP)
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
        // Густой туман для создания глубокого фона
        scene.fog = new THREE.FogExp2(0x000000, 0.0012);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
        camera.position.z = 900;
        camera.position.x = isMobile ? 0 : -250;
        camera.position.y = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const PARTICLE_COUNT = isMobile ? 5000 : 15000;
        const AMBIENT_COUNT = isMobile ? 500 : 2000; // Для глубины

        const geometry = new THREE.CircleGeometry(1.6, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        // Основная сетка для форм
        const instancedMesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
        // Фоновая сетка для глубины
        const ambientMesh = new THREE.InstancedMesh(geometry, material, AMBIENT_COUNT);

        scene.add(instancedMesh);
        scene.add(ambientMesh);

        // Массивы целей для трансформации
        const targets = {
            brain: { pos: [] as THREE.Vector3[], scale: [] as number[] },
            globe: { pos: [] as THREE.Vector3[], scale: [] as number[] },
            network: { pos: [] as THREE.Vector3[], scale: [] as number[] }
        };

        const currentPositions: THREE.Vector3[] = [];
        const currentScales: number[] = [];
        const rotations: number[] = [];
        const spinSpeeds: number[] = [];
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const colorObj = new THREE.Color();
        const dummy = new THREE.Object3D();

        const applyZonalColor = (x: number, y: number, z: number, index: number) => {
            if (x > 50 && y < 50) colorObj.setHex(0xffb829);
            else if (x < -50 && y < 50) colorObj.setHex(0x8052ff);
            else if (y > 80) colorObj.setHex(0x15846e);
            else if (z > 100) colorObj.setHex(0xe845f2);
            else if (Math.random() > 0.8) colorObj.setHex(0xffffff);
            else colorObj.setHex(0x45bcf2);

            colorObj.toArray(colors, index * 3);
            instancedMesh.setColorAt(index, colorObj);
        };

        // ГЕНЕРАЦИЯ УЗЛОВ ДЛЯ СЕТИ (Spider-Verse)
        const networkNodes: THREE.Vector3[] = [];
        for (let j = 0; j < 15; j++) {
            networkNodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600
            ));
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);

            // --- 1. МОЗГ (ЗАПОЛНЕННЫЙ ОБЪЕМ) ---
            // Кубический корень дает равномерное распределение ВНУТРИ сферы
            const rVolume = Math.cbrt(Math.random()) * 260;

            let bx = rVolume * Math.cos(theta) * Math.sin(phi);
            let by = rVolume * Math.cos(phi);
            let bz = rVolume * Math.sin(theta) * Math.sin(phi);

            const isLeft = bx < 0;
            const sign = isLeft ? -1 : 1;

            bx = (bx * 0.75) + (sign * 70); // Щель между полушариями
            by = by * 0.85; // Сплющиваем
            bz = bz * 1.15; // Вытягиваем

            // Ствол мозга - ИДЕТ ВНИЗ
            if (i < PARTICLE_COUNT * 0.08) {
                const stemH = Math.random() * 160;
                const stemR = 25 - (stemH * 0.1);
                bx = Math.cos(theta) * stemR;
                by = -140 - stemH; // Минус Y = ствол направлен вниз
                bz = Math.sin(theta) * stemR;
            }

            targets.brain.pos.push(new THREE.Vector3(bx, by, bz));
            targets.brain.scale.push(1.0);

            // --- 2. ПЛАНЕТА (С КОНТИНЕНТАМИ И ВОДОЙ-ТОЧКАМИ) ---
            const rGlobe = 300;
            let gx = rGlobe * Math.cos(theta) * Math.sin(phi);
            let gy = rGlobe * Math.cos(phi);
            let gz = rGlobe * Math.sin(theta) * Math.sin(phi);

            const noise = Math.sin(gx * 0.015) * Math.cos(gy * 0.015) + Math.sin(gz * 0.02);
            let gScale = 1.0;

            if (noise < -0.15) {
                // Вода: треугольник схлопывается в крошечную точку
                gScale = 0.15;
            } else {
                // Материк: треугольник обычного размера
                gScale = 1.0 + (Math.random() * 0.5);
                gx *= 1.02; gy *= 1.02; gz *= 1.02; // Слегка выпуклые
            }

            targets.globe.pos.push(new THREE.Vector3(gx, gy, gz));
            targets.globe.scale.push(gScale);

            // --- 3. SPIDER-VERSE (СЕТЬ) ---
            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const distFromNode = Math.random(); // 0 = в центре узла, 1 = на краю нити

            let nx = targetNode.x + (Math.random() - 0.5) * 200 * distFromNode;
            let ny = targetNode.y + (Math.random() - 0.5) * 200 * distFromNode;
            let nz = targetNode.z + (Math.random() - 0.5) * 200 * distFromNode;

            targets.network.pos.push(new THREE.Vector3(nx, ny, nz));
            targets.network.scale.push(distFromNode < 0.2 ? 2.0 : 0.6); // Узлы крупнее, нити мельче

            // --- ИНИЦИАЛИЗАЦИЯ ---
            currentPositions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 2500,
                (Math.random() - 0.5) * 2500,
                (Math.random() - 0.5) * 2500
            ));
            currentScales.push(0.0);
            rotations.push(Math.random() * Math.PI * 2);
            spinSpeeds.push((Math.random() - 0.5) * 0.04);

            applyZonalColor(bx, by, bz, i);
        }

        if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

        // ГЕНЕРАЦИЯ ЭМБИЕНТА (ГЛУБИНА)
        const ambientSpeeds: THREE.Vector3[] = [];
        for (let i = 0; i < AMBIENT_COUNT; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );
            dummy.rotation.z = Math.random() * Math.PI;
            dummy.scale.setScalar(Math.random() * 0.8 + 0.2);
            dummy.updateMatrix();
            ambientMesh.setMatrixAt(i, dummy.matrix);

            // Цвета для фона (более тусклые)
            colorObj.setHex(Math.random() > 0.5 ? 0x8052ff : 0x15846e);
            ambientMesh.setColorAt(i, colorObj);

            ambientSpeeds.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ));
        }
        if (ambientMesh.instanceColor) ambientMesh.instanceColor.needsUpdate = true;

        let time = 0;
        let animationFrameId: number;

        const animate = () => {
            time += 0.002;

            // Вращение сцены
            instancedMesh.rotation.y = time;
            instancedMesh.rotation.x = Math.sin(time * 0.5) * 0.15;

            ambientMesh.rotation.y = time * 0.5;

            const activeTargets = shapeRef.current === 'globe' ? targets.globe :
                shapeRef.current === 'network' ? targets.network : targets.brain;

            // Анимация основных частиц
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const current = currentPositions[i];
                const tPos = activeTargets.pos[i];
                const tScale = activeTargets.scale[i];

                current.x += (tPos.x - current.x) * 0.04;
                current.y += (tPos.y - current.y) * 0.04;
                current.z += (tPos.z - current.z) * 0.04;

                currentScales[i] += (tScale - currentScales[i]) * 0.05;
                rotations[i] += spinSpeeds[i];

                dummy.position.copy(current);
                dummy.rotation.z = rotations[i];
                dummy.scale.setScalar(Math.max(0.01, currentScales[i]));

                const breathe = Math.sin(time * 15 + i) * 1.2;
                dummy.position.x += breathe;

                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;

            // Анимация глубины (Эмбиент)
            for (let i = 0; i < AMBIENT_COUNT; i++) {
                ambientMesh.getMatrixAt(i, dummy.matrix);
                dummy.position.setFromMatrixPosition(dummy.matrix);

                dummy.position.add(ambientSpeeds[i]);
                if (dummy.position.x > 1500) dummy.position.x = -1500;
                if (dummy.position.y > 1500) dummy.position.y = -1500;
                if (dummy.position.z > 1500) dummy.position.z = -1500;

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
            camera.position.x = w < 768 ? 0 : -250;
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
        <div className="bg-transparent text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-[#ffffff] overflow-x-hidden relative">

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

            <main className="relative z-10 max-w-[1280px] mx-auto px-[24px] md:px-[60px]">

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
                    <div className="w-full max-w-[500px] pointer-events-auto">
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

                {/* 3. СЕТЬ (SPIDER-VERSE) */}
                <section data-shape="network" className="shape-trigger flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px] min-h-screen py-[120px] pointer-events-none">
                    <div className="flex-1 w-full pointer-events-auto">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Connect every microservice.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing distributed services in Go or enterprise backends in C#. ProxyPulse maps dependencies dynamically, revealing the hidden neural network of your architecture.
                        </p>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-[48px] pointer-events-auto">
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829]">Backend & Frontend</span>
                            <p className="text-[27px] font-[400] leading-[1.0] text-[#ffffff]">Debug APIs instantly.</p>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#8052ff]">DevOps / Infra</span>
                            <p className="text-[27px] font-[400] leading-[1.0] text-[#bdbdbd]">Monitor proxy layer health.</p>
                        </div>
                    </div>
                </section>

            </main>

            {/* ВЕРНУЛ ПОДВАЛ */}
            <footer className="relative z-10 w-full max-w-[1280px] mx-auto px-[24px] md:px-[60px] py-[60px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px] border-t border-[#1a1a1a]">
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