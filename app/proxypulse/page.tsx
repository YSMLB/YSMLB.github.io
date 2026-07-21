"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Icons
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

const SparkleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8052ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
);

// Live Terminal Data Mock
const liveRequests = [
    { method: "GET", path: "/api/v1/golang-proxy/health", status: 200, time: "12ms", size: "1.2kb" },
    { method: "POST", path: "/auth/csharp/login", status: 201, time: "45ms", size: "340b" },
    { method: "GET", path: "/ws/stream/events", status: 101, time: "0ms", size: "0b" },
    { method: "PUT", path: "/api/users/update_profile", status: 400, time: "89ms", size: "45b" },
    { method: "DELETE", path: "/cache/redis/flush", status: 204, time: "5ms", size: "0b" },
    { method: "GET", path: "/api/metrics/prometheus", status: 200, time: "112ms", size: "4.5kb" },
];

const LiveConsole = () => {
    const [requests, setRequests] = useState<typeof liveRequests>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = liveRequests[index % liveRequests.length];
                index++;
                return [newReq, ...prev].slice(0, 4);
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-[600px] mx-auto bg-[#000000] border border-[#1a1a1a] rounded-[24px] p-6 font-mono text-[14px] text-[#bdbdbd] shadow-[0_0_80px_rgba(128,82,255,0.15)] relative overflow-hidden z-20">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4 mb-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#333]" />
                    <div className="w-3 h-3 rounded-full bg-[#333]" />
                    <div className="w-3 h-3 rounded-full bg-[#333]" />
                </div>
                <span className="text-[#8052ff] text-[12px] font-semibold tracking-[0.35px] uppercase">Live Traffic</span>
            </div>

            <div className="flex flex-col gap-3 min-h-[160px]">
                <AnimatePresence>
                    {requests.map((req, i) => (
                        <motion.div
                            key={`${req.path}-${i}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1 - i * 0.2, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-12 font-bold ${req.method === 'GET' ? 'text-[#8052ff]' : req.method === 'POST' ? 'text-[#15846e]' : req.method === 'DELETE' ? 'text-red-500' : 'text-[#ffb829]'}`}>
                                    {req.method}
                                </span>
                                <span className="text-[#ffffff] truncate max-w-[200px] sm:max-w-xs">{req.path}</span>
                            </div>
                            <div className="flex items-center gap-6 text-[#9a9a9a]">
                                <span className={`font-bold ${req.status >= 500 ? 'text-red-500' : req.status >= 400 ? 'text-[#ffb829]' : 'text-[#15846e]'}`}>{req.status}</span>
                                <span className="w-12 text-right hidden sm:block">{req.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function ProxyPulse() {
    return (
        <div className="bg-[#000000] text-[#ffffff] min-h-screen font-sans selection:bg-[#8052ff] selection:text-white overflow-x-hidden">

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 py-[24px] px-[24px] md:px-[60px] flex justify-between items-center bg-[#000000]/80 backdrop-blur-md border-b border-transparent">
                <div className="flex items-center gap-3">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff]">ProxyPulse</span>
                </div>

                <div className="hidden md:flex items-center gap-[36px]">
                    <Link href="#features" className="text-[14px] font-[600] tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Manifesto</Link>
                    <Link href="#how-it-works" className="text-[14px] font-[600] tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Docs</Link>
                    <Link href="#pricing" className="text-[14px] font-[600] tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-[24px]">
                    <button className="text-[14px] font-[600] tracking-[0.35px] text-[#9a9a9a] hover:text-[#ffffff] transition-colors hidden sm:block">
                        Sign In
                    </button>
                    <button className="bg-[#8052ff] text-white text-[14px] font-[600] tracking-[0.35px] rounded-[24px] px-[24px] py-[12px] hover:bg-[#6c40e6] transition-colors">
                        Deploy Agent
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1280px] mx-auto px-[24px] md:px-[60px] pt-[120px] md:pt-[160px] pb-[120px]">

                {/* HERO SECTION (Centered, glowing backdrop) */}
                <section className="relative flex flex-col items-center text-center mt-[60px] mb-[120px]">

                    {/* Concentric Glow Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none flex items-center justify-center z-0 opacity-40">
                        <div className="absolute w-[300px] h-[300px] rounded-full border border-[#1a1a1a]" />
                        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#1a1a1a]" />
                        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#1a1a1a]" />
                        <div className="absolute w-[100%] h-[100%] bg-[radial-gradient(circle_at_center,rgba(128,82,255,0.1)_0%,transparent_60%)]" />
                    </div>

                    <div className="relative z-10 mb-[60px]">
                        <div className="flex items-center justify-center gap-[12px] mb-[30px]">
                            <SparkleIcon />
                            <h1 className="text-[78px] md:text-[113px] font-[400] leading-[1.1] tracking-[-4.52px] text-[#ffffff]">
                                ProxyPulse AI
                            </h1>
                        </div>
                        <p className="text-[18px] md:text-[24px] font-[200] leading-[1.25] tracking-[-0.48px] text-[#bdbdbd] max-w-[600px] mx-auto mb-[36px]">
                            Stop reading dead logs. Visualize your network layer in real-time with our zero-config agent.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-[18px]">
                            <div className="bg-[#1a1a1a] rounded-[9999px] p-[6px] pl-[24px] flex items-center gap-[12px] border border-[#333]">
                                <input
                                    type="text"
                                    placeholder="Enter your email to join the beta"
                                    className="bg-transparent border-none text-[15px] font-[400] text-[#ffffff] outline-none w-[220px] placeholder:text-[#9a9a9a]"
                                />
                                <button className="bg-[#ffb829] text-[#000000] w-[36px] h-[36px] rounded-[9999px] flex items-center justify-center hover:bg-[#e6a625] transition-colors">
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    <LiveConsole />
                </section>

                {/* FEATURE 1 */}
                <section className="mt-[120px] md:mt-[200px] flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[120px]">
                    <div className="flex-1 w-full flex flex-col gap-[24px]">
                        <h2 className="text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff]">
                            Beyond raw logs.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Traditional tools force you to search through massive text files. ProxyPulse turns your traffic into an interactive layer. Select a request, inspect headers, and replay it with one click.
                        </p>
                    </div>

                    <div className="flex-1 w-full bg-[#15846e]/10 border border-[#15846e]/30 rounded-[24px] p-[36px] font-mono text-[14px] leading-[1.5] text-[#9a9a9a] flex flex-col gap-[18px]">
                        <div className="flex gap-[18px]">
                            <span className="text-[#ffb829]">01</span>
                            <p>Intercepting internal traffic...</p>
                        </div>
                        <div className="flex gap-[18px]">
                            <span className="text-[#8052ff]">02</span>
                            <p>Analyzing latency distribution</p>
                        </div>
                        <div className="flex gap-[18px]">
                            <span className="text-[#15846e]">03</span>
                            <p className="text-[#ffffff]">Identified 42 bottlenecks in /api/v1/metrics</p>
                        </div>
                    </div>
                </section>

                {/* FEATURE 2 */}
                <section className="mt-[120px] md:mt-[200px] flex flex-col-reverse lg:flex-row items-center gap-[60px] lg:gap-[120px]">
                    <div className="flex-1 w-full flex flex-col gap-[36px]">
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[12px] font-[600] uppercase tracking-[0.35px] text-[#ffb829]">Backend Developers</span>
                            <p className="text-[24px] font-[400] tracking-[-0.48px] leading-[1.25]">Debug APIs instantly.</p>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[12px] font-[600] uppercase tracking-[0.35px] text-[#8052ff]">DevOps / Infra</span>
                            <p className="text-[24px] font-[400] tracking-[-0.48px] leading-[1.25] text-[#9a9a9a]">Monitor proxy layer health.</p>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-[12px] font-[600] uppercase tracking-[0.35px] text-[#15846e]">Mobile Teams</span>
                            <p className="text-[24px] font-[400] tracking-[-0.48px] leading-[1.25] text-[#9a9a9a]">Track client requests visually.</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-[24px]">
                        <h2 className="text-[42px] md:text-[48px] font-[400] leading-[1.1] tracking-[-1.68px] text-[#ffffff]">
                            Built for high-performance engineering.
                        </h2>
                        <p className="text-[18px] font-[200] leading-[1.5] text-[#bdbdbd] max-w-[520px]">
                            Whether you are writing microservices in Go, building enterprise backends in C#, or deploying edge functions. The proxy agent runs anywhere with less than 10MB memory footprint.
                        </p>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="w-full px-[24px] md:px-[60px] py-[60px] border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-start md:items-center gap-[36px]">
                <div className="flex items-center gap-[12px] opacity-50">
                    <DalaLogo />
                    <span className="text-[14px] font-[600] tracking-[0.35px] text-[#ffffff]">ProxyPulse</span>
                </div>

                <div className="flex flex-wrap gap-[30px] text-[14px] font-[600] tracking-[0.35px] text-[#555]">
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Twitter</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">GitHub</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Discord</a>
                    <a href="#" className="hover:text-[#ffffff] transition-colors">Privacy</a>
                </div>
            </footer>
        </div>
    );
}