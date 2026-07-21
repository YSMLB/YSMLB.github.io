"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// =====================================================================
// DALA DESIGN TOKENS
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
// MASSIVE 1:1 DALA 3D ENGINE (Fibonacci Sphere + Zonal Coloring)
// =====================================================================
const ParticleConstellation = ({ activeShape }: { activeShape: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Retina display support for crispy sharp triangles
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const isMobile = width < 768;

        // Массивное количество частиц для плотной оболочки (как на референсе)
        const TOTAL_PARTICLES = isMobile ? 3000 : 9000;

        // Зональная покраска (как на скрине 155422_2.jpg - кучность цветов)
        const getZonalColor = (x: number, y: number, z: number) => {
            if (x > 80 && y < 0) return tokens.saffronSpark; // Правый верх - желтый
            if (x < -80 && y < 0) return tokens.electricIris; // Левый верх - фиолетовый
            if (y > 100) return tokens.deepVerdant; // Низ - изумрудный
            if (z > 150) return '#e845f2'; // Фронт - маджента
            if (Math.random() > 0.8) return tokens.boneWhite; // Прострелы белого
            // Дефолтная смесь
            const mix = [tokens.electricIris, tokens.saffronSpark, '#45bcf2'];
            return mix[Math.floor(Math.random() * mix.length)];
        };

        const getShapeTarget = (index: number, shape: string) => {
            let x = 0, y = 0, z = 0;

            if (shape === 'brain') {
                // 1. СТВОЛ МОЗГА (Снизу)
                if (index < TOTAL_PARTICLES * 0.08) {
                    const u = Math.random() * Math.PI * 2;
                    const h = Math.random() * 180;
                    const r = 35 - (h * 0.1); // Сужение книзу
                    x = Math.cos(u) * r;
                    y = h + 120;
                    z = Math.sin(u) * r;
                }
                // 2. ПОЛУШАРИЯ (Оболочка с помощью распределения Фибоначчи)
                else {
                    const cortexParticles = TOTAL_PARTICLES * 0.92;
                    const i = index - (TOTAL_PARTICLES * 0.08);

                    const isLeft = i % 2 === 0;
                    const sign = isLeft ? -1 : 1;

                    // Фибоначчи для равномерного покрытия сферы
                    const samples = Math.floor(cortexParticles / 2);
                    const localI = Math.floor(i / 2);
                    const phi = Math.PI * (3 - Math.sqrt(5));

                    const localY = 1 - (localI / (samples - 1)) * 2;
                    const radiusAtY = Math.sqrt(1 - localY * localY);
                    const theta = phi * localI;

                    x = Math.cos(theta) * radiusAtY;
                    y = localY;
                    z = Math.sin(theta) * radiusAtY;

                    // Масштабируем сферу в форму мозга
                    const R = 280; // Огромный размер
                    x *= R; y *= R; z *= R;

                    // Формируем щель (sagittal fissure) и вытягиваем
                    x = (x * 0.75) + (sign * 85);
                    y = y * 0.85 - 40; // Слегка сплющиваем сверху/снизу
                    z = z * 1.15; // Вытягиваем лобную/затылочную доли

                    // Добавляем микро-рельеф (извилины)
                    const noise = Math.sin(x * 0.04) * Math.cos(y * 0.04) * Math.sin(z * 0.04) * 15;
                    x += noise; y += noise; z += noise;
                }
            }
            else if (shape === 'globe') {
                // ПЛОТНАЯ ПЛАНЕТА
                const i = index;
                const phi = Math.PI * (3 - Math.sqrt(5));
                const localY = 1 - (i / (TOTAL_PARTICLES - 1)) * 2;
                const radiusAtY = Math.sqrt(1 - localY * localY);
                const theta = phi * i;

                const R = 320;
                x = Math.cos(theta) * radiusAtY * R;
                y = localY * R;
                z = Math.sin(theta) * radiusAtY * R;

                // Генерация материков
                const noise = Math.sin(x * 0.02) * Math.cos(y * 0.02) + Math.sin(z * 0.03);
                if (noise < -0.2 && Math.random() > 0.1) {
                    // Океан - удаляем частицы к центру, создавая пустоты
                    x *= 0.1; y *= 0.1; z *= 0.1;
                } else {
                    // Материк - выпячиваем
                    x *= 1.05; y *= 1.05; z *= 1.05;
                }
            }
            else if (shape === 'bulb') {
                // ЛАМПОЧКА (Идея)
                if (index < TOTAL_PARTICLES * 0.2) {
                    const u = Math.random() * Math.PI * 2;
                    const h = Math.random() * 140;
                    const r = 70 + Math.sin(h * 0.1) * 10; // Резьба
                    x = Math.cos(u) * r;
                    y = h + 150;
                    z = Math.sin(u) * r;
                } else {
                    const cortexParticles = TOTAL_PARTICLES * 0.8;
                    const i = index - (TOTAL_PARTICLES * 0.2);
                    const phi = Math.PI * (3 - Math.sqrt(5));
                    const localY = 1 - (i / (cortexParticles - 1)) * 2;
                    const radiusAtY = Math.sqrt(1 - localY * localY);
                    const theta = phi * i;

                    const R = 220;
                    x = Math.cos(theta) * radiusAtY * R;
                    y = localY * R - 80;
                    z = Math.sin(theta) * radiusAtY * R;
                }
            }

            // Рандомный отступ для создания "пушистости" оболочки
            return {
                tx: x + (Math.random() - 0.5) * 15,
                ty: y + (Math.random() - 0.5) * 15,
                tz: z + (Math.random() - 0.5) * 15
            };
        };

        if (particlesRef.current.length === 0) {
            for (let i = 0; i < TOTAL_PARTICLES; i++) {
                const target = getShapeTarget(i, 'brain');
                particlesRef.current.push({
                    x: target.tx + (Math.random() - 0.5) * 2000, // Вылет из космоса
                    y: target.ty + (Math.random() - 0.5) * 2000,
                    z: target.tz + (Math.random() - 0.5) * 2000,
                    tx: target.tx,
                    ty: target.ty,
                    tz: target.tz,
                    color: getZonalColor(target.tx, target.ty, target.tz),
                    size: Math.random() * 2.5 + 1.0, // Крупные, четкие
                    angle: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.02
                });
            }
        }

        particlesRef.current.forEach((p, i) => {
            const target = getShapeTarget(i, activeShape);
            p.tx = target.tx;
            p.ty = target.ty;
            p.tz = target.tz;
            // Перекрашиваем под новую форму
            p.color = getZonalColor(target.tx, target.ty, target.tz);
        });

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.003; // Очень медленное, величественное вращение

            // Чистим фон
            ctx.fillStyle = tokens.void;
            ctx.fillRect(0, 0, width, height);

            // Эффект свечения при наложении треугольников
            ctx.globalCompositeOperation = 'screen';

            const centerX = isMobile ? width / 2 : width * 0.72; // Центр смещен вправо
            const centerY = height / 2;
            const FOV = 900; // Меньше искажения перспективы

            const rotY = time * 0.3;
            const rotX = Math.sin(time * 0.2) * 0.1;

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // Сортировка по Z (O(n log n)) нужна для правильного свечения, но бьет по FPS.
            // При screen-наложении мы можем пропустить сортировку и получить шикарный эффект.

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];

                // Лерпинг к форме
                p.x += (p.tx - p.x) * 0.06;
                p.y += (p.ty - p.y) * 0.06;
                p.z += (p.tz - p.z) * 0.06;

                // 3D Трансформация
                let rx = p.x * cosY - p.z * sinY;
                let rz = p.z * cosY + p.x * sinY;
                let ry = p.y * cosX - rz * sinX;
                let finalZ = rz * cosX + p.y * sinX;

                if (finalZ < -FOV + 100) continue; // Отсечение невидимого

                const scale = FOV / (FOV + finalZ);
                const projectedX = centerX + rx * scale;
                const projectedY = centerY + ry * scale;
                const projectedSize = Math.max(0.5, p.size * scale);

                p.angle += p.spin;

                // Рисуем острый треугольник
                ctx.save();
                ctx.translate(projectedX, projectedY);
                ctx.rotate(p.angle);
                ctx.beginPath();
                ctx.moveTo(0, -projectedSize);
                ctx.lineTo(projectedSize * 0.866, projectedSize * 0.5);
                ctx.lineTo(-projectedSize * 0.866, projectedSize * 0.5);
                ctx.closePath();

                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1.2 * scale; // Толщина зависит от глубины

                // Прозрачность зависит от глубины (задние темнее)
                const depthAlpha = Math.max(0.05, Math.min(0.9, scale * 1.5));
                ctx.globalAlpha = depthAlpha;

                ctx.stroke();
                ctx.restore();
            }

            // Возвращаем дефолтный режим
            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [activeShape]);

    return (
        <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
    );
};

// =====================================================================
// LIVE REQUEST TERMINAL (Strict Grid = No Jumping)
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

            <ParticleConstellation activeShape={activeShape} />

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
                    <div className="w-full max-w-[540px] pointer-events-auto">
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

                        <div className="bg-[#000000] border border-[#1a1a1a] rounded-[24px] p-[24px] w-full max-w-[460px]">
                            <span className="text-[12px] font-[600] text-[#15846e] uppercase tracking-[0.35px] mb-[16px] block border-b border-[#1a1a1a] pb-3">
                                Agent Proxy Activity
                            </span>
                            <LiveTerminal />
                        </div>
                    </div>
                </section>

                <section data-shape="bulb" className="shape-trigger flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px] min-h-screen py-[120px] pointer-events-none">
                    <div className="flex-1 w-full pointer-events-auto">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Built for high-performance engineering.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing microservices in Go, building enterprise backends in C#, or deploying edge functions. The proxy agent runs anywhere with less than 10MB memory footprint, surfacing insights immediately.
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
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#15846e]">Mobile Teams</span>
                            <p className="text-[27px] font-[400] leading-[1.0] text-[#bdbdbd]">Track client requests visually.</p>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="relative z-10 w-full max-w-[1280px] mx-auto px-[24px] md:px-[60px] py-[60px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px]">
                <div className="flex items-center gap-[12px] opacity-50">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>

                <div className="flex flex-wrap gap-[30px] text-[14px] font-[400] text-[#9a9a9a]">
                    <Link href="#" className="hover:text-[#ffffff] transition-colors">Twitter</Link>
                    <Link href="#" className="hover:text-[#ffffff] transition-colors">GitHub</Link>
                    <Link href="#" className="hover:text-[#ffffff] transition-colors">LinkedIn</Link>
                </div>
            </footer>
        </div>
    );
}