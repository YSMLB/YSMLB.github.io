"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

// --- БАЗА ДАННЫХ КРОССОВОК ---
const shoes = [
    {
        id: 1,
        name: "LV Skate Sneaker",
        brand: "Louis Vuitton",
        color: "Green / White",
        price: "$1,340",
        bgText: "LV SKATE",
        // Используем максимально похожие студийные фото на белом фоне
        img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
        desc: "Вдохновленные скейт-культурой 90-х. Массивная шнуровка и объемный силуэт."
    },
    {
        id: 2,
        name: "Air Jordan 1 Retro",
        brand: "Nike",
        color: "Chicago / Black / White",
        price: "$180",
        bgText: "JORDAN 1",
        img: "https://images.unsplash.com/photo-1597045566677-8cf039d7f6a4?q=80&w=1000&auto=format&fit=crop",
        desc: "Обувь, которая навсегда изменила сникер-культуру. Классика вне времени."
    },
    {
        id: 3,
        name: "Air More Uptempo '96",
        brand: "Nike",
        color: "Black / White",
        price: "$170",
        bgText: "UPTEMPO",
        img: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=1000&auto=format&fit=crop",
        desc: "Дизайн, который невозможно не заметить. Легендарная надпись AIR."
    }
];

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Логика 3D параллакса при наведении мыши
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [15, -15]);
    const rotateY = useTransform(x, [-300, 300], [-15, 15]);

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
        // Внешний фон как на макете Figma (сероватый оттенок)
        <div className="min-h-screen bg-[#c5bbb6] p-4 md:p-8 flex items-center justify-center font-sans text-black selection:bg-black selection:text-white">

            {/* Главный белый контейнер сайта */}
            <div className="bg-white w-full max-w-[1400px] min-h-[90vh] rounded-[30px] shadow-2xl overflow-hidden flex flex-col relative">

                {/* === НАВИГАЦИЯ (ШАПКА) === */}
                <header className="flex justify-between items-center px-8 md:px-16 py-8 relative z-20">
                    <nav className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase">
                        <Link href="#" className="hover:opacity-60 transition-opacity">Women</Link>
                        <Link href="#" className="hover:opacity-60 transition-opacity">Men</Link>
                        <Link href="#" className="hover:opacity-60 transition-opacity">Kids</Link>
                        <Link href="#" className="text-red-500 hover:opacity-60 transition-opacity">Sale</Link>
                    </nav>

                    <Link href="/" className="bg-black text-white px-6 py-2 skew-x-[-10deg] absolute left-1/2 -translate-x-1/2">
                        <h1 className="skew-x-[10deg] font-black text-xl italic tracking-widest uppercase">SNEAKER STORE</h1>
                    </Link>

                    <div className="flex gap-6 items-center">
                        <button className="hover:scale-110 transition-transform"><SearchIcon /></button>
                        <button className="hover:scale-110 transition-transform"><BagIcon /></button>
                        <button className="hover:scale-110 transition-transform"><UserIcon /></button>
                    </div>
                </header>

                {/* === ГЛАВНЫЙ ЭКРАН (СЛАЙДЕР) === */}
                <main className="flex-1 flex flex-col relative z-10 px-8 md:px-16 pb-12">

                    {/* Скрытый огромный текст на фоне (из видео) */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-5">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={activeShoe.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="text-[15vw] font-black tracking-tighter whitespace-nowrap"
                            >
                                {activeShoe.bgText}
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center flex-1 h-full relative z-10">

                        {/* Левый блок с текстом */}
                        <div className="w-full lg:w-1/3 flex flex-col items-start pt-10 lg:pt-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeShoe.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <p className="font-bold text-gray-400 tracking-widest text-sm mb-4 uppercase">{activeShoe.brand}</p>
                                    <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
                                        {activeShoe.name.split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </h2>
                                    <p className="text-gray-500 font-medium max-w-sm mb-8">
                                        {activeShoe.desc}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <button className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
                                            Shop Now
                                        </button>
                                        <span className="text-2xl font-black">{activeShoe.price}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Центральный блок с 3D Кроссовком */}
                        <div className="w-full lg:w-2/3 h-[50vh] lg:h-[60vh] relative flex items-center justify-center">

                            {/* Стрелка Влево */}
                            <button onClick={prevShoe} className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all z-30 shadow-lg">
                                <ArrowLeft />
                            </button>

                            {/* Зона для 3D вращения */}
                            <motion.div
                                className="w-full h-full flex items-center justify-center relative z-20 cursor-grab active:cursor-grabbing perspective-1000"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{ rotateX, rotateY }}
                            >
                                <AnimatePresence mode="popLayout">
                                    <motion.img
                                        key={activeShoe.id}
                                        src={activeShoe.img}
                                        alt={activeShoe.name}
                                        initial={{ opacity: 0, scale: 0.6, rotate: -15, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1.1, rotate: -5, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: 10, filter: "blur(10px)" }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        // Трюк: mix-blend-multiply делает белый фон картинки прозрачным
                                        className="w-full max-w-[700px] object-contain drop-shadow-2xl pointer-events-none mix-blend-multiply"
                                    />
                                </AnimatePresence>

                                {/* Подсказка */}
                                <div className="absolute bottom-0 text-gray-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2 animate-pulse pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /><path d="M12 19l-7-7 7-7" /></svg>
                                    Hover to examine
                                </div>
                            </motion.div>

                            {/* Стрелка Вправо */}
                            <button onClick={nextShoe} className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all z-30 shadow-lg">
                                <ArrowRight />
                            </button>
                        </div>

                    </div>

                    {/* === НИЖНИЕ КАРТОЧКИ (КАК В FIGMA) === */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-gray-100 relative z-20">

                        {/* Карточка 1 */}
                        <div className="border border-gray-200 rounded-[20px] p-6 hover:shadow-xl transition-shadow flex items-center justify-between group cursor-pointer bg-white">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Nike Air Max 95</h4>
                                    <ArrowRightLong />
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-4">Essential / Black</p>
                                <img
                                    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop"
                                    alt="Air Max 95"
                                    className="w-48 h-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 origin-bottom-left"
                                />
                            </div>
                        </div>

                        {/* Карточка 2 */}
                        <div className="border border-gray-200 rounded-[20px] p-6 hover:shadow-xl transition-shadow flex items-center justify-between group cursor-pointer bg-white">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Air Jordan Mids</h4>
                                    <ArrowRightLong />
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-4">Bred Toe / Red</p>
                                <img
                                    src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=800&auto=format&fit=crop"
                                    alt="Jordan Mids"
                                    className="w-48 h-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 origin-bottom-left"
                                />
                            </div>
                        </div>

                    </div>

                </main>
            </div>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
        </div>
    );
}