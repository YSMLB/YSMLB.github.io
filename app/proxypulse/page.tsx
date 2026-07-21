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
// 3D CANVAS MORPHING ENGINE
// =====================================================================
const ParticleConstellation = ({ activeShape }: { activeShape: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const ambientRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Оптимизация
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const isMobile = width < 768;

        // Увеличиваем плотность для эффекта "дорогого" 3D
        const SHAPE_PARTICLES = isMobile ? 1200 : 3500;
        const AMBIENT_PARTICLES = isMobile ? 150 : 400;

        const colors = [tokens.electricIris, tokens.saffronSpark, tokens.deepVerdant, '#e845f2', '#45bcf2', '#ffffff'];

        // Генератор 3D-форм
        const getShapeTarget = (index: number, total: number, shape: string) => {
            let x = 0, y = 0, z = 0;

            if (shape === 'brain') {
                // Две полусферы с шумом
                const isLeft = index % 2 === 0;
                const u = Math.random() * Math.PI;
                const v = Math.random() * 2 * Math.PI;
                // Более плотная внешняя кора и рыхлая сердцевина
                const r = 100 + Math.pow(Math.random(), 0.5) * 60;
                const sign = isLeft ? -1 : 1;
                x = (r * Math.sin(u) * Math.cos(v)) * 0.75 + (sign * 60);
                y = (r * Math.sin(u) * Math.sin(v)) * 1.1;
                z = r * Math.cos(u) * 0.9;
            }
            else if (shape === 'globe') {
                // Сфера с материками (используем синусоидальный шум)
                let found = false;
                while (!found) {
                    const u = Math.random() * Math.PI;
                    const v = Math.random() * 2 * Math.PI;
                    const r = 160;
                    // Создаем участки высокой плотности (материки)
                    const noise = Math.sin(u * 5) * Math.cos(v * 4) + Math.sin(u * 8) * 0.5;
                    // 85% частиц собираются на "материках", 15% раскиданы по океану
                    if (noise > 0.1 || Math.random() > 0.85) {
                        const depth = noise > 0.2 ? Math.random() * 15 : 0; // Рельеф
                        x = (r + depth) * Math.sin(u) * Math.cos(v);
                        y = (r + depth) * Math.cos(u);
                        z = (r + depth) * Math.sin(u) * Math.sin(v);
                        found = true;
                    }
                }
            }
            else if (shape === 'bulb') {
                // Лампочка: сфера (колба) + цилиндр (цоколь)
                const isBulb = Math.random() > 0.25;
                if (isBulb) {
                    const u = Math.random() * Math.PI;
                    const v = Math.random() * 2 * Math.PI;
                    const r = 110 + Math.random() * 20;
                    x = r * Math.sin(u) * Math.cos(v);
                    y = r * Math.cos(u) - 50; // Сдвиг вверх
                    z = r * Math.sin(u) * Math.sin(v);
                } else {
                    const v = Math.random() * 2 * Math.PI;
                    const r = 40 + Math.random() * 10;
                    const h = Math.random() * 90; // Высота цоколя
                    x = r * Math.cos(v);
                    y = h + 80; // Сдвиг вниз
                    z = r * Math.sin(v);
                }
            }

            // Добавляем микро-отклонения, чтобы форма не была искусственно ровной
            return {
                tx: x + (Math.random() - 0.5) * 10,
                ty: y + (Math.random() - 0.5) * 10,
                tz: z + (Math.random() - 0.5) * 10
            };
        };

        // Инициализация структурных частиц
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < SHAPE_PARTICLES; i++) {
                const startShape = getShapeTarget(i, SHAPE_PARTICLES, 'brain');
                particlesRef.current.push({
                    x: startShape.tx + (Math.random() - 0.5) * 1000, // Появляются из хаоса
                    y: startShape.ty + (Math.random() - 0.5) * 1000,
                    z: startShape.tz + (Math.random() - 0.5) * 1000,
                    tx: startShape.tx,
                    ty: startShape.ty,
                    tz: startShape.tz,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 1.5 + 0.5,
                    angle: Math.random() * Math.PI * 2,
                });
            }
        }

        // Инициализация фоновых (эмбиент) частиц
        if (ambientRef.current.length === 0) {
            for (let i = 0; i < AMBIENT_PARTICLES; i++) {
                ambientRef.current.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: (Math.random() - 0.5) * 2000,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    vz: (Math.random() - 0.5) * 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 2 + 0.5,
                    angle: Math.random() * Math.PI * 2,
                });
            }
        }

        // Обновляем цели при смене формы
        particlesRef.current.forEach((p, i) => {
            const target = getShapeTarget(i, SHAPE_PARTICLES, activeShape);
            p.tx = target.tx;
            p.ty = target.ty;
            p.tz = target.tz;
        });

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.005;
            // Рисуем черный фон (вместо clearRect, чтобы работал альфа-канал без артефактов)
            ctx.fillStyle = tokens.void;
            ctx.fillRect(0, 0, width, height);

            const centerX = isMobile ? width / 2 : width * 0.7; // Визуализация справа на десктопе
            const centerY = height / 2;
            const FOV = 600; // Перспектива

            // Глобальное вращение 3D сцены
            const rotationY = time * 0.5;
            const rotationX = Math.sin(time * 0.3) * 0.2;

            const drawParticle = (p: any, isAmbient: boolean) => {
                // 1. Применяем лерпинг к целевой позиции (только для структурных частиц)
                if (!isAmbient) {
                    p.x += (p.tx - p.x) * 0.04;
                    p.y += (p.ty - p.y) * 0.04;
                    p.z += (p.tz - p.z) * 0.04;
                } else {
                    p.x += p.vx; p.y += p.vy; p.z += p.vz;
                    // Возврат в границы
                    if (p.x > 1000) p.x = -1000; else if (p.x < -1000) p.x = 1000;
                    if (p.y > 1000) p.y = -1000; else if (p.y < -1000) p.y = 1000;
                    if (p.z > 1000) p.z = -1000; else if (p.z < -1000) p.z = 1000;
                }

                // 2. 3D Вращение (по оси Y и X)
                const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
                const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);

                let rx = p.x * cosY - p.z * sinY;
                let rz = p.z * cosY + p.x * sinY;

                let ry = p.y * cosX - rz * sinX;
                let finalZ = rz * cosX + p.y * sinX;

                // 3. Проекция 3D -> 2D
                if (finalZ < -FOV) return; // Отсекаем то, что за камерой
                const scale = FOV / (FOV + finalZ);
                const projectedX = centerX + rx * scale;
                const projectedY = centerY + ry * scale;
                const projectedSize = Math.max(0.1, p.size * scale);

                // Отрисовка треугольника
                ctx.save();
                ctx.translate(projectedX, projectedY);
                ctx.rotate(p.angle + time); // Частицы вращаются вокруг своей оси
                ctx.beginPath();
                ctx.moveTo(0, -projectedSize);
                ctx.lineTo(projectedSize * 0.866, projectedSize * 0.5);
                ctx.lineTo(-projectedSize * 0.866, projectedSize * 0.5);
                ctx.closePath();

                ctx.strokeStyle = p.color;
                ctx.lineWidth = isAmbient ? 0.5 : 1;

                // Эффект глубины и затухания
                const depthAlpha = Math.max(0, Math.min(1, scale * 1.2));
                ctx.globalAlpha = isAmbient ? depthAlpha * 0.3 : depthAlpha * 0.8;

                ctx.stroke();
                ctx.restore();
            };

            // Рендерим все частицы. Сортировка по Z для идеального наложения бьет по FPS, 
            // поэтому полагаемся на аддитивный/естественный блендинг
            ambientRef.current.forEach(p => drawParticle(p, true));
            particlesRef.current.forEach(p => drawParticle(p, false));

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
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
// LIVE REQUEST TERMINAL (Strict Grid)
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
                        // Жесткая сетка - ни один пиксель не сместится
                        className="grid grid-cols-[45px_1fr_40px_50px] gap-4 items-center h-8"
                    >
                        <span className={`font-[600] text-left ${req.method === 'GET' ? 'text-[#8052ff]' : req.method === 'POST' ? 'text-[#15846e]' : req.method === 'DEL' ? 'text-[#e845f2]' : 'text-[#ffb829]'}`}>
                            {req.method}
                        </span>

                        <span className="text-[#ffffff] truncate">
                            {req.path}
                        </span>

                        <span className={`font-[600] text-right ${req.status >= 500 ? 'text-[#e845f2]' : req.status >= 400 ? 'text-[#ffb829]' : 'text-[#15846e]'}`}>
                            {req.status}
                        </span>

                        <span className="text-right tabular-nums">
                            {req.time}
                        </span>
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
        }, { threshold: 0.5 });

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
                        Deploy Agent
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1280px] mx-auto px-[24px] md:px-[60px]">

                {/* Секция 1: МОЗГ */}
                <section data-shape="brain" className="shape-trigger flex flex-col justify-center min-h-screen pt-[120px] pb-[120px] pointer-events-none">
                    <div className="w-full max-w-[600px] pointer-events-auto">
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

                {/* Секция 2: ГЛОБУС С МАТЕРИКАМИ */}
                <section data-shape="globe" className="shape-trigger flex flex-col justify-center min-h-screen py-[120px] pointer-events-none">
                    <div className="w-full max-w-[520px] pointer-events-auto">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Global traffic layer.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] mb-[48px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive map. See where your requests are bottlenecking geographically.
                        </p>

                        <div className="bg-[#000000] border border-[#1a1a1a] rounded-[24px] p-[30px] w-full max-w-[480px]">
                            <span className="text-[12px] font-[600] text-[#15846e] uppercase tracking-[0.35px] mb-[18px] block border-b border-[#1a1a1a] pb-4">
                                Agent Proxy Activity
                            </span>
                            <LiveTerminal />
                        </div>
                    </div>
                </section>

                {/* Секция 3: ЛАМПОЧКА (Идея/Инсайт) */}
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