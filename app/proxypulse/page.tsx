"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play, Terminal } from 'lucide-react';

// --- Particle Visualizer Component ---
const Visualizer = ({ type }: { type: 'brain' | 'planet' | 'network' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 600;
            canvas.height = canvas.parentElement?.clientHeight || 600;
        };

        window.addEventListener('resize', resize);
        resize();

        const colors = ['#8052ff', '#ffb829', '#15846e', '#ffffff'];

        const initParticles = () => {
            particles = [];
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            if (type === 'brain') {
                for (let i = 0; i < 400; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 200;
                    const offset = Math.cos(angle) > 0 ? 50 : -50;
                    particles.push({
                        x: cx + Math.cos(angle) * radius + offset,
                        y: cy + Math.sin(angle) * (radius * 0.7),
                        baseX: cx + Math.cos(angle) * radius + offset,
                        baseY: cy + Math.sin(angle) * (radius * 0.7),
                        size: Math.random() * 2 + 1,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        angle: Math.random() * Math.PI * 2,
                        speed: Math.random() * 0.02
                    });
                }
            } else if (type === 'planet') {
                for (let i = 0; i < 500; i++) {
                    const u = Math.random();
                    const v = Math.random();
                    const theta = u * 2.0 * Math.PI;
                    const phi = Math.acos(2.0 * v - 1.0);
                    const r = 200;

                    particles.push({
                        theta,
                        phi,
                        r,
                        size: Math.random() * 2 + 0.5,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        speed: Math.random() * 0.005 + 0.001
                    });
                }
            } else if (type === 'network') {
                for (let i = 0; i < 80; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 1,
                        vy: (Math.random() - 0.5) * 1,
                        size: Math.random() * 3 + 1,
                        color: Math.random() > 0.8 ? '#ffb829' : '#8052ff'
                    });
                }
            }
        };

        initParticles();

        const drawTriangle = (x: number, y: number, size: number, color: string) => {
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            if (type === 'brain') {
                particles.forEach(p => {
                    p.angle += p.speed;
                    p.x = p.baseX + Math.cos(p.angle) * 10;
                    p.y = p.baseY + Math.sin(p.angle) * 10;
                    drawTriangle(p.x, p.y, p.size, p.color);
                });
            } else if (type === 'planet') {
                particles.forEach(p => {
                    p.theta += p.speed;
                    const x = cx + p.r * Math.sin(p.phi) * Math.cos(p.theta);
                    const y = cy + p.r * Math.cos(p.phi);
                    const z = p.r * Math.sin(p.phi) * Math.sin(p.theta);

                    if (z > -50) {
                        drawTriangle(x, y, p.size * (1 + z / 200), p.color);
                    }
                });
            } else if (type === 'network') {
                ctx.strokeStyle = 'rgba(128, 82, 255, 0.15)';
                ctx.lineWidth = 1;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                });
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [type]);

    return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0 pointer-events-none" />;
};

// --- Layout Components ---
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-[#8052ff] to-[#15846e] rounded-sm transform rotate-45"></div>
            <span className="font-semibold text-lg tracking-tight text-white">ProxyPulse</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[14px] leading-[1.2] tracking-[0.35px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">Features</a>
            <a href="#docs" className="text-[14px] leading-[1.2] tracking-[0.35px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">Docs</a>
            <a href="#github" className="text-[14px] leading-[1.2] tracking-[0.35px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">GitHub</a>
        </div>
        <button className="bg-[#8052ff] hover:bg-[#8052ff]/90 text-white px-6 py-3 rounded-[24px] text-[14px] leading-[1.2] tracking-[0.35px] font-semibold uppercase transition-transform hover:scale-105 active:scale-95">
            Download Agent
        </button>
    </nav>
);

const Hero = () => (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden px-8">
        <div className="max-w-[1280px] mx-auto w-full grid md:grid-cols-2 gap-12 relative z-10">
            <div className="flex flex-col justify-center max-w-[560px]">
                <div className="text-[#ffb829] text-[14px] leading-[1.2] tracking-[0.35px] font-semibold uppercase mb-6">
                    Stop reading raw logs. Start seeing.
                </div>
                <h1 className="text-[78px] md:text-[113px] font-normal leading-[1.1] tracking-[-4.52px] mb-8 text-white">
                    See your network as a living system.
                </h1>
                <p className="text-[18px] leading-[1.5] font-extralight text-[#bdbdbd] mb-10 max-w-[480px]">
                    ProxyPulse is a lightweight proxy monitor and API debugger. Drop the agent into your infrastructure and instantly visualize HTTP throughput, latency, and errors in real-time.
                </p>
                <div className="flex items-center gap-4">
                    <button className="bg-[#8052ff] text-white px-8 py-4 rounded-[24px] text-[14px] leading-[1.2] tracking-[0.35px] font-semibold uppercase flex items-center gap-2">
                        <Terminal size={18} />
                        Install via CLI
                    </button>
                    <button className="text-white px-6 py-4 rounded-[24px] text-[14px] leading-[1.2] tracking-[0.35px] font-semibold uppercase hover:text-[#9a9a9a] transition-colors flex items-center gap-2">
                        <Play size={18} />
                        Watch Demo
                    </button>
                </div>
            </div>
            <div className="relative h-[500px] md:h-[700px] w-full">
                <Visualizer type="brain" />
            </div>
        </div>
    </section>
);

const SectionTwo = () => (
    <section className="relative min-h-screen flex items-center overflow-hidden px-8 py-32 bg-black">
        <div className="max-w-[1280px] mx-auto w-full grid md:grid-cols-2 gap-24 relative z-10 items-center">
            <div className="order-2 md:order-1 relative h-[500px] w-full">
                <Visualizer type="planet" />
            </div>
            <div className="order-1 md:order-2 flex flex-col justify-center max-w-[560px]">
                <h2 className="text-[78px] font-normal leading-[1.1] tracking-[-3.12px] mb-8 text-white">
                    Global context. Total clarity.
                </h2>
                <p className="text-[18px] leading-[1.5] font-extralight text-[#bdbdbd]">
                    Understand exactly where your API requests originate. ProxyPulse maps your clients geographically, allowing your DevOps teams to monitor the health of your proxy layer across regions with zero guesswork.
                </p>
            </div>
        </div>
    </section>
);

const SectionThree = () => (
    <section className="relative min-h-screen flex items-center overflow-hidden px-8 py-32 bg-black">
        <div className="max-w-[1280px] mx-auto w-full grid md:grid-cols-2 gap-24 relative z-10 items-center">
            <div className="flex flex-col justify-center max-w-[560px]">
                <h2 className="text-[78px] font-normal leading-[1.1] tracking-[-3.12px] mb-8 text-white">
                    Live routing graph.
                </h2>
                <p className="text-[18px] leading-[1.5] font-extralight text-[#bdbdbd] mb-8">
                    Every HTTP request is a node on a live graph. Track the exact path from client to proxy to your microservices. Filter endpoints, inspect individual payloads, and isolate 5xx errors the millisecond they happen.
                </p>
                <ul className="space-y-4 text-[#bdbdbd] font-extralight text-[18px]">
                    <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#8052ff]" /> WebSockets streaming</li>
                    <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#8052ff]" /> Deep payload inspection</li>
                    <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#8052ff]" /> One-click log export for teams</li>
                </ul>
            </div>
            <div className="relative h-[500px] w-full relative">
                <Visualizer type="network" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                    <div className="bg-black/60 backdrop-blur-sm border border-[#15846e]/30 rounded-xl p-6 font-mono text-sm w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-3 text-[#bdbdbd]">
                            <span className="text-[#ffb829]">PUT</span>
                            <span>/api/users/update_profile</span>
                            <span className="text-[#ffb829]">400</span>
                            <span>89ms</span>
                        </div>
                        <div className="flex items-center justify-between mb-3 text-[#bdbdbd]">
                            <span className="text-[#8052ff]">GET</span>
                            <span>/ws/stream/events</span>
                            <span className="text-[#15846e]">101</span>
                            <span>0ms</span>
                        </div>
                        <div className="flex items-center justify-between mb-3 text-[#bdbdbd]">
                            <span className="text-[#15846e]">POST</span>
                            <span>/auth/csharp/login</span>
                            <span className="text-[#15846e]">201</span>
                            <span>45ms</span>
                        </div>
                        <div className="flex items-center justify-between text-[#bdbdbd]">
                            <span className="text-[#8052ff]">GET</span>
                            <span>/api/v1/golang-proxy/health</span>
                            <span className="text-[#15846e]">200</span>
                            <span>12ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-12 border-t border-[#bdbdbd]/10 text-center text-[#9a9a9a] text-[14px] leading-[1.2] tracking-[0.35px] uppercase font-semibold">
        <p>© 2026 ProxyPulse. Built for the modern backend.</p>
    </footer>
)

export default function ProxyPulsePage() {
    return (
        <main className="min-h-screen bg-black font-sans selection:bg-[#8052ff] selection:text-white">
            <Navbar />
            <Hero />
            <SectionTwo />
            <SectionThree />
            <Footer />
        </main>
    );
}