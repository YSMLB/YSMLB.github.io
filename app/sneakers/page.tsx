"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

// --- 3D ИМПОРТЫ ---
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Bounds, Center, Html } from "@react-three/drei";

// =====================================================================
// ПРЕДОХРАНИТЕЛЬ: Защита от черного экрана
// =====================================================================
class ModelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-3 rounded-lg font-black tracking-widest text-[10px] uppercase text-center backdrop-blur-md">
                        Error<br />Model file not found
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

function ShoeModel({ path }: { path: string }) {
    const { scene } = useGLTF(path);
    return <primitive object={scene} />;
}

// --- ДАННЫЕ ДЛЯ ГЛАВНОГО СЛАЙДЕРА (HERO) ---
const heroShoes = [
    { id: 1, title1: "BUILT", title2: "FOR", title3: "FLIGHT", subtitle: "INTRODUCING OUR LIGHTEST\nSHOE EVER", name: "Air Jordan 1", img: "/Jordan1.jpg" },
    { id: 2, title1: "LUXURY", title2: "MEETS", title3: "STREET", subtitle: "NEW LOUIS VUITTON SKATE\nGREEN / WHITE EDITION", name: "LV Skate Sneaker", img: "/skateGW.jpg" }
];

// --- ТВОЙ КАТАЛОГ ---
const initialCatalogShoes = [
    { id: 3, name: "Air Jordan 1 Retro High", subtitle: "Chicago", price: "180.00", category: "MEN", isSale: false, bgText: "JORDAN", img: "/AirJordan1RetroHigh.jpg", model: "/models/3.glb" },
    { id: 4, name: "Nike Dunk Low", subtitle: "Panda", price: "110.00", category: "WOMEN", isSale: false, bgText: "DUNK LOW", img: "/NikeDunkLow.jpg", model: "/models/4.glb" },
    { id: 5, name: "Air More Uptempo '96", subtitle: "Black / White", price: "160.00", category: "MEN", isSale: true, bgText: "UPTEMPO", img: "/AirMoreUptempo96.jpg", model: "/models/5.glb" },
    { id: 6, name: "Nike Air Max", subtitle: "Travis Scott", price: "150.00", category: "MEN", isSale: false, bgText: "SB DUNK", img: "/NikeSBDunkLow.jpg", model: "/models/6.glb" },
    { id: 7, name: "Nike Air Force 1 '07", subtitle: "Triple White", price: "115.00", category: "WOMEN", isSale: false, bgText: "FORCE 1", img: "/NikeAirForce107.jpg", model: "/models/7.glb" },
    { id: 8, name: "Air Jordan 4 Retro", subtitle: "Military Black", price: "210.00", category: "MEN", isSale: false, bgText: "JORDAN 4", img: "/AirJordan4Retro.jpg", model: "/models/8.glb" },
    { id: 9, name: "Nike tc 7900", subtitle: "Sunset", price: "175.00", category: "MEN", isSale: true, bgText: "TC", img: "/NikeAirMaxPlus.jpg", model: "/models/9.glb" },
    { id: 10, name: "Nike Blazer Mid '77", subtitle: "Vintage White", price: "105.00", category: "WOMEN", isSale: false, bgText: "BLAZER", img: "/NikeBlazerMid77.jpg", model: "/models/10.glb" },
    { id: 12, name: "Nike Air Mag", subtitle: "Cobblestone", price: "160.00", category: "MEN", isSale: true, bgText: "MAG", img: "/NikeZoomVomero5.jpg", model: "/models/12.glb" },
    { id: 13, name: "Nike Air Max 720", subtitle: "Triple Black", price: "160.00", category: "KIDS", isSale: false, bgText: "AIR MAX", img: "/NikeAirMax270.jpg", model: "/models/13.glb" },
    { id: 14, name: "Air Jordan 1 Retro", subtitle: "White Cement", price: "200.00", category: "KIDS", isSale: false, bgText: "JORDAN 1", img: "/AirJordan3Retro.jpg", model: "/models/14.glb" },
    { id: 15, name: "Nike React Presto", subtitle: "Wolf Grey", price: "210.00", category: "MEN", isSale: false, bgText: "REACT PRESTO", img: "/NikeAirVaporMaxPlus.jpg", model: "/models/15.glb" },
];

