"use client";

import React, { useEffect, useRef, useState } from 'react';

// --- Icons ---
const ArrowRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

// --- Advanced Particle Visualizer ---
const Visualizer = ({ type }: { type: 'brain' | 'planet' | 'network' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        let time = 0;

        const resize = () => {
            // Подстраиваемся под контейнер
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 800;
        };

        window.addEventListener('resize', resize);
        resize();

        // Палитра строго по дизайн-системе Dala: Electric Iris, Saffron Spark, Deep Verdant + white/grays
        const colors = ['#8052ff', '#ffb829', '#15846e', '#ffffff', '#9a9a9a', '#bdbdbd'];

        const initParticles = () => {
            particles = [];
            const numParticles = type === 'network' ? 300 : 2500; // Больше плотность для мозга/планеты

            for (let i = 0; i < numParticles; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];

                if (type === 'brain') {
                    // Имитация двух полушарий мозга
                    const angle = Math.random() * Math.PI * 2;
                    const u = Math.random() + Math.random();
                    const r = u > 1 ? 2 - u : u; // распределение ближе к центру
                    const radius = r * 250;

                    // Создаем щель между полушариями
                    const isRight = Math.cos(angle) > 0;
                    const offset = isRight ? 40 : -40;

                    const x = Math.cos(angle) * radius + offset;
                    const y = Math.sin(angle) * (radius * 0.8) + (Math.sin(x * 0.02) * 20); // Немного изгибаем
                    const z = Math.random() * 200 - 100;

                    particles.push({ x, y, z, color, angle: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 });
                } else if (type === 'planet') {
                    // Распределение по сфере (глобус)
                    const phi = Math.acos(-1 + (2 * i) / numParticles);
                    const theta = Math.sqrt(numParticles * Math.PI) * phi;
                    const radius = 280;

                    const x = radius * Math.cos(theta) * Math.sin(phi);
                    const y = radius * Math.sin(theta) * Math.sin(phi);
                    const z = radius * Math.cos(phi);

                    particles.push({ x, y, z, color, baseTheta: theta, phi });
                } else if (type === 'network') {
                    // Распределение по всему пространству для Ambient-сети
                    particles.push({
                        x: (Math.random() - 0.5) * canvas.width * 1.5,
                        y: (Math.random() - 0.5) * canvas.height * 1.5,
                        z: Math.random() * 400 - 200,
                        color,
                        speedY: (Math.random() - 0.5) * 0.5,
                        speedX: (Math.random() - 0.5) * 0.5
                    });
                }
            }
        };

        initParticles();

        const drawTriangle = (x: number, y: number, size: number, color: string, rotation: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            // Равносторонний треугольник
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.866, size * 0.5);
            ctx.lineTo(-size * 0.866, size * 0.5);
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5; // Тонкие линии как в рефе
            ctx.stroke();
            ctx.restore();
        };

        const draw = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Полностью очищаем для резкости

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Сортировка по Z-индексу для правильного перекрытия (опционально, но выглядит лучше)
            const sortedParticles = [...particles].sort((a, b) => b.z - a.z);

            sortedParticles.forEach(p => {
                let px, py, pz, scale;

                if (type === 'brain') {
                    p.angle += p.speed * 0.5;
                    // Легкое "дыхание" частиц
                    const breath = Math.sin(time * 5 + p.x) * 5;
                    px = cx + p.x + Math.cos(p.angle) * 5;
                    py = cy + p.y + Math.sin(p.angle) * 5 + breath;
                    pz = p.z;
                } else if (type === 'planet') {
                    // Вращение сферы
                    p.baseTheta += 0.002;
                    const radius = 280;
                    px = cx + radius * Math.sin(p.phi) * Math.cos(p.baseTheta);
                    py = cy + radius * Math.cos(p.phi);
                    pz = radius * Math.sin(p.phi) * Math.sin(p.baseTheta);
                } else if (type === 'network') {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (Math.abs(p.x) > canvas.width) p.x *= -0.9;
                    if (Math.abs(p.y) > canvas.height) p.y *= -0.9;
                    px = cx + p.x;
                    py = cy + p.y;
                    pz = p.z;

                    // Рисуем связи для сети
                    particles.forEach(otherP => {
                        if (p !== otherP) {
                            const dist = Math.hypot(p.x - otherP.x, p.y - otherP.y);
                            if (dist < 80 && Math.abs(p.z - otherP.z) < 50) {
                                ctx.beginPath();
                                ctx.moveTo(cx + p.x, cy + p.y);
                                ctx.lineTo(cx + otherP.x, cy + otherP.y);
                                ctx.strokeStyle = `rgba(128, 82, 255, ${0.15 - dist / 800})`;
                                ctx.stroke();
                            }
                        }
                    });
                }

                // Простая 3D проекция
                const focalLength = 400;
                scale = focalLength / (focalLength + pz);

                // Рисуем только то, что перед камерой и сглаживаем размер
                if (scale > 0) {
                    const finalX = (px - cx) * scale + cx;
                    const finalY = (py - cy) * scale + cy;
                    const size = Math.max(0.5, 4 * scale); // Базовый размер треугольника

                    // Небольшое вращение каждого треугольника
                    const rotation = time * (p.speed || 1) * 10 + (p.x * 0.01);

                    // Уменьшаем прозрачность для частиц "сзади"
                    ctx.globalAlpha = Math.min(1, scale * 1.2);
                    drawTriangle(finalX, finalY, size, p.color, rotation);
                    ctx.globalAlpha = 1;
                }
            });

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

// --- Dynamic Log Component ---
const LiveLogs = () => {
    const [logs, setLogs] = useState([
        { method: 'PUT', path: '/api/users/update_profile', status: 400, time: '89ms', color: '#ffb829' },
        { method: 'GET', path: '/ws/stream/events', status: 101, time: '0ms', color: '#15846e' },
        { method: 'POST', path: '/auth/csharp/login', status: 201, time: '45ms', color: '#15846e' },
        { method: 'GET', path: '/api/v1/golang-proxy/health', status: 200, time: '12ms', color: '#15846e' },
        { method: 'DELETE', path: '/cache/redis/flush', status: 204, time: '5ms', color: '#8052ff' }
    ]);

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const paths = ['/api/v2/metrics', '/auth/verify', '/users/me', '/cdn/images/logo.png', '/webhook/stripe'];
    const statuses = [200, 201, 400, 401, 404, 500];

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs];
                // Убираем старый
                newLogs.pop();

                // Генерим новый
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                let color = '#15846e'; // зеленый
                if (status >= 400) color = '#ffb829'; // желтый
                if (status >= 500) color = 'red';
                if (status === 204) color = '#8052ff'; // фиолетовый для DELETE

                newLogs.unshift({
                    method: methods[Math.floor(Math.random() * methods.length)],
                    path: paths[Math.floor(Math.random() * paths.length)],
                    status: status,
                    time: `${Math.floor(Math.random() * 150)}ms`,
                    color: color
                });
                return newLogs;
            });
        }, 1500); // Обновляем каждые 1.5 секунды

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-[14px] leading-relaxed w-full max-w-[600px] bg-[#000000] p-8">
            {logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between mb-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <span style={{ color: log.color }} className="w-16 font-semibold">{log.method}</span>
                    <span className="text-[#bdbdbd] flex-1 truncate ml-4">{log.path}</span>
                    <span style={{ color: log.color }} className="w-12 text-right">{log.status}</span>
                    <span className="text-[#9a9a9a] w-16 text-right">{log.time}</span>
                </div>
            ))}
        </div>
    );
};


// --- Layout Components ---
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 bg-transparent">
        <div className="flex items-center gap-3">
            {/* Иконка треугольника с градиентом как у Dala */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L22 20H2L12 2Z" fill="url(#paint0_linear)" />
                <defs>
                    <linearGradient id="paint0_linear" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8052ff" />
                        <stop offset="1" stopColor="#15846e" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="text-[14px] font-normal tracking-[0.35px] text-[#ffffff]">ProxyPulse</span>
        </div>
        <div className="hidden md:flex items-center gap-12">
            <a href="#manifesto" className="text-[14px] tracking-[0.025em] uppercase text-[#9a9a9a] hover:text-[#ffffff] transition-colors font-semibold">Manifesto</a>
            <a href="#team" className="text-[14px] tracking-[0.025em] uppercase text-[#9a9a9a] hover:text-[#ffffff] transition-colors font-semibold">Docs</a>
            <a href="#blog" className="text-[14px] tracking-[0.025em] uppercase text-[#9a9a9a] hover:text-[#ffffff] transition-colors font-semibold">Blog</a>
            <button className="bg-[#8052ff] text-[#ffffff] px-[16px] py-[14.4px] rounded-[22.5px] text-[14px] tracking-[0.025em] uppercase font-semibold">
                Request Access
            </button>
        </div>
    </nav>
);

export default function ProxyPulsePage() {
    // Добавляем глобальные стили для анимации логов
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); }
    }, []);

    return (
        <main className="bg-[#000000] text-[#ffffff] font-sans selection:bg-[#8052ff] selection:text-[#ffffff]">
            <Navbar />

            {/* Hero: Brain */}
            <section className="relative min-h-[100vh] flex items-center px-[8%] overflow-hidden">
                <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row items-center relative z-10">
                    <div className="w-full md:w-1/2 pr-8 z-20">
                        <h1 className="text-[78px] md:text-[113px] font-normal leading-[1.1] tracking-[-4.52px] mb-8">
                            Unlock collective wisdom.
                        </h1>
                        <div className="text-[#ffb829] text-[14px] tracking-[0.35px] uppercase font-semibold mb-6">
                            Stop managing logs. Start using them.
                        </div>
                        <p className="text-[18px] leading-[1.5] font-[200] text-[#ffffff] max-w-[480px] mb-12">
                            Plug into your proxy's shared brainpower. Ask ProxyPulse to instantly visualize any HTTP traffic from your backend system. Focus on doing your best work with context, conviction and clarity.
                        </p>
                        <button className="bg-[#8052ff] text-[#ffffff] px-[16px] py-[14.4px] rounded-[22.5px] text-[14px] tracking-[0.025em] uppercase font-semibold">
                            Request Access
                        </button>
                    </div>
                    <div className="w-full md:w-1/2 h-[800px] relative pointer-events-none">
                        <Visualizer type="brain" />
                    </div>
                </div>
            </section>

            {/* Section 2: Planet */}
            <section className="relative min-h-[100vh] flex items-center px-[8%] py-[120px] overflow-hidden">
                <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row items-center relative z-10">
                    <div className="w-full md:w-1/2 h-[800px] relative pointer-events-none order-2 md:order-1">
                        <Visualizer type="planet" />
                    </div>
                    <div className="w-full md:w-1/2 pl-8 z-20 order-1 md:order-2">
                        <h2 className="text-[78px] md:text-[113px] font-normal leading-[1.1] tracking-[-4.52px] mb-8">
                            Build a better world of routing.
                        </h2>
                        <p className="text-[18px] leading-[1.5] font-[200] text-[#ffffff] max-w-[480px]">
                            Our mission is to make proxy monitoring more coherent and delightful—reframing debugging from reading raw lines to seeing global context. Your happiest and most purposeful moments at work are when you're in flow tracking APIs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Live Network & Logs */}
            <section className="relative min-h-[100vh] flex items-center px-[8%] py-[120px] overflow-hidden">
                {/* Фоновая ambient-сеть */}
                <Visualizer type="network" />

                <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row items-center relative z-10">
                    <div className="w-full md:w-1/2 pr-8 z-20">
                        <h2 className="text-[48px] md:text-[78px] font-normal leading-[1.1] tracking-[-3.12px] mb-8">
                            Beyond the logs.
                        </h2>
                        <p className="text-[18px] leading-[1.5] font-[200] text-[#bdbdbd] max-w-[480px]">
                            Traditional tools force you to grep through text. ProxyPulse captures the life cycle of every request, instantly visualizing endpoints, methods, and latencies as they traverse your network.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 h-[500px] flex items-center justify-center relative z-20">
                        {/* Живой обновляющийся терминал */}
                        <LiveLogs />
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-[#333333] text-center">
                <p className="text-[14px] text-[#9a9a9a] font-[200]">© 2026 ProxyPulse. All rights reserved.</p>
            </footer>
        </main>
    );
}