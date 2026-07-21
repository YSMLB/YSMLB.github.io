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
// MASSIVE 3D PARTICLE ENGINE (DALA 1:1 STYLE)
// =====================================================================
const ParticleConstellation = ({ activeShape }: { activeShape: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const ambientRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const isMobile = width < 768;

        // Массивное количество частиц для плотности референса
        const TOTAL_PARTICLES = isMobile ? 2500 : 6000;
        const AMBIENT_COUNT = isMobile ? 100 : 300;

        const palette = [tokens.electricIris, tokens.saffronSpark, tokens.deepVerdant, '#ffffff', '#e845f2', '#45bcf2'];

        // Генератор объемных 3D-структур
        const getShapeTarget = (index: number, shape: string) => {
            let x = 0, y = 0, z = 0;

            if (shape === 'brain') {
                // Плотные полусферы мозга с глубоким разделением по центру
                const isLeft = index % 2 === 0;
                const u = Math.random() * Math.PI;
                const v = Math.random() * 2 * Math.PI;
                const r = 180 + Math.pow(Math.random(), 0.4) * 80;
                const sign = isLeft ? -1 : 1;
                x = (r * Math.sin(u) * Math.cos(v)) * 0.7 + (sign * 85);
                y = (r * Math.sin(u) * Math.sin(v)) * 0.95;
                z = r * Math.cos(u) * 0.9;
            }
            else if (shape === 'globe') {
                // Планета с очертаниями континентов
                const u = Math.random() * Math.PI;
                const v = Math.random() * 2 * Math.PI;
                const r = 240;
                const noise = Math.sin(u * 6) * Math.cos(v * 5) + Math.sin(u * 12) * 0.3;
                const elevation = noise > 0.05 ? 25 : 0;
                x = (r + elevation) * Math.sin(u) * Math.cos(v);
                y = (r + elevation) * Math.cos(u);
                z = (r + elevation) * Math.sin(u) * Math.sin(v);
            }
            else if (shape === 'bulb') {
                // Абстрактная лампочка (инсайт / идея)
                const isSphere = Math.random() > 0.3;
                if (isSphere) {
                    const u = Math.random() * Math.PI;
                    const v = Math.random() * 2 * Math.PI;
                    const r = 160 + Math.random() * 20;
                    x = r * Math.sin(u) * Math.cos(v);
                    y = r * Math.cos(u) - 40;
                    z = r * Math.sin(u) * Math.sin(v);
                } else {
                    // Цоколь лампы
                    const v = Math.random() * 2 * Math.PI;
                    const r = 60 + Math.random() * 10;
                    const h = Math.random() * 120;
                    x = r * Math.cos(v);
                    y = h + 110;
                    z = r * Math.sin(v);
                }
            }

            return {
                tx: x + (Math.random() - 0.5) * 8,
                ty: y + (Math.random() - 0.5) * 8,
                tz: z + (Math.random() - 0.5) * 8
            };
        };

        // Инициализация основных частиц
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < TOTAL_PARTICLES; i++) {
                const target = getShapeTarget(i, 'brain');
                particlesRef.current.push({
                    x: target.tx + (Math.random() - 0.5) * 800,
                    y: target.ty + (Math.random() - 0.5) * 800,
                    z: target.tz + (Math.random() - 0.5) * 800,
                    tx: target.tx,
                    ty: target.ty,
                    tz: target.tz,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    size: Math.random() * 2.2 + 0.8,
                    angle: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.04
                });
            }
        }

        // Фоновые пылинки
        if (ambientRef.current.length === 0) {
            for (let i = 0; i < AMBIENT_COUNT; i++) {
                ambientRef.current.push({
                    x: (Math.random() - 0.5) * 1600,
                    y: (Math.random() - 0.5) * 1600,
                    z: (Math.random() - 0.5) * 1600,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    vz: (Math.random() - 0.5) * 0.4,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    size: Math.random() * 1.5 + 0.5,
                    angle: Math.random() * Math.PI * 2
                });
            }
        }

        // Обновляем цели при смене формы скроллом
        particlesRef.current.forEach((p, i) => {
            const target = getShapeTarget(i, activeShape);
            p.tx = target.tx;
            p.ty = target.ty;
            p.tz = target.tz;
        });

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.004;
            ctx.fillStyle = tokens.void;
            ctx.fillRect(0, 0, width, height);

            // Центр модели смещен вправо, чтобы не перекрывать левый текст
            const centerX = isMobile ? width / 2 : width * 0.72;
            const centerY = height / 2;
            const FOV = 700;

            // Плавное вращение модели
            const rotY = time * 0.4;
            const rotX = Math.sin(time * 0.25) * 0.15;

            const renderParticle = (p: any, isAmbient: boolean) => {
                if (!isAmbient) {
                    // Плавное притяжение к целевым координатам формы (интерполяция)
                    p.x += (p.tx - p.x) * 0.05;
                    p.y += (p.ty - p.y) * 0.05;
                    p.z += (p.tz - p.z) * 0.05;
                } else {
                    p.x += p.vx; p.y += p.vy; p.z += p.vz;
                    if (p.x > 800) p.x = -800; else if (p.x < -800) p.x = 800;
                    if (p.y > 800) p.y = -800; else if (p.y < -800) p.y = 800;
                    if (p.z > 800) p.z = -800; else if (p.z < -800) p.z = 800;
                }

                // Матрица 3D вращения
                const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
                const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

                let rx = p.x * cosY - p.z * sinY;
                let rz = p.z * cosY + p.x * sinY;
                let ry = p.y * cosX - rz * sinX;
                let finalZ = rz * cosX + p.y * sinX;

                if (finalZ < -FOV) return;

                const scale = FOV / (FOV + finalZ);
                const projectedX = centerX + rx * scale;
                const projectedY = centerY + ry * scale;
                const projectedSize = Math.max(0.2, p.size * scale);

                ctx.save();
                ctx.translate(projectedX, projectedY);
                ctx.rotate(p.angle + time);
                ctx.beginPath();
                ctx.moveTo(0, -projectedSize);
                ctx.lineTo(projectedSize * 0.866, projectedSize * 0.5);
                ctx.lineTo(-projectedSize * 0.866, projectedSize * 0.5);
                ctx.closePath();

                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;

                const depthAlpha = Math.max(0.1, Math.min(1, scale * 1.3));
                ctx.globalAlpha = isAmbient ? depthAlpha * 0.25 : depthAlpha * 0.85;

                ctx.stroke();
                ctx.restore();
            };

            ambientRef.current.forEach(p => renderParticle(p, true));
            particlesRef.current.forEach(p => renderParticle(p, false));

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

                {/* Секция 1: МОЗГ */}
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

                {/* Секция 2: ПЛАНЕТА / ГЛОБУС */}
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

                {/* Секция 3: ЛАМПОЧКА (ИНСАЙТ / ИДЕЯ) */}
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