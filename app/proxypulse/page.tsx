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
// CANVAS MORPHING ENGINE
// =====================================================================
const ParticleConstellation = ({ activeShape }: { activeShape: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const isMobile = width < 768;
        const particleCount = isMobile ? 300 : 800; // Плотный рой частиц
        const colors = [tokens.electricIris, tokens.saffronSpark, tokens.deepVerdant, '#e845f2', '#45bcf2', '#ffffff'];

        // Инициализация частиц, если они еще не созданы
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    targetX: width / 2,
                    targetY: height / 2,
                    baseX: 0,
                    baseY: 0,
                    size: Math.random() * 2.5 + 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    angle: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.05,
                    wobbleSpeed: Math.random() * 0.05 + 0.01,
                    wobbleOffset: Math.random() * Math.PI * 2
                });
            }
        }

        const particles = particlesRef.current;
        const centerX = isMobile ? width / 2 : width * 0.7; // Смещаем центры вправо для десктопа
        const centerY = height / 2;

        // Генерация целевых координат в зависимости от активной секции
        particles.forEach((p, i) => {
            let tx = centerX;
            let ty = centerY;

            if (activeShape === 'brain') {
                // Две полусферы
                const isLeft = i % 2 === 0;
                const radiusX = (Math.random() * 150) + 50;
                const radiusY = (Math.random() * 200) + 50;
                const angle = Math.random() * Math.PI * 2;
                const xOffset = isLeft ? -90 : 90;
                tx = centerX + xOffset + Math.cos(angle) * radiusX;
                ty = centerY + Math.sin(angle) * radiusY;
            }
            else if (activeShape === 'globe') {
                // Сфера с концентрацией к краям
                const radius = 250;
                const r = radius * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                tx = centerX + r * Math.cos(theta);
                ty = centerY + r * Math.sin(theta);
            }
            else if (activeShape === 'cross') {
                // Х-образная геометрия
                const arm = i % 4;
                const distance = Math.random() * 250;
                const spread = (Math.random() - 0.5) * 40;
                if (arm === 0) { tx = centerX + distance; ty = centerY + distance + spread; }
                if (arm === 1) { tx = centerX - distance; ty = centerY - distance + spread; }
                if (arm === 2) { tx = centerX + distance; ty = centerY - distance + spread; }
                if (arm === 3) { tx = centerX - distance; ty = centerY + distance + spread; }
            }

            // Добавляем немного случайного разлета, чтобы форма не была слишком жесткой
            p.baseX = tx + (Math.random() - 0.5) * 30;
            p.baseY = ty + (Math.random() - 0.5) * 30;
        });

        let animationFrameId: number;

        const animate = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                // Легкое дрожание на месте (wobble)
                const wobbleX = Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * 15;
                const wobbleY = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 15;

                // Плавное перетекание (Lerp) к целевой позиции + дрожание
                p.x += ((p.baseX + wobbleX) - p.x) * 0.03;
                p.y += ((p.baseY + wobbleY) - p.y) * 0.03;
                p.angle += p.rotationSpeed;

                // Рисуем ТОЛЬКО треугольники (без линий связи)
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.lineTo(p.size * 0.866, p.size * 0.5);
                ctx.lineTo(-p.size * 0.866, p.size * 0.5);
                ctx.closePath();

                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;
                // Чем ближе частица к центру экрана, тем она ярче
                const distToCenter = Math.sqrt(Math.pow(p.x - width / 2, 2) + Math.pow(p.y - height / 2, 2));
                ctx.globalAlpha = Math.max(0.2, 1 - (distToCenter / (width * 0.8)));

                ctx.stroke();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Триггерим пересчет позиций
            setActiveShape(activeShape);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [activeShape]); // Перезапускаем расчет при смене формы

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
                // Держим ровно 7 строк, чтобы контейнер не прыгал
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
                        key={`${req.path}-${i}-${Date.now()}`} // Уникальный ключ для анимации
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.12, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        // ЖЕСТКИЙ GRID: колонки зафиксированы, текст обрезается, высота h-8
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

    // Настраиваем IntersectionObserver для отслеживания секций на экране
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const shape = entry.target.getAttribute('data-shape');
                    if (shape) setActiveShape(shape);
                }
            });
        }, { threshold: 0.5 }); // Срабатывает, когда секция на 50% в экране

        const sections = document.querySelectorAll('.shape-trigger');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    return (
        <div className="bg-[#000000] text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-[#ffffff] overflow-x-hidden relative">

            {/* Глобальный канвас на фоне, меняет форму в зависимости от activeShape */}
            <ParticleConstellation activeShape={activeShape} />

            <nav className="fixed top-0 left-0 w-full z-50 py-[24px] px-[24px] md:px-[60px] flex justify-between items-center mix-blend-difference">
                <div className="flex items-center gap-[12px]">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#manifesto" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#team" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#blog" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">GitHub</Link>
                </div>
                <div className="flex items-center">
                    <button className="bg-[#8052ff] text-[#ffffff] text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[16px] py-[14.4px] hover:bg-[#6c40e6] transition-colors">
                        Request Access
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1280px] mx-auto px-[24px] md:px-[60px]">

                {/* HERO SECTION -> Форма МОЗГА */}
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

                {/* FEATURE 1 -> Форма ГЛОБУСА */}
                <section data-shape="globe" className="shape-trigger flex flex-col justify-center min-h-[80vh] py-[120px] pointer-events-none">
                    <div className="w-full max-w-[520px] pointer-events-auto">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Beyond raw logs.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] mb-[48px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive layer. Select a request, inspect headers, and replay it with one click.
                        </p>

                        {/* Жестко зафиксированный терминал логов */}
                        <div className="bg-[#000000] border border-[#1a1a1a] rounded-[24px] p-[30px] w-full max-w-[480px] backdrop-blur-sm">
                            <span className="text-[12px] font-[600] text-[#15846e] uppercase tracking-[0.35px] mb-[18px] block border-b border-[#1a1a1a] pb-4">
                                Agent Proxy Activity
                            </span>
                            <LiveTerminal />
                        </div>
                    </div>
                </section>

                {/* FEATURE 2 -> Форма КРЕСТА/ЛОГО */}
                <section data-shape="cross" className="shape-trigger flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px] min-h-[80vh] py-[120px] pointer-events-none">
                    <div className="flex-1 w-full pointer-events-auto">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Built for high-performance engineering.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing microservices in Go, building enterprise backends in C#, or deploying edge functions. The proxy agent runs anywhere with less than 10MB memory footprint.
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