"use client";

import React, { useEffect, useRef } from 'react';

// --- Inline Icons (No dependencies) ---
const ArrowRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const Play = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const Terminal = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>
);
const Activity = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);

// --- High-Density Network Canvas ---
const AdvancedNetwork = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let nodes: any[] = [];
        let packets: any[] = [];

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            initNetwork();
        };

        const initNetwork = () => {
            nodes = [];
            packets = [];
            const cols = Math.floor(canvas.width / 60);
            const rows = Math.floor(canvas.height / 60);

            // Create grid nodes
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (Math.random() > 0.4) {
                        nodes.push({
                            x: i * 60 + (Math.random() * 20 - 10),
                            y: j * 60 + (Math.random() * 20 - 10),
                            vx: (Math.random() - 0.5) * 0.2,
                            vy: (Math.random() - 0.5) * 0.2,
                            baseX: i * 60,
                            baseY: j * 60,
                            connections: []
                        });
                    }
                }
            }

            // Connect nodes
            nodes.forEach((node, i) => {
                nodes.forEach((otherNode, j) => {
                    if (i !== j) {
                        const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                        if (dist < 100) node.connections.push(j);
                    }
                });
            });
        };

        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes & lines
            ctx.lineWidth = 1;
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                // Return to base position smoothly
                node.x += (node.baseX - node.x) * 0.01;
                node.y += (node.baseY - node.y) * 0.01;

                // Draw connections
                node.connections.forEach((targetIdx: number) => {
                    const target = nodes[targetIdx];
                    const dist = Math.hypot(node.x - target.x, node.y - target.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(target.x, target.y);
                        ctx.strokeStyle = `rgba(128, 82, 255, ${0.15 - dist / 1000})`;
                        ctx.stroke();
                    }
                });

                // Draw node points
                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();

                // Randomly spawn data packets along connections
                if (Math.random() < 0.01 && node.connections.length > 0) {
                    const targetIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
                    packets.push({
                        startX: node.x, startY: node.y,
                        endX: nodes[targetIdx].x, endY: nodes[targetIdx].y,
                        progress: 0,
                        speed: Math.random() * 0.02 + 0.02,
                        color: Math.random() > 0.7 ? '#ffb829' : '#8052ff'
                    });
                }
            });

            // Draw flowing packets
            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    packets.splice(i, 1);
                    continue;
                }
                const px = p.startX + (p.endX - p.startX) * p.progress;
                const py = p.startY + (p.endY - p.startY) * p.progress;

                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0 opacity-60" />;
};

// --- Layout Components ---
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-[#8052ff] to-[#15846e] rounded-sm transform rotate-45 shadow-[0_0_15px_rgba(128,82,255,0.5)]"></div>
            <span className="font-semibold text-lg tracking-tight text-white">ProxyPulse</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[12px] tracking-[2px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">Features</a>
            <a href="#docs" className="text-[12px] tracking-[2px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">Documentation</a>
            <a href="#github" className="text-[12px] tracking-[2px] text-[#9a9a9a] hover:text-white transition-colors uppercase font-semibold">Source</a>
        </div>
        <button className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-full text-[13px] tracking-[1px] font-bold uppercase transition-transform hover:scale-105">
            Deploy Agent
        </button>
    </nav>
);

const Hero = () => (
    <section className="relative min-h-[100vh] flex items-center pt-24 overflow-hidden px-8 border-b border-white/5">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#8052ff]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#15846e]/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="absolute right-0 top-0 w-1/2 h-full">
            <AdvancedNetwork />
        </div>

        <div className="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-[#15846e] animate-pulse"></span>
                    <span className="text-[#15846e] text-[12px] font-mono tracking-widest uppercase">System Status: Online</span>
                </div>

                <h1 className="text-[64px] lg:text-[100px] font-medium leading-[0.9] tracking-[-3px] mb-8 text-white">
                    Network reality. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8052ff] to-[#ffb829]">Rendered live.</span>
                </h1>

                <p className="text-[20px] leading-[1.6] font-light text-[#9a9a9a] mb-12 max-w-[600px]">
                    ProxyPulse transforms invisible HTTP traffic into an interactive command center. Intercept, analyze, and debug your proxy layer in real-time without parsing a single raw log.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <button className="bg-[#8052ff] text-white px-8 py-4 rounded-full text-[13px] tracking-[1px] font-bold uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(128,82,255,0.4)] transition-all">
                        <Terminal size={18} />
                        Install CLI
                    </button>
                    <button className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-[13px] tracking-[1px] font-bold uppercase hover:bg-white/10 transition-all flex items-center gap-2">
                        <Play size={18} />
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Floating UI Elements to fill the right side void */}
            <div className="lg:col-span-5 relative h-[600px] hidden lg:block pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[320px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                        <span className="text-white text-sm font-semibold">Live Traffic</span>
                        <Activity size={16} className="text-[#ffb829]" />
                    </div>
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-[#8052ff]">POST</span>
                            <span className="text-gray-400 truncate w-32">/api/v1/auth</span>
                            <span className="text-[#15846e]">200 OK</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#ffb829]">PUT</span>
                            <span className="text-gray-400 truncate w-32">/users/update</span>
                            <span className="text-[#ffb829]">429 Err</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#8052ff]">GET</span>
                            <span className="text-gray-400 truncate w-32">/ws/stream</span>
                            <span className="text-[#15846e]">101 OK</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-[20%] left-[0%] w-[260px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Global Throughput</div>
                    <div className="text-4xl text-white font-medium mb-1">42.8 <span className="text-lg text-[#8052ff]">k/req</span></div>
                    <div className="text-[#15846e] text-xs">+12.4% vs last hour</div>
                </div>
            </div>
        </div>
    </section>
);

const SectionTwo = () => (
    <section className="relative py-32 px-8 bg-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 relative z-10 items-center">
            <div className="relative h-[500px] rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-b from-[#8052ff]/10 to-transparent"></div>
                {/* Fake Terminal / Log Interface */}
                <div className="w-full h-full bg-[#0a0a0a] rounded-xl border border-white/5 p-6 font-mono text-sm flex flex-col shadow-2xl">
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="space-y-2 text-gray-500 flex-1 overflow-hidden">
                        <p><span className="text-[#15846e]">proxy-agent</span> attached to PID 88392</p>
                        <p><span className="text-[#15846e]">proxy-agent</span> listening on ws://localhost:4000</p>
                        <p className="text-white mt-4">Intercepting traffic routing...</p>
                        <div className="pl-4 border-l-2 border-[#8052ff]/30 mt-2 space-y-1">
                            <p>➔ Client: 192.168.1.104 (iOS App)</p>
                            <p>➔ Target: api.internal.svc.cluster.local</p>
                            <p>➔ Latency: <span className="text-[#ffb829]">142ms</span></p>
                        </div>
                        <p className="text-white mt-4">Payload extracted (2.4kb)</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <h2 className="text-[56px] lg:text-[72px] font-medium leading-[1] tracking-[-2px] mb-8 text-white">
                    Deep packet inspection. <br />
                    <span className="text-[#9a9a9a]">Zero configuration.</span>
                </h2>
                <p className="text-[18px] leading-[1.6] font-light text-[#9a9a9a] mb-8">
                    The Go-based agent sits silently alongside your infrastructure. It parses headers, bodies, and timings without adding overhead, streaming pure intelligence straight to your dashboard.
                </p>
                <div className="grid grid-cols-2 gap-8 mt-4 border-t border-white/10 pt-8">
                    <div>
                        <div className="text-3xl text-white font-medium mb-2">&lt; 2ms</div>
                        <div className="text-sm text-gray-500 uppercase tracking-widest">Agent Overhead</div>
                    </div>
                    <div>
                        <div className="text-3xl text-white font-medium mb-2">100%</div>
                        <div className="text-sm text-gray-500 uppercase tracking-widest">Protocol Support</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-12 border-t border-white/5 bg-black text-center text-[#9a9a9a] text-[12px] tracking-[2px] uppercase font-semibold">
        <p>© 2026 ProxyPulse. Engineered for Backend Architects.</p>
    </footer>
)

export default function ProxyPulsePage() {
    return (
        <main className="min-h-screen bg-black font-sans selection:bg-[#8052ff] selection:text-white">
            <Navbar />
            <Hero />
            <SectionTwo />
            <Footer />
        </main>
    );
}