"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// =====================================================================
// DALA STYLE CONFIG & TOKENS
// =====================================================================
const theme = {
    void: "#000000",
    boneWhite: "#ffffff",
    ashGray: "#9a9a9a",
    silverMist: "#bdbdbd",
    electricIris: "#8052ff",
    saffronSpark: "#ffb829",
    deepVerdant: "#15846e"
};

// =====================================================================
// ICONS (Custom SVG for zero dependencies)
// =====================================================================
const DalaLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L22 20H2L12 2Z" fill="url(#paint0_linear)" />
        <defs>
            <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8052ff" />
                <stop offset="1" stopColor="#15846e" />
            </linearGradient>
        </defs>
    </svg>
);

const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);

// =====================================================================
// CANVAS PARTICLE ENGINE (Constellation / Network Brain)
// =====================================================================
const ParticleConstellation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = window.innerWidth > 768 ? 150 : 60;
        const colors = [theme.electricIris, theme.saffronSpark, theme.deepVerdant, '#e845f2', '#45bcf2'];

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number; color: string; angle: number; speed: number;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 4 + 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (Math.random() - 0.5) * 0.02;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.speed;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size * 0.866, this.size * 0.5);
                ctx.lineTo(-this.size * 0.866, this.size * 0.5);
                ctx.closePath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw network connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(128, 82, 255, ${1 - distance / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
    );
};

// =====================================================================
// LIVE REQUEST MOCK (Backend Dev Reality)
// =====================================================================
const liveRequests = [
    { method: "GET", path: "/api/v1/golang-proxy/health", status: 200, time: "12ms", size: "1.2kb" },
    { method: "POST", path: "/auth/csharp/login", status: 201, time: "45ms", size: "340b" },
    { method: "GET", path: "/ws/stream/events", status: 101, time: "0ms", size: "0b" },
    { method: "PUT", path: "/api/users/update_profile", status: 400, time: "89ms", size: "45b" },
    { method: "DELETE", path: "/cache/redis/flush", status: 204, time: "5ms", size: "0b" },
    { method: "GET", path: "/api/metrics/prometheus", status: 200, time: "112ms", size: "4.5kb" },
    { method: "POST", path: "/go-microservice/upload", status: 500, time: "1204ms", size: "8kb" },
];

const LiveTerminal = () => {
    const [requests, setRequests] = useState<typeof liveRequests>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = liveRequests[index % liveRequests.length];
                index++;
                return [newReq, ...prev].slice(0, 5);
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full font-mono text-sm tracking-tight flex flex-col gap-3 relative z-10">
            <AnimatePresence>
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1 - i * 0.15, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <span className={`w-12 font-bold ${req.method === 'GET' ? 'text-[#8052ff]' : req.method === 'POST' ? 'text-[#15846e]' : req.method === 'DELETE' ? 'text-red-500' : 'text-[#ffb829]'}`}>
                                {req.method}
                            </span>
                            <span className="text-white group-hover:text-[#8052ff] transition-colors">{req.path}</span>
                        </div>
                        <div className="flex items-center gap-6 text-[#9a9a9a]">
                            <span className={`font-bold ${req.status >= 500 ? 'text-red-500' : req.status >= 400 ? 'text-[#ffb829]' : 'text-[#15846e]'}`}>{req.status}</span>
                            <span className="w-12 text-right">{req.time}</span>
                            <span className="w-12 text-right hidden sm:block">{req.size}</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="mt-8 flex gap-4 border-t border-[#333] pt-4 opacity-50">
                <span className="text-[#ffb829] animate-pulse">● Listening on port 8080</span>
                <span>Intercepting 4 active connections</span>
            </div>
        </div>
    );
};

// =====================================================================
// MAIN LAYOUT
// =====================================================================
export default function ProxyPulse() {
    return (
        <div className="bg-[#000000] text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-white overflow-hidden">

            {/* Background Particle Engine */}
            <ParticleConstellation />

            {/* NAVIGATION (No border, pure transparency) */}
            <nav className="fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
                <div className="flex items-center gap-3">
                    <DalaLogo />
                    <span className="text-[14px] font-bold tracking-[0.025em] text-white">ProxyPulse</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#how-it-works" className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#pricing" className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="https://github.com" target="_blank" className="text-[#9a9a9a] hover:text-[#ffffff] transition-colors hidden sm:block">
                        <GithubIcon />
                    </Link>
                    <button className="bg-[#8052ff] text-white text-[14px] font-semibold uppercase tracking-[0.025em] rounded-[24px] px-[16px] py-[10px] hover:bg-[#6c40e6] transition-colors">
                        Start Agent
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 pt-40 pb-32">

                {/* HERO SECTION (2-Column Asymmetric) */}
                <section className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32 min-h-[70vh]">
                    <div className="flex-1 w-full flex flex-col items-start z-20">
                        <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-6">
                            Network Observability, Reimagined.
                        </span>

                        <h1 className="text-[56px] md:text-[78px] lg:text-[113px] font-normal leading-[1.0] tracking-[-2px] md:tracking-[-3.12px] lg:tracking-[-4.52px] mb-8 w-full max-w-[800px]">
                            See your <br className="hidden md:block" />
                            network. Live.
                        </h1>

                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[480px] mb-12">
                            Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                        </p>

                        <div className="flex items-center gap-6">
                            <button className="bg-[#8052ff] text-white text-[14px] font-semibold uppercase tracking-[0.025em] rounded-[24px] px-[24px] py-[16px] flex items-center gap-2 hover:bg-[#6c40e6] transition-all">
                                Deploy Proxy
                                <ArrowRight />
                            </button>
                            <button className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                                View Docs
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full z-20">
                        {/* Abstract Mockup / Floating Text block instead of a bulky card */}
                        <div className="pl-0 lg:pl-12">
                            <p className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#8052ff] mb-6">Live Stream / Agent 0.4.1</p>
                            <LiveTerminal />
                        </div>
                    </div>
                </section>

                {/* FEATURE 1: Visual Left, Text Right */}
                <section className="mt-[160px] flex flex-col-reverse lg:flex-row items-center gap-20 lg:gap-32">
                    <div className="flex-1 w-full font-mono text-[14px] leading-relaxed text-[#9a9a9a] flex flex-col gap-4">
                        <div className="flex gap-4">
                            <span className="text-[#ffb829]">01</span>
                            <p>Intercepting internal traffic...</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[#8052ff]">02</span>
                            <p>Analyzing latency & throughput distribution</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[#15846e]">03</span>
                            <p className="text-[#ffffff]">Identified 42 bottlenecks in /api/v1/metrics</p>
                        </div>
                        <div className="w-full h-[1px] bg-gradient-to-r from-[#8052ff] to-transparent my-4 opacity-30" />
                        <p className="max-w-[300px]">Data is distributed across nodes instantaneously without heavy database writes.</p>
                    </div>

                    <div className="flex-1 w-full">
                        <h2 className="text-[42px] md:text-[48px] font-normal leading-[1.1] tracking-[-1.68px] mb-6">
                            Beyond raw logs.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive layer. Select a request, inspect headers, and replay it with one click.
                        </p>
                    </div>
                </section>

                {/* FEATURE 2: Text Left, Visual Right */}
                <section className="mt-[160px] flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
                    <div className="flex-1 w-full">
                        <h2 className="text-[42px] md:text-[48px] font-normal leading-[1.1] tracking-[-1.68px] mb-6">
                            Built for high-performance engineering.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing microservices in Go, building enterprise backends in C#, or deploying edge functions. The proxy agent runs anywhere with less than 10MB memory footprint.
                        </p>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.35px] text-[#ffb829]">Backend Developers</span>
                            <p className="text-[24px] font-normal tracking-[-0.48px]">Debug APIs instantly.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.35px] text-[#8052ff]">DevOps / Infra</span>
                            <p className="text-[24px] font-normal tracking-[-0.48px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors cursor-default">Monitor proxy layer health.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] font-semibold uppercase tracking-[0.35px] text-[#15846e]">Mobile Teams</span>
                            <p className="text-[24px] font-normal tracking-[-0.48px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors cursor-default">Track client requests visually.</p>
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <section className="mt-[200px] mb-[100px] flex flex-col items-center text-center">
                    <h2 className="text-[56px] md:text-[78px] font-normal leading-[1.1] tracking-[-3.12px] mb-8">
                        Ready to see?
                    </h2>
                    <button className="bg-[#8052ff] text-white text-[14px] font-semibold uppercase tracking-[0.025em] rounded-[24px] px-[32px] py-[16px] hover:bg-[#6c40e6] transition-all">
                        Install Agent (Free)
                    </button>
                </section>
            </main>

            {/* FOOTER (Floating links, no border) */}
            <footer className="relative z-10 w-full px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-3 opacity-50">
                    <DalaLogo />
                    <span className="text-[14px] font-bold tracking-[0.025em] text-[#ffffff]">ProxyPulse</span>
                </div>

                <div className="flex flex-wrap gap-8 text-[14px] font-semibold uppercase tracking-[0.025em] text-[#555]">
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Twitter</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">GitHub</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Discord</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Privacy</a>
                </div>
            </footer>
        </div>
    );
}