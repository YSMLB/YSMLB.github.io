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
// PURE WEBGL THREE.JS ENGINE (THE REAL DEAL)
// =====================================================================
const WebGLConstellation = ({ activeShape }: { activeShape: string }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const shapeRef = useRef(activeShape);

    // Синхронизируем стейт реакта с рефом для animation loop
    useEffect(() => {
        shapeRef.current = activeShape;
    }, [activeShape]);

    useEffect(() => {
        if (!mountRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width < 768;

        // 1. НАСТРОЙКА СЦЕНЫ
        const scene = new THREE.Scene();
        // Тот самый эффект "глубины" - частицы вдалеке растворяются во тьме
        scene.fog = new THREE.FogExp2(0x000000, 0.0015);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
        camera.position.z = 850;
        camera.position.x = isMobile ? 0 : -200; // Сдвигаем камеру влево, чтобы объект был справа
        camera.position.y = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // 2. ГЕОМЕТРИЯ (Реальные треугольники)
        const PARTICLE_COUNT = isMobile ? 4000 : 12000;

        // CircleGeometry с 3 сегментами дает ровный треугольник
        const geometry = new THREE.CircleGeometry(1.4, 3);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending // Заставляет их светиться при наложении
        });

        // InstancedMesh позволяет видеокарте рендерить 12к объектов за один вызов
        const instancedMesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
        scene.add(instancedMesh);

        // 3. МАТЕМАТИКА ФОРМ
        const dummy = new THREE.Object3D();
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        const brainPositions: THREE.Vector3[] = [];
        const globePositions: THREE.Vector3[] = [];
        const currentPositions: THREE.Vector3[] = [];
        const rotations: number[] = [];
        const spinSpeeds: number[] = [];

        const colorObj = new THREE.Color();

        // Цветовые зоны (Золотой справа, Фиолетовый слева, Изумрудный снизу)
        const applyZonalColor = (x: number, y: number, z: number, index: number) => {
            if (x > 50 && y < 50) colorObj.setHex(0xffb829); // saffron
            else if (x < -50 && y < 50) colorObj.setHex(0x8052ff); // electric
            else if (y > 80) colorObj.setHex(0x15846e); // verdant
            else if (z > 100) colorObj.setHex(0xe845f2); // magenta
            else if (Math.random() > 0.8) colorObj.setHex(0xffffff); // bone white
            else colorObj.setHex(0x45bcf2);

            colorObj.toArray(colors, index * 3);
            instancedMesh.setColorAt(index, colorObj);
        };

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // ФИБОНАЧЧИ ДЛЯ РАВНОМЕРНОГО ПОКРЫТИЯ СФЕРЫ
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;

            // --- ФОРМА: ПЛАНЕТА ---
            const rGlobe = 280;
            let gx = rGlobe * Math.cos(theta) * Math.sin(phi);
            let gy = rGlobe * Math.cos(phi);
            let gz = rGlobe * Math.sin(theta) * Math.sin(phi);

            // Шум для материков
            const noise = Math.sin(gx * 0.015) * Math.cos(gy * 0.015) + Math.sin(gz * 0.02);
            if (noise < -0.1 && Math.random() > 0.2) {
                gx *= 0.2; gy *= 0.2; gz *= 0.2; // Океанские впадины
            } else {
                gx *= 1.05; gy *= 1.05; gz *= 1.05; // Материки
            }
            globePositions.push(new THREE.Vector3(gx, gy, gz));

            // --- ФОРМА: МОЗГ ---
            const rBrain = 260;
            let bx = rBrain * Math.cos(theta) * Math.sin(phi);
            let by = rBrain * Math.cos(phi);
            let bz = rBrain * Math.sin(theta) * Math.sin(phi);

            // Искажаем сферу в мозг
            const isLeft = bx < 0;
            const sign = isLeft ? -1 : 1;

            bx = (bx * 0.7) + (sign * 60); // Полушария и продольная щель
            by = by * 0.8 - 30; // Приплюснуть сверху и снизу
            bz = bz * 1.1; // Вытянуть лоб и затылок

            // Извилины
            const brainNoise = Math.sin(bx * 0.03) * Math.cos(by * 0.03) * Math.sin(bz * 0.03) * 20;
            bx += brainNoise; by += brainNoise; bz += brainNoise;

            // Добавляем ствол мозга
            if (i < PARTICLE_COUNT * 0.05) {
                const stemH = Math.random() * 150;
                bx = Math.cos(theta) * 25;
                by = stemH + 100;
                bz = Math.sin(theta) * 25;
            }

            brainPositions.push(new THREE.Vector3(bx, by, bz));

            // Начальная позиция - взрыв из центра
            currentPositions.push(new THREE.Vector3(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            ));

            rotations.push(Math.random() * Math.PI * 2);
            spinSpeeds.push((Math.random() - 0.5) * 0.05);

            // Красим по целевой позиции мозга (основная форма)
            applyZonalColor(bx, by, bz, i);
        }

        if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

        // 4. АНИМАЦИОННЫЙ ЦИКЛ
        let time = 0;
        let animationFrameId: number;

        const animate = () => {
            time += 0.002;

            // Медленное вращение всей конструкции
            instancedMesh.rotation.y = time;
            instancedMesh.rotation.x = Math.sin(time * 0.5) * 0.1;

            const targets = shapeRef.current === 'globe' ? globePositions : brainPositions;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const current = currentPositions[i];
                const target = targets[i];

                // Плавное перетекание (Lerp) к целевой форме
                current.x += (target.x - current.x) * 0.04;
                current.y += (target.y - current.y) * 0.04;
                current.z += (target.z - current.z) * 0.04;

                rotations[i] += spinSpeeds[i];

                dummy.position.copy(current);
                dummy.rotation.z = rotations[i];
                // Микро-колебания (дыхание)
                const breathe = Math.sin(time * 10 + i) * 1.5;
                dummy.position.x += breathe;
                dummy.position.y += breathe;

                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }

            instancedMesh.instanceMatrix.needsUpdate = true;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // 5. РЕСАЙЗ
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            camera.position.x = w < 768 ? 0 : -200;
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
        <div
            ref={mountRef}
            className="fixed inset-0 z-0 pointer-events-none bg-[#000000]"
        />
    );
};

// =====================================================================
// LIVE REQUEST TERMINAL (Grid based)
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

            </main>
        </div>
    );
}