"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

// --- БАЗА ДАННЫХ КРОССОВОК ---
// Брат, я поставил временные студийные фото с белым фоном. 
// Чтобы было идеально, скачай PNG-фотки LV Skate, Jordan и Uptempo без фона,
// закинь их в папку public/ и напиши пути: img: "/lv-skate.png"
const shoes = [
    {
        id: 1,
        title1: "BUILT",
        title2: "FOR",
        title3: "FLIGHT",
        subtitle: "INTRODUCING OUR LIGHIEST\nSHOE EVER",
        name: "Air Jordan 1",
        img: "https://images.unsplash.com/photo-1597045566677-8cf039d7f6a4?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 2,
        title1: "LUXURY",
        title2: "MEETS",
        title3: "STREET",
        subtitle: "NEW LOUIS VUITTON SKATE\nGREEN / WHITE EDITION",
        name: "LV Skate Sneaker",
        img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 3,
        title1: "MAXIMUM",
        title2: "AIR",
        title3: "IMPACT",
        subtitle: "NIKE AIR MORE UPTEMPO '96\nBOLD AND UNAPOLOGETIC",
        name: "Air More Uptempo",
        img: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=1000&auto=format&fit=crop",
    }
];

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Состояния модалок
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // 3D Анимация при наведении на кроссовок
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [10, -10]);
    const rotateY = useTransform(x, [-300, 300], [-10, 10]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const nextShoe = () => setCurrentIndex((prev) => (prev + 1) % shoes.length);
    const prevShoe = () => setCurrentIndex((prev) => (prev - 1 + shoes.length) % shoes.length);

    const activeShoe = shoes[currentIndex];

    return (
        // Теплый серый фон как в Фигме
        <div className="min-h-screen bg-[#d7d2ce] p-4 md:p-10 flex items-center justify-center font-sans text-black">

            {/* ГЛАВНЫЙ БЕЛЫЙ КОНТЕЙНЕР (1 К 1 С ФИГМОЙ) */}
            <div className="bg-white w-full max-w-[1280px] min-h-[85vh] rounded-[24px] shadow-2xl flex flex-col relative overflow-hidden">

                {/* ================= ШАПКА ================= */}
                <header className="flex justify-between items-center px-10 py-8 relative z-20">

                    {/* Левое меню */}
                    <nav className="hidden md:flex gap-6 text-[11px] font-black tracking-widest uppercase">
                        <Link href="#" className="hover:text-gray-500 transition-colors">Women</Link>
                        <Link href="#" className="hover:text-gray-500 transition-colors">Men</Link>
                        <Link href="#" className="hover:text-gray-500 transition-colors">Kids</Link>
                        <Link href="#" className="text-red-500 hover:text-red-400 transition-colors">Sale</Link>
                    </nav>

                    {/* Скошенный логотип по центру */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                        <Link href="/" className="bg-black text-white px-5 py-1.5 skew-x-[15deg] hover:bg-gray-800 transition-colors">
                            <h1 className="skew-x-[-15deg] font-black text-lg italic tracking-[0.2em] uppercase">SNEAKER STORE</h1>
                        </Link>
                    </div>

                    {/* Иконки справа */}
                    <div className="flex gap-6 items-center text-black">
                        <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity"><SearchIcon /></button>
                        <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity"><BagIcon /></Link>
                        <button onClick={() => setIsAuthOpen(true)} className="hover:opacity-50 transition-opacity"><UserIcon /></button>
                    </div>
                </header>

                {/* ================= ГЛАВНЫЙ ЭКРАН (HERO) ================= */}
                <main className="flex-1 flex flex-col relative z-10 px-10 pb-10">

                    <div className="flex flex-col lg:flex-row items-center flex-1 h-full mt-4">

                        {/* ЛЕВЫЙ БЛОК: Текст и Кнопка */}
                        <div className="w-full lg:w-5/12 flex flex-col items-start z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeShoe.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.95] tracking-tighter mb-6">
                                        <span className="block">{activeShoe.title1}</span>
                                        <span className="block">{activeShoe.title2}</span>
                                        <span className="block">{activeShoe.title3}</span>
                                    </h2>
                                    <p className="text-gray-800 font-medium text-xs tracking-widest uppercase whitespace-pre-line mb-8 leading-relaxed">
                                        {activeShoe.subtitle}
                                    </p>
                                    <button className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-colors">
                                        Shop Now
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* ПРАВЫЙ БЛОК: Слайдер с Кроссовком и Стрелками */}
                        <div className="w-full lg:w-7/12 h-[450px] relative flex items-center justify-center mt-10 lg:mt-0">

                            <button onClick={prevShoe} className="absolute left-0 z-30 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-black">
                                <ArrowLeft />
                            </button>

                            <motion.div
                                className="w-full h-full flex items-center justify-center relative z-20 perspective-1000"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{ rotateX, rotateY }}
                            >
                                <AnimatePresence mode="popLayout">
                                    <motion.img
                                        key={activeShoe.id}
                                        src={activeShoe.img}
                                        alt={activeShoe.name}
                                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="w-full max-w-[600px] object-contain drop-shadow-2xl mix-blend-multiply pointer-events-none"
                                    />
                                </AnimatePresence>
                            </motion.div>

                            <button onClick={nextShoe} className="absolute right-0 z-30 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-black">
                                <ArrowRight />
                            </button>

                        </div>
                    </div>

                    {/* ================= НИЖНИЕ КАРТОЧКИ (СТРОГО ПО ФИГМЕ) ================= */}
                    <div className="flex gap-6 mt-16 pb-4">

                        {/* Карточка 1 */}
                        <div className="flex-1 border border-gray-200 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-xs mb-1">Air Jordan 1</h4>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-wider">Classic / Black</p>
                                </div>
                                <div className="text-gray-400 group-hover:text-black transition-colors"><ArrowRightLong /></div>
                            </div>
                            <div className="h-32 mt-6 flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1597045566677-8cf039d7f6a4?q=80&w=500&auto=format&fit=crop" alt="Jordan 1" className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 origin-bottom" />
                            </div>
                        </div>

                        {/* Карточка 2 */}
                        <div className="flex-1 border border-gray-200 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-xs mb-1">Jordan Mids</h4>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-wider">Bred Toe / Red</p>
                                </div>
                                <div className="text-gray-400 group-hover:text-black transition-colors"><ArrowRightLong /></div>
                            </div>
                            <div className="h-32 mt-6 flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=500&auto=format&fit=crop" alt="Jordan Mids" className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 origin-bottom" />
                            </div>
                        </div>

                    </div>

                </main>
            </div>

            {/* ================= МОДАЛКА АВТОРИЗАЦИИ ================= */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-3xl p-10 relative shadow-2xl">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><CloseIcon /></button>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Welcome</h2>
                            <p className="text-xs text-gray-500 tracking-widest uppercase mb-8">Sign in to your account</p>

                            <div className="flex flex-col gap-4">
                                <input type="email" placeholder="E-mail" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                                <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                                <button onClick={() => setIsAuthOpen(false)} className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs mt-2 hover:bg-gray-800 transition-colors">
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= ОВЕРЛЕЙ ПОИСКА ================= */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-50 flex flex-col px-10 py-8">
                        <div className="flex justify-between items-center mb-16 max-w-[1200px] mx-auto w-full">
                            <span className="font-black italic tracking-widest uppercase">Search</span>
                            <button onClick={() => setIsSearchOpen(false)} className="text-black hover:opacity-50 transition-opacity"><CloseIcon /></button>
                        </div>
                        <div className="max-w-[800px] mx-auto w-full">
                            <input
                                type="text"
                                autoFocus
                                placeholder="TYPE SNEAKER NAME..."
                                className="w-full text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-black placeholder-gray-200 focus:outline-none border-b-4 border-black pb-4"
                            />
                            <p className="text-gray-400 text-xs tracking-widest uppercase mt-6 font-bold">Trending: Jordan 1, Uptempo, LV Skate</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
        </div>
    );
}