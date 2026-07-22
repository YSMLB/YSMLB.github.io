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
// PURE WEBGL THREE.JS ENGINE (1:1 DALA ACCURACY)
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
        // Глубокий туман
        scene.fog = new THREE.FogExp2(0x000000, 0.0012);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
        camera.position.z = 900;
        camera.position.x = isMobile ? 0 : -250;
        camera.position.y = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const PARTICLE_COUNT = isMobile ? 6000 : 12000;
        const AMBIENT_COUNT = isMobile ? 800 : 2500;

        // Чуть ярче, чем "тусклый", но не слепит (размер 1.8, opacity 0.8)
        const geometry = new THREE.CircleGeometry(1.8, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending // Создает эффект свечения в скоплениях
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
        const spinSpeeds: number[] = [];
        const dummy = new THREE.Object3D();
        const tempColor = new THREE.Color();

        // Тот самый фрактальный шум для планеты (твоя рабочая функция)
        const fbm = (x: number, y: number, z: number) => {
            return Math.sin(x * 0.012 + Math.cos(y * 0.012)) + Math.sin(y * 0.015 + z * 0.01) + Math.cos(z * 0.01 + x * 0.015);
        };

        const networkNodes: THREE.Vector3[] = [];
        for (let j = 0; j < 20; j++) {
            networkNodes.push(new THREE.Vector3(
                (Math.random() - 0.5) * 700,
                (Math.random() - 0.5) * 500,
                (Math.random() - 0.5) * 500
            ));
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // ==========================================
            // 1. ФОРМА: МОЗГ (ПОЛАЯ СКОРЛУПА + ИЗВИЛИНЫ)
            // ==========================================
            let bx = 0, by = 0, bz = 0;
            let foundBrain = false;
            let bAttempts = 0;

            // Rejection Sampling: ищем точки только на "хребтах" полого эллипсоида
            while (!foundBrain && bAttempts < 150) {
                let x = (Math.random() - 0.5) * 320;
                let y = (Math.random() - 0.5) * 280 + 20;
                let z = (Math.random() - 0.5) * 300;

                // Разрез по центру (Fissure)
                if (Math.abs(x) < 8) { bAttempts++; continue; }

                const isLeft = x < 0;
                const sign = isLeft ? -1 : 1;
                const cx = x - sign * 25; // Сдвигаем полушария
                const cy = y;
                const cz = z;

                // Уравнение эллипсоида (радиусы: 95, 115, 135)
                const dist = Math.sqrt((cx * cx) / (95 * 95) + (cy * cy) / (115 * 115) + (cz * cz) / (135 * 135));

                // Условие пустого мозга: берем только скорлупу от 0.85 до 1.0
                if (dist > 0.85 && dist < 1.0) {
                    // Высокочастотный шум формирует борозды (gyri)
                    const freq = 0.06;
                    const fold = Math.sin(x * freq) * Math.cos(y * freq) + Math.sin(z * freq) * Math.cos(x * freq);
                    if (Math.abs(fold) > 0.35 || dist > 0.96) {
                        bx = x; by = y; bz = z; foundBrain = true;
                    }
                }

                // Условие для ствола (Stem) внизу
                if (!foundBrain && y < -50 && y > -160 && Math.abs(x) < 20 && Math.abs(z) < 25) {
                    const taper = 1.0 - Math.abs(y + 50) / 110;
                    if (Math.sqrt(x * x + z * z) < 20 * taper) {
                        bx = x; by = y; bz = z; foundBrain = true;
                    }
                }
                bAttempts++;
            }

            // Фолбэк на ствол, если за 150 попыток точка не нашлась (штучные случаи)
            if (!foundBrain) {
                bx = (Math.random() - 0.5) * 10;
                by = -150;
                bz = (Math.random() - 0.5) * 10;
            }

            targets.brain.pos.push(new THREE.Vector3(bx, by, bz));

            // ==========================================
            // 2. ФОРМА: ПЛАНЕТА (Твой идеальный рабочий код)
            // ==========================================
            let gx = 0, gy = 0, gz = 0;
            let isValidGlobe = false;
            let gAttempts = 0;

            while (!isValidGlobe && gAttempts < 50) {
                const u = Math.random() * Math.PI * 2;
                const v = Math.acos(2.0 * Math.random() - 1.0);
                const rGlobe = 290;

                gx = rGlobe * Math.sin(v) * Math.cos(u);
                gy = rGlobe * Math.cos(v);
                gz = rGlobe * Math.sin(v) * Math.sin(u);

                const n = fbm(gx, gy, gz);
                if (n > 0.4) {
                    isValidGlobe = true;
                } else if (Math.random() > 0.98) {
                    isValidGlobe = true;
                }
                gAttempts++;
            }
            targets.globe.pos.push(new THREE.Vector3(gx, gy, gz));

            // ==========================================
            // 3. ФОРМА: СЕТЬ (Spider-Verse)
            // ==========================================
            const targetNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            const netDist = Math.random();

            let nx = targetNode.x + (Math.random() - 0.5) * 250 * netDist;
            let ny = targetNode.y + (Math.random() - 0.5) * 250 * netDist;
            let nz = targetNode.z + (Math.random() - 0.5) * 250 * netDist;
            targets.network.pos.push(new THREE.Vector3(nx, ny, nz));

            // ==========================================
            // ИНИЦИАЛИЗАЦИЯ
            // ==========================================
            currentPositions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 2500,
                (Math.random() - 0.5) * 2500,
                (Math.random() - 0.5) * 2500
            ));
            rotations.push(Math.random() * Math.PI * 2);
            spinSpeeds.push((Math.random() - 0.5) * 0.04);
        }

        // Эмбиентные частицы на фоне
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

            tempColor.setHex(Math.random() > 0.5 ? 0x8052ff : 0x15846e);
            ambientMesh.setColorAt(i, tempColor);

            ambientSpeeds.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.6,
                (Math.random() - 0.5) * 0.6,
                (Math.random() - 0.5) * 0.6
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

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const current = currentPositions[i];
                const tPos = activeTargets.pos[i];

                current.x += (tPos.x - current.x) * 0.04;
                current.y += (tPos.y - current.y) * 0.04;
                current.z += (tPos.z - current.z) * 0.04;

                rotations[i] += spinSpeeds[i];

                dummy.position.copy(current);
                dummy.rotation.z = rotations[i];

                const breathe = Math.sin(time * 15 + i) * 1.5;
                dummy.position.x += breathe;

                // Точное раскрашивание по зонам как на референсе
                let cx = dummy.position.x;
                let cy = dummy.position.y;
                let cz = dummy.position.z;

                if (cy < -60 && Math.abs(cx) < 40) {
                    tempColor.setHex(0x45bcf2); // Ствол - синий
                } else if (cy > 70) {
                    tempColor.setHex(0x15846e); // Верх - изумрудный
                } else if (cx < -5) {
                    tempColor.setHex(0xffb829); // Лево - золотой
                } else if (cx > 5) {
                    // Право - белые и фиолетовые
                    if (cz > 40) tempColor.setHex(0x8052ff);
                    else tempColor.setHex(0xffffff);
                } else {
                    tempColor.setHex(0x8052ff);
                }

                // Редкие белые вспышки
                if (i % 15 === 0) tempColor.setHex(0xffffff);

                instancedMesh.setColorAt(i, tempColor);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

            // Анимация глубины
            for (let i = 0; i < AMBIENT_COUNT; i++) {
                ambientMesh.getMatrixAt(i, dummy.matrix);
                dummy.position.setFromMatrixPosition(dummy.matrix);

                dummy.position.add(ambientSpeeds[i]);
                if (dummy.position.x > 1500) dummy.position.x = -1500;
                else if (dummy.position.x < -1500) dummy.position.x = 1500;
                if (dummy.position.y > 1500) dummy.position.y = -1500;
                else if (dummy.position.y < -1500) dummy.position.y = 1500;
                if (dummy.position.z > 1500) dummy.position.z = -1500;
                else if (dummy.position.z < -1500) dummy.position.z = 1500;

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

            <footer className="relative z-10 w-full max-w-[1280px] mx-auto px-[24px] md:px-[60px] py-[60px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px] border-t border-[#1a1a1a] bg-[#000000]">
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