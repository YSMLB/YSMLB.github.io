"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

// --- ДАННЫЕ ДЛЯ ГЛАВНОГО СЛАЙДЕРА (HERO) ---
const heroShoes = [
    {
        id: 1,
        title1: "BUILT",
        title2: "FOR",
        title3: "FLIGHT",
        subtitle: "INTRODUCING OUR LIGHTEST\nSHOE EVER",
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

// --- ГЕНЕРАЦИЯ 30 ЗАГЛУШЕК ДЛЯ КАТАЛОГА ---
const catalogShoes = Array.from({ length: 30 }, (_, i) => {
    // Чередуем 3 разные модели для разнообразия
    const type = i % 3;
    return {
        id: i + 1,
        name: type === 0 ? "AIR JORDAN 1" : type === 1 ? "JORDAN MIDS" : "NIKE AIR MAX 95",
        subtitle: type === 0 ? "Classic / Black" : type === 1 ? "Bred Toe / Red" : "Essential / Colorway",
        img: type === 0
            ? "https://images.unsplash.com/photo-1597045566677-8cf039d7f6a4?q=80&w=500&auto=format&fit=crop"
            : type === 1
                ? "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=500&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500&auto=format&fit=crop"
    };
});

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Состояния модалок
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // 3D Анимация при наведении
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

    const nextShoe = () => setCurrentIndex((prev) => (prev + 1) % heroShoes.length);
    const prevShoe = () => setCurrentIndex((prev) => (prev - 1 + heroShoes.length) % heroShoes.length);

    const activeShoe = heroShoes[currentIndex];

    return (
        // FULL SCREEN LAYOUT (Edge-to-Edge)
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden selection:bg-black selection:text-white">

            {/* ================= ШАПКА ================= */}
            <header className="w-full bg-white/90 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center fixed top-0 z-50 border-b border-gray-100">

                {/* Левое меню */}
                <nav className="hidden md:flex gap-8 text-sm font-black tracking-widest uppercase">
                    <Link href="#" className="hover:text-gray-500 transition-colors">Women</Link>
                    <Link href="#" className="hover:text-gray-500 transition-colors">Men</Link>
                    <Link href="#" className="hover:text-gray-500 transition-colors">Kids</Link>
                    <Link href="#" className="hover:text-gray-500 transition-colors">Sale</Link>
                </nav>

                {/* Скошенный логотип по центру */}
                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                    <Link href="/" className="bg-[#111] text-white px-6 py-2 skew-x-[-12deg] hover:bg-gray-800 transition-colors">
                        <h1 className="skew-x-[12deg] font-black text-xl italic tracking-[0.1em] uppercase">SNEAKER STORE</h1>
                    </Link>
                </div>

                {/* Иконки справа */}
                <div className="flex gap-8 items-center text-black">
                    <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity"><SearchIcon /></button>
                    <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity"><BagIcon /></Link>
                    <button onClick={() => setIsAuthOpen(true)} className="hover:opacity-50 transition-opacity"><UserIcon /></button>
                </div>
            </header>

            {/* ================= ГЛАВНЫЙ ЭКРАН (HERO) ================= */}
            <main className="pt-32 px-6 md:px-12 max-w-[1800px] mx-auto">

                <section className="flex flex-col lg:flex-row items-center w-full min-h-[60vh] lg:min-h-[70vh] mb-20 relative">

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
                                <h2 className="text-7xl lg:text-[110px] font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
                                    <span className="block">{activeShoe.title1}</span>
                                    <span className="block">{activeShoe.title2}</span>
                                    <span className="block">{activeShoe.title3}</span>
                                </h2>
                                <p className="text-gray-800 font-medium text-sm md:text-base uppercase whitespace-pre-line mb-10 leading-relaxed max-w-sm">
                                    {activeShoe.subtitle}
                                </p>
                                <button className="bg-[#111] text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">
                                    Shop Now
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ПРАВЫЙ БЛОК: 3D Слайдер */}
                    <div className="w-full lg:w-7/12 h-[500px] lg:h-[700px] relative flex items-center justify-center mt-12 lg:mt-0">

                        <button onClick={prevShoe} className="absolute left-0 lg:-left-8 z-30 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg text-black">
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
                                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    className="w-full max-w-[800px] object-contain drop-shadow-2xl mix-blend-multiply pointer-events-none"
                                />
                            </AnimatePresence>
                        </motion.div>

                        <button onClick={nextShoe} className="absolute right-0 lg:right-8 z-30 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg text-black">
                            <ArrowRight />
                        </button>

                    </div>
                </section>

                {/* ================= КАТАЛОГ (30 ПАР КРОССОВОК) ================= */}
                <section className="mb-24">
                    <div className="flex justify-between items-end mb-10">
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                            Explore Collection
                        </h3>
                        <span className="text-gray-400 font-bold text-sm tracking-widest uppercase hidden md:block">
                            {catalogShoes.length} Items found
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {catalogShoes.map((shoe) => (
                            <div
                                key={shoe.id}
                                className="border border-gray-200 rounded-[30px] p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:border-gray-300 transition-all bg-white relative overflow-hidden"
                            >
                                {/* Заголовок и стрелка */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-sm md:text-base mb-1 text-black">
                                            {shoe.name}
                                        </h4>
                                        {/* При наведении появляется фейковая цена */}
                                        <p className="text-xs text-gray-500 font-bold tracking-wider group-hover:hidden block">
                                            {shoe.subtitle}
                                        </p>
                                        <p className="text-xs text-black font-black tracking-wider hidden group-hover:block transition-all">
                                            $ {(Math.random() * 200 + 100).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all">
                                        <ArrowRightLong />
                                    </div>
                                </div>

                                {/* Картинка */}
                                <div className="h-48 md:h-56 mt-8 flex items-end justify-center relative z-10">
                                    <img
                                        src={shoe.img}
                                        alt={shoe.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-500 origin-bottom"
                                    />
                                </div>

                                {/* Легкий серый фон при наведении */}
                                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    {/* Кнопка "Загрузить еще" */}
                    <div className="flex justify-center mt-16">
                        <button className="border-2 border-black text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                            Load More
                        </button>
                    </div>
                </section>

            </main>

            {/* ================= МОДАЛКА АВТОРИЗАЦИИ ================= */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[30px] p-10 relative shadow-2xl">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><CloseIcon /></button>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome</h2>
                            <p className="text-xs text-gray-500 tracking-widest uppercase mb-8">Sign in to your account</p>

                            <div className="flex flex-col gap-4">
                                <input type="email" placeholder="E-mail" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-gray-400" />
                                <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-gray-400" />
                                <button onClick={() => setIsAuthOpen(false)} className="w-full bg-[#111] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-4 hover:bg-gray-800 transition-colors shadow-lg">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-white z-[100] flex flex-col px-6 md:px-12 py-8 overflow-hidden">
                        <div className="flex justify-between items-center mb-16 max-w-[1400px] mx-auto w-full mt-4">
                            <span className="font-black italic tracking-widest uppercase text-xl">Search</span>
                            <button onClick={() => setIsSearchOpen(false)} className="text-black hover:opacity-50 transition-opacity"><CloseIcon /></button>
                        </div>
                        <div className="max-w-[1000px] mx-auto w-full flex flex-col items-center justify-center flex-1 pb-32">
                            <input
                                type="text"
                                autoFocus
                                placeholder="TYPE SNEAKER NAME..."
                                className="w-full text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-center text-black placeholder-gray-200 focus:outline-none border-b-4 border-black pb-4 md:pb-8"
                            />
                            <p className="text-gray-400 text-xs md:text-sm tracking-widest uppercase mt-8 font-bold text-center">
                                Trending: Jordan 1, Uptempo, LV Skate, Dunk Low
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Глобальные стили для перспективы */}
            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
        </div>
    );
}