initialCatalogShoes.forEach((shoe) => {
    if (shoe.model) useGLTF.preload(shoe.model);
});

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;


// =====================================================================
// ВНУТРЕННЯЯ 3D СЦЕНА (ИДЕАЛЬНЫЙ МАСШТАБ И ТЕНИ)
// =====================================================================
const CinematicScene = ({ shoe, showUI }: { shoe: any, showUI: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        const targetAngle = -1.0;
        const startAngle = targetAngle + Math.PI * 3;

        if (groupRef.current) {
            const controls = animate(startAngle, targetAngle, {
                type: "tween",
                duration: 4,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (v) => {
                    if (groupRef.current) groupRef.current.rotation.y = v;
                }
            });
            return () => controls.stop();
        }
    }, []);

    return (
        <>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            <Environment preset="city" />

            <group ref={groupRef}>
                <Suspense fallback={null}>
                    {/* ФИКС МАСШТАБА: Bounds теперь не видит бесконечную тень, а ориентируется только на модель */}
                    <Bounds fit clip observe margin={1.2}>
                        {/* Center bottom ставит подошву строго на уровень Y=0 */}
                        <Center bottom>
                            <ShoeModel path={shoe.model} />
                        </Center>
                    </Bounds>

                    {/* ФИКС ТЕНИ: Тень вынесена ЗА пределы Bounds, лежит ровно на Y=0 под подошвой */}
                    <ContactShadows position={[0, 0, 0]} opacity={0.65} scale={10} blur={2.5} far={4} resolution={512} />
                </Suspense>
            </group>

            <OrbitControls
                makeDefault
                enableRotate={showUI}
                enableZoom={showUI}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
};


// =====================================================================
// ПЛАВНАЯ АНИМАЦИЯ И ДИНАМИЧЕСКАЯ ЖУРНАЛЬНАЯ ВЕРСТКА
// =====================================================================
const ProductCinematicView = ({ shoe, onClose }: { shoe: any, onClose: () => void }) => {
    const [showUI, setShowUI] = useState(false);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowUI(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    // Умное разделение длинного названия модели на 2 строки для дизайна
    const nameParts = shoe.name.split(" ");
    const midIndex = Math.ceil(nameParts.length / 2);
    const nameLine1 = nameParts.slice(0, midIndex).join(" ");
    const nameLine2 = nameParts.slice(midIndex).join(" ");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-[#fafafa] overflow-hidden flex flex-col"
            onClick={() => setShowUI(true)}
        >
            <header className="absolute top-0 left-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50 pointer-events-auto">
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex items-center gap-2 font-black uppercase tracking-widest text-[11px] hover:text-gray-500 transition-colors text-[#111]">
                    <ArrowLeft /> BACK TO CATALOG
                </button>
                <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity text-[#111]"><BagIcon /></Link>
            </header>

            {/* ОСНОВНОЙ БЛОК (Сдвигается влево как единое целое) */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-auto"
                initial={{ x: "0%" }}
                animate={{ x: showUI ? "-22.5%" : "0%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Огромный фоновый текст */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <h1 className="text-[28vw] font-black italic text-[#ebebeb] tracking-tighter leading-none whitespace-nowrap select-none">
                        {shoe.bgText}
                    </h1>
                </div>

                {/* ДИНАМИЧЕСКАЯ ЖУРНАЛЬНАЯ ТИПОГРАФИКА */}
                <AnimatePresence>
                    {showUI && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="absolute inset-0 z-10 pointer-events-none"
                        >
                            {/* Левый верхний блок (Имя и подзаголовок модели) */}
                            <div className="absolute top-[20%] left-[8%] md:left-[12%] max-w-[400px]">
                                <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-gray-400">
                                    COLLECTION • {shoe.category}
                                </p>
                                <h3 className="text-4xl lg:text-[55px] font-black uppercase leading-[0.95] tracking-tighter text-[#111] break-words">
                                    {nameLine1}<br />
                                    {nameLine2}<br />
                                    <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #111' }}>
                                        {shoe.subtitle}
                                    </span>
                                </h3>
                            </div>

                            {/* Правый нижний блок (Динамическая цитата) */}
                            <div className="absolute bottom-[20%] right-[48%] md:right-[50%] text-right max-w-xs">
                                <p className="text-lg lg:text-2xl font-serif italic text-[#111] leading-snug">
                                    The world <br />
                                    Had never seen <br />
                                    <span className="font-black not-italic uppercase tracking-tighter">{shoe.bgText} sneakers</span><br />
                                    Like this before
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3D СЦЕНА */}
                <div className="absolute inset-0 z-20">
                    <ModelErrorBoundary>
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                            <CinematicScene shoe={shoe} showUI={showUI} />
                        </Canvas>
                    </ModelErrorBoundary>
                </div>

                <AnimatePresence>
                    {showUI && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase animate-pulse pointer-events-none z-30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /><path d="M12 19l-7-7 7-7" /></svg>
                            Drag to rotate
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ПАНЕЛЬ ИНТЕРФЕЙСА */}
            <AnimatePresence>
                {showUI && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-0 h-full w-[45%] z-40 flex flex-col justify-center px-10 lg:px-20 bg-white/95 backdrop-blur-xl shadow-[-30px_0_60px_rgba(0,0,0,0.05)] pointer-events-auto border-l border-gray-100"
                    >
                        <p className="text-gray-400 font-bold text-[10px] tracking-[0.15em] uppercase mb-2">{shoe.subtitle}</p>
                        <h2 className="text-5xl lg:text-[70px] font-black italic uppercase leading-[0.9] tracking-tighter mb-4 text-[#111]">{shoe.name}</h2>
                        <p className="text-xl lg:text-2xl font-bold mb-12 text-[#111]">$ {shoe.price}</p>

                        <div className="mb-10 w-full max-w-[420px]">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#111]">Select Size (EU)</span>
                                <span className="text-[10px] font-bold text-gray-400 underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3.5 rounded border font-bold text-sm transition-all ${selectedSize === size ? 'bg-[#111] text-white border-[#111]' : 'bg-transparent text-[#111] border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full max-w-[420px] bg-[#111] text-white py-5 font-bold uppercase tracking-[0.15em] text-xs hover:bg-black transition-colors rounded-sm shadow-xl">
                            Add To Cart
                        </button>

                        <div className="mt-8 text-[11px] text-gray-500 font-medium leading-relaxed max-w-[420px]">
                            <p className="mb-1 uppercase tracking-widest font-black text-[#111]">Free Shipping</p>
                            <p>Standard delivery 3-5 working days. Express delivery available at checkout.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// =====================================================================
// ГЛАВНЫЙ КОМПОНЕНТ САЙТА (КАТАЛОГ)
// =====================================================================
export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileView, setProfileView] = useState("menu");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: "MY PROFILE", email: "user@sneakerstore.com" });
    const [tempProfileData, setTempProfileData] = useState(profileData);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");
    const [visibleCount, setVisibleCount] = useState(8);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const nextShoe = () => setCurrentIndex((prev) => (prev + 1) % heroShoes.length);
    const prevShoe = () => setCurrentIndex((prev) => (prev - 1 + heroShoes.length) % heroShoes.length);
    const activeShoe = heroShoes[currentIndex];

    const displayedCatalog = initialCatalogShoes
        .filter(shoe => activeTab === "ALL" || shoe.category === activeTab || (activeTab === "SALE" && shoe.isSale))
        .filter(shoe => !activeSearch || shoe.name.toLowerCase().includes(activeSearch.toLowerCase()));

    const currentVisibleCatalog = displayedCatalog.slice(0, visibleCount);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setActiveSearch(searchInput);
            setIsSearchOpen(false);
            setVisibleCount(8);
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setVisibleCount(8);
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setIsAuthOpen(false);
    };

    const handleUserIconClick = () => {
        if (isLoggedIn) {
            setProfileView("menu");
            setIsProfileOpen(true);
        } else {
            setIsAuthOpen(true);
        }
    };

    const handleSaveProfile = () => {
        setProfileData(tempProfileData);
        setIsEditingProfile(false);
        setProfileView("menu");
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans overflow-x-hidden pb-20 selection:bg-black selection:text-white">

            <header className="w-full bg-white/95 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center fixed top-0 z-40 border-b border-gray-100">
                <div className="flex items-center gap-6 md:gap-12">
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2">
                        ← <span className="hidden md:inline">Back to Portfolio</span>
                    </Link>
                    <nav className="hidden md:flex gap-8 text-[13px] font-black tracking-[0.15em] uppercase">
                        <button onClick={() => handleTabClick("WOMEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "WOMEN" ? "border-b-2 border-black" : ""}`}>Women</button>
                        <button onClick={() => handleTabClick("MEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "MEN" ? "border-b-2 border-black" : ""}`}>Men</button>
                        <button onClick={() => handleTabClick("KIDS")} className={`hover:opacity-60 transition-opacity ${activeTab === "KIDS" ? "border-b-2 border-black" : ""}`}>Kids</button>
                        <button onClick={() => handleTabClick("SALE")} className={`hover:opacity-60 transition-opacity ${activeTab === "SALE" ? "border-b-2 border-red-500 text-red-500" : ""}`}>Sale</button>
                    </nav>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center cursor-pointer" onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }}>
                    <div className="bg-[#111] text-white hover:bg-gray-800 px-6 py-2 skew-x-[-12deg] transition-colors">
                        <h1 className="skew-x-[12deg] font-black text-xl italic tracking-[0.1em] uppercase">SNEAKER STORE</h1>
                    </div>
                </div>

                <div className="flex gap-8 items-center text-black">
                    <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity"><SearchIcon /></button>
                    <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity"><BagIcon /></Link>
                    <button onClick={handleUserIconClick} className="hover:opacity-50 transition-opacity">
                        {isLoggedIn ? <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">ME</div> : <UserIcon />}
                    </button>
                </div>
            </header>

            <main className="pt-32 px-6 md:px-12 max-w-[1800px] mx-auto">
                <section className="flex flex-col lg:flex-row items-center w-full min-h-[60vh] lg:min-h-[70vh] mb-20 relative">
                    <div className="w-full lg:w-5/12 flex flex-col items-start z-20">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeShoe.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                <h2 className="text-7xl lg:text-[110px] font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
                                    <span className="block">{activeShoe.title1}</span><span className="block">{activeShoe.title2}</span><span className="block">{activeShoe.title3}</span>
                                </h2>
                                <p className="text-gray-800 font-medium text-sm md:text-base uppercase whitespace-pre-line mb-10 leading-relaxed max-w-sm">
                                    {activeShoe.subtitle}
                                </p>
                                <button onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#111] text-white hover:bg-gray-800 px-12 py-5 font-bold uppercase tracking-widest text-sm shadow-xl transition-colors">
                                    Shop Now
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="w-full lg:w-7/12 h-[450px] lg:h-[600px] relative flex items-center justify-center mt-12 lg:mt-0">
                        <button onClick={prevShoe} className="absolute left-0 lg:-left-4 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg bg-white text-black border border-gray-100"><ArrowLeft /></button>
                        <div className="w-full h-full flex items-center justify-center relative z-20">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeShoe.id}
                                    src={activeShoe.img}
                                    alt={activeShoe.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-[750px] object-contain drop-shadow-2xl mix-blend-multiply pointer-events-none"
                                />
                            </AnimatePresence>
                        </div>
                        <button onClick={nextShoe} className="absolute right-0 lg:right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg bg-white text-black border border-gray-100"><ArrowRight /></button>
                    </div>
                </section>

                <section id="catalog-section" className="mb-24 scroll-mt-32">
                    <div className="flex justify-between items-end mb-10 border-b border-black/10 pb-6">
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                            {activeSearch ? `Search: "${activeSearch}"` : activeTab !== "ALL" ? `${activeTab} COLLECTION` : "Explore Collection"}
                        </h3>
                        <span className="text-gray-400 font-bold text-sm tracking-widest uppercase hidden md:block">
                            {displayedCatalog.length} Items found
                        </span>
                    </div>

                    {displayedCatalog.length === 0 ? (
                        <div className="py-20 text-center">
                            <h2 className="text-3xl font-black uppercase mb-4 text-gray-300">No sneakers found</h2>
                            <button onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }} className="border-b-2 font-bold uppercase tracking-widest text-sm pb-1 border-black hover:text-gray-500">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {currentVisibleCatalog.map((shoe) => (
                                    <div
                                        key={shoe.id}
                                        onClick={() => setSelectedProduct(shoe)}
                                        className="bg-white border-gray-200 hover:border-gray-300 border rounded-[30px] p-6 md:p-8 flex flex-col justify-between group cursor-pointer transition-all relative overflow-hidden"
                                    >
                                        {shoe.isSale && (
                                            <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm z-20">SALE</div>
                                        )}
                                        {shoe.model && (
                                            <div className="absolute top-6 right-6 bg-[#111] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm z-20 shadow-md">3D VIEW</div>
                                        )}

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="mt-6 md:mt-0">
                                                <h4 className="font-black uppercase tracking-widest text-sm md:text-base mb-1 text-[#111]">{shoe.name}</h4>
                                                <p className="text-[10px] font-bold tracking-wider group-hover:hidden block text-gray-400 uppercase">{shoe.subtitle}</p>
                                                <p className="text-sm font-black tracking-wider hidden group-hover:block transition-all text-[#111]">$ {shoe.price}</p>
                                            </div>
                                            <div className="text-gray-300 group-hover:text-[#111] group-hover:translate-x-1 transition-all"><ArrowRightLong /></div>
                                        </div>
                                        <div className="h-48 md:h-56 mt-8 flex items-end justify-center relative z-10">
                                            <img src={shoe.img} alt={shoe.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-4 transition-transform duration-500 origin-bottom" />
                                        </div>
                                        <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                                    </div>
                                ))}
                            </div>

                            {visibleCount < displayedCatalog.length && (
                                <div className="flex justify-center mt-16">
                                    <button onClick={() => setVisibleCount(prev => prev + 8)} className="border-2 border-[#111] text-[#111] px-12 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#111] hover:text-white transition-colors rounded-sm">
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            {/* ВЫЗОВ МОДАЛКИ С 3D */}
            <AnimatePresence>
                {selectedProduct && <ProductCinematicView shoe={selectedProduct} onClose={() => setSelectedProduct(null)} />}
            </AnimatePresence>

            {/* ================= МОДАЛКИ АВТОРИЗАЦИИ И ПРОФИЛЯ ================= */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white border border-gray-100 text-black w-full max-w-md rounded-[30px] p-10 relative shadow-2xl">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><CloseIcon /></button>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome</h2>
                            <p className="text-xs opacity-50 tracking-widest uppercase mb-8">Sign in to your account</p>

                            <div className="flex flex-col gap-4">
                                <input type="email" placeholder="E-mail" className="w-full bg-gray-50 border-gray-200 text-black focus:border-black border rounded-xl px-4 py-4 text-sm font-medium transition-colors" />
                                <input type="password" placeholder="Password" className="w-full bg-gray-50 border-gray-200 text-black focus:border-black border rounded-xl px-4 py-4 text-sm font-medium transition-colors" />
                                <button onClick={handleLogin} className="w-full bg-[#111] text-white hover:bg-gray-800 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-4 shadow-lg transition-colors">
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white border border-gray-100 text-black w-full max-w-[420px] rounded-[30px] p-10 relative shadow-2xl">
                            <button onClick={() => { setIsProfileOpen(false); setIsEditingProfile(false); }} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><CloseIcon /></button>

                            {profileView === "menu" && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg bg-[#111] text-white hover:bg-gray-800">ME</div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black uppercase tracking-tight">{profileData.name}</h2>
                                            <p className="text-[10px] opacity-50 tracking-widest uppercase mb-1">MEMBER SINCE 2026</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-10">
                                        <button onClick={() => setProfileView("history")} className="w-full flex justify-between items-center p-5 rounded-[16px] transition-colors bg-[#fafafa] hover:bg-gray-100">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Order History</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button onClick={() => setProfileView("saved")} className="w-full flex justify-between items-center p-5 rounded-[16px] transition-colors bg-[#fafafa] hover:bg-gray-100">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Saved Items</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button onClick={() => { setTempProfileData(profileData); setIsEditingProfile(true); setProfileView("settings"); }} className="w-full flex justify-between items-center p-5 rounded-[16px] transition-colors bg-[#fafafa] hover:bg-gray-100">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Settings</span>
                                            <ArrowRightLong />
                                        </button>
                                    </div>

                                    <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }} className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-colors bg-[#fff5f5] text-red-500 hover:bg-red-50">
                                        SIGN OUT
                                    </button>
                                </motion.div>
                            )}

                            {profileView === "history" && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => setProfileView("menu")} className="opacity-50 hover:opacity-100"><ArrowLeft /></button>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Orders</h2>
                                    </div>
                                    <div className="flex flex-col gap-4 mb-8">
                                        <div className="p-4 rounded-xl border border-gray-200">
                                            <p className="text-[10px] font-bold tracking-widest opacity-50 mb-1">MAY 2026</p>
                                            <h4 className="font-black uppercase text-sm mb-1">Air Jordan 1 Retro</h4>
                                            <p className="text-sm font-bold text-green-500">Delivered</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {profileView === "saved" && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => setProfileView("menu")} className="opacity-50 hover:opacity-100"><ArrowLeft /></button>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Saved</h2>
                                    </div>
                                    <div className="flex flex-col gap-4 mb-8">
                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
                                            <img src="/uptempo96.jpg" alt="shoe" className="w-16 h-16 object-contain mix-blend-multiply" />
                                            <div>
                                                <h4 className="font-black uppercase text-sm mb-1">Air More Uptempo</h4>
                                                <p className="text-xs font-bold opacity-50">$170.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {profileView === "settings" && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => { setProfileView("menu"); setIsEditingProfile(false); }} className="opacity-50 hover:opacity-100"><ArrowLeft /></button>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Settings</h2>
                                    </div>

                                    <div className="flex flex-col gap-4 mb-8">
                                        <div>
                                            <label className="text-[10px] opacity-50 font-bold uppercase tracking-widest ml-1 mb-1 block">Display Name</label>
                                            <input
                                                type="text"
                                                value={tempProfileData.name}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                                                className="w-full bg-gray-50 border-gray-200 text-black focus:border-black border rounded-xl px-4 py-4 text-sm font-medium transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] opacity-50 font-bold uppercase tracking-widest ml-1 mb-1 block">E-mail Address</label>
                                            <input
                                                type="email"
                                                value={tempProfileData.email}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                                                className="w-full bg-gray-50 border-gray-200 text-black focus:border-black border rounded-xl px-4 py-4 text-sm font-medium transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => { setProfileView("menu"); setIsEditingProfile(false); }} className="flex-1 bg-gray-100 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} className="flex-1 bg-[#111] text-white hover:bg-gray-800 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-colors">
                                            Save
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= ОВЕРЛЕЙ ПОИСКА ================= */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[200] flex flex-col px-6 md:px-12 py-8 overflow-hidden bg-white text-black">
                        <div className="flex justify-between items-center mb-16 max-w-[1400px] mx-auto w-full mt-4">
                            <span className="font-black italic tracking-widest uppercase text-xl">Search</span>
                            <button onClick={() => setIsSearchOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity"><CloseIcon /></button>
                        </div>
                        <div className="max-w-[1000px] mx-auto w-full flex flex-col items-center justify-center flex-1 pb-32">
                            <input
                                type="text"
                                autoFocus
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                placeholder="TYPE SNEAKER NAME..."
                                className="w-full text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-center placeholder-gray-400 focus:outline-none border-b-4 pb-4 md:pb-8 bg-transparent border-black"
                            />
                            <p className="opacity-50 text-xs md:text-sm tracking-widest uppercase mt-8 font-bold text-center">
                                Press Enter to Search • Trending: Jordan, Uptempo, Max
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}