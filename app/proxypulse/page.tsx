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

// =====================================================================
// ICONS
// =====================================================================
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

const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

// =====================================================================
// CONSTELLATION VISUALIZATION
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
        const particleCount = window.innerWidth > 768 ? 200 : 80;
        const colors = [tokens.electricIris, tokens.saffronSpark, tokens.deepVerdant, '#e845f2', '#45bcf2'];

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number; color: string; angle: number; speed: number;
            constructor() {
                // Skew particles to the right side of the screen for the 2-column layout
                this.x = (Math.random() * (width * 0.6)) + (width * 0.4);
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 3 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (Math.random() - 0.5) * 0.01;
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
                ctx.lineWidth = 1;
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

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(128, 82, 255, ${0.4 * (1 - distance / 100)})`;
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
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none" />
    );
};

// =====================================================================
// LIVE REQUEST TERMINAL
// =====================================================================
const liveRequests = [
    { method: "GET", path: "/api/v1/golang-proxy/health", status: 200, time: "12ms" },
    { method: "POST", path: "/auth/csharp/login", status: 201, time: "45ms" },
    { method: "GET", path: "/ws/stream/events", status: 101, time: "0ms" },
    { method: "PUT", path: "/api/users/update_profile", status: 400, time: "89ms" },
    { method: "DELETE", path: "/cache/redis/flush", status: 204, time: "5ms" },
    { method: "GET", path: "/api/metrics/prometheus", status: 200, time: "112ms" },
];

const LiveTerminal = () => {
    const [requests, setRequests] = useState<typeof liveRequests>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = liveRequests[index % liveRequests.length];
                index++;
                return [newReq, ...prev].slice(0, 6);
            });
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full font-mono text-[14px] leading-[1.5] tracking-tight flex flex-col gap-[12px] relative z-10 text-[#bdbdbd]">
            <AnimatePresence>
                {requests.map((req, i) => (
                    <motion.div
                        key={`${req.path}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1 - i * 0.15, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-[18px]">
                            <span className={`w-[48px] font-[600] ${req.method === 'GET' ? 'text-[#8052ff]' : req.method === 'POST' ? 'text-[#15846e]' : req.method === 'DELETE' ? 'text-[#e845f2]' : 'text-[#ffb829]'}`}>
                                {req.method}
                            </span>
                            <span className="text-[#ffffff]">{req.path}</span>
                        </div>
                        <div className="flex items-center gap-[24px]">
                            <span className={`font-[600] ${req.status >= 500 ? 'text-[#e845f2]' : req.status >= 400 ? 'text-[#ffb829]' : 'text-[#15846e]'}`}>{req.status}</span>
                            <span className="w-[48px] text-right hidden sm:block">{req.time}</span>
                        </div>
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
    return (
        <div className="bg-[#000000] text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-[#ffffff] overflow-x-hidden">

            {/* Background Constellation */}
            <ParticleConstellation />

            {/* NAVIGATION BAR */}
            <nav className="fixed top-0 left-0 w-full z-50 py-[24px] px-[24px] md:px-[60px] flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-[12px]">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff] uppercase">ProxyPulse</span>
                </div>

                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#manifesto" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#team" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Team</Link>
                    <Link href="#blog" className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Blog</Link>
                </div>

                <div className="flex items-center">
                    <button className="bg-[#8052ff] text-[#ffffff] text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[16px] py-[14.4px] hover:bg-[#6c40e6] transition-colors">
                        Request Access
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1280px] mx-auto px-[24px] md:px-[60px] pt-[160px] md:pt-[240px] pb-[120px]">

                {/* HERO SECTION (2-Column Asymmetric) */}
                <section className="flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px] min-h-[60vh]">
                    <div className="flex-1 w-full flex flex-col items-start z-20">
                        <span className="text-[14px] font-[600] uppercase tracking-[0.35px] text-[#ffb829] mb-[24px]">
                            Network Observability
                        </span>

                        <h1 className="text-[78px] lg:text-[113px] font-[400] leading-[1.1] tracking-[-3.12px] lg:tracking-[-4.52px] text-[#ffffff] mb-[30px] w-full max-w-[700px]">
                            See your network. Live.
                        </h1>

                        <p className="text-[18px] font-[200] leading-[1.5] text-[#ffffff] max-w-[480px] mb-[36px]">
                            Stop reading dead logs. ProxyPulse visualizes every HTTP request in real-time. Connect the lightweight agent and watch your backend traffic breathe, flow, and break—instantly.
                        </p>

                        <button className="bg-[#8052ff] text-[#ffffff] text-[14px] font-[600] uppercase tracking-[0.35px] rounded-[24px] px-[16px] py-[14.4px] hover:bg-[#6c40e6] transition-colors">
                            Deploy Proxy
                        </button>
                    </div>

                    <div className="flex-1 w-full h-full min-h-[400px] z-10 hidden lg:block">
                        {/* Constellation handles the visual weight on the right */}
                    </div>
                </section>

                {/* FEATURE 1: Visual Left, Text Right */}
                <section className="mt-[160px] md:mt-[240px] flex flex-col-reverse lg:flex-row items-center gap-[60px] lg:gap-[120px]">
                    <div className="flex-1 w-full">
                        <LiveTerminal />
                    </div>

                    <div className="flex-1 w-full flex flex-col items-start">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Beyond raw logs.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive layer. Select a request, inspect headers, and replay it with one click.
                        </p>
                    </div>
                </section>

                {/* FEATURE 2: Text Left, Visual Right */}
                <section className="mt-[160px] md:mt-[240px] flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px]">
                    <div className="flex-1 w-full flex flex-col items-start">
                        <h2 className="text-[42px] lg:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff] mb-[24px]">
                            Built for high-performance engineering.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing microservices in Go, building enterprise backends in C#, or deploying edge functions. The proxy agent runs anywhere with less than 10MB memory footprint.
                        </p>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-[36px]">
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

                {/* TEAM SECTION (Large Portrait Cards floating on void) */}
                <section className="mt-[160px] md:mt-[240px] flex flex-col items-start">
                    <h2 className="text-[78px] font-[400] leading-[1.1] tracking-[-3.12px] text-[#ffffff] mb-[60px]">
                        The Team
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[60px] w-full">
                        {/* Team Member Card 1 */}
                        <div className="flex flex-col gap-[18px]">
                            <div className="w-full aspect-[3/4] bg-[#1a1a1a] rounded-[24px] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" alt="Team Member" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div>
                                <span className="text-[12px] font-[400] uppercase text-[#8052ff] mb-[6px] block">Founder & Backend Lead</span>
                                <h3 className="text-[27px] font-[400] leading-[1.0] text-[#ffffff]">Alex Dev</h3>
                            </div>
                        </div>

                        {/* Team Member Card 2 */}
                        <div className="flex flex-col gap-[18px]">
                            <div className="w-full aspect-[3/4] bg-[#1a1a1a] rounded-[24px] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80" alt="Team Member" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div>
                                <span className="text-[12px] font-[400] uppercase text-[#8052ff] mb-[6px] block">Head of Infrastructure</span>
                                <h3 className="text-[27px] font-[400] leading-[1.0] text-[#ffffff]">Sarah Jenkins</h3>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
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