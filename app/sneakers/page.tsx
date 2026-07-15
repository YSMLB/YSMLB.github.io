"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- ДАННЫЕ ДЛЯ ГЛАВНОГО СЛАЙДЕРА (Твои картинки) ---
const heroShoes = [
    {
        id: 1,
        title1: "BUILT",
        title2: "FOR",
        title3: "FLIGHT",
        subtitle: "INTRODUCING OUR LIGHTEST\nSHOE EVER",
        name: "Air Jordan 1",
        img: "/Jordan1.jpg",
    },
    {
        id: 2,
        title1: "LUXURY",
        title2: "MEETS",
        title3: "STREET",
        subtitle: "NEW LOUIS VUITTON SKATE\nGREEN / WHITE EDITION",
        name: "LV Skate Sneaker",
        img: "/skateGW.jpg",
    },
    {
        id: 3,
        title1: "MAXIMUM",
        title2: "AIR",
        title3: "IMPACT",
        subtitle: "NIKE AIR MORE UPTEMPO '96\nBOLD AND UNAPOLOGETIC",
        name: "Air More Uptempo",
        img: "/uptempo96.jpg",
    }
];

// --- ГЕНЕРАЦИЯ 30 КАРТОЧЕК ДЛЯ КАТАЛОГА ---
const initialCatalogShoes = Array.from({ length: 30 }, (_, i) => {
    const type = i % 3;
    const category = i % 4 === 0 ? "WOMEN" : i % 5 === 0 ? "KIDS" : "MEN";
    const isSale = i % 6 === 0;

    return {
        id: i + 1,
        name: type === 0 ? "AIR JORDAN 1" : type === 1 ? "JORDAN MIDS" : "NIKE AIR MAX 95",
        subtitle: type === 0 ? "Classic / Black" : type === 1 ? "Bred Toe / Red" : "Essential / Colorway",
        price: (Math.random() * 200 + 100).toFixed(2),
        category: category,
        isSale: isSale,
        // В каталоге оставил ссылки на прозрачные PNG из сети для красоты верстки
        img: type === 0
            ? "https://images.unsplash.com/photo-1597045566677-8cf039d7f6a4?q=80&w=500&auto=format&fit=crop"
            : type === 1
                ? "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=500&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500&auto=format&fit=crop"
    };
});

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;

export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // ТЕМА (Светлая / Темная)
    const [isDarkMode, setIsDarkMode] = useState(false);

    // АВТОРИЗАЦИЯ И ПРОФИЛЬ
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // СИСТЕМА ПРОФИЛЯ
    const [profileView, setProfileView] = useState("menu"); // menu, history, saved, settings
    const [profileData, setProfileData] = useState({ name: "MY PROFILE", email: "user@sneakerstore.com" });
    const [tempProfileData, setTempProfileData] = useState(profileData);

    // ПОИСК И ФИЛЬТРЫ
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");
    const [visibleCount, setVisibleCount] = useState(8);

    const nextShoe = () => setCurrentIndex((prev) => (prev + 1) % heroShoes.length);
    const prevShoe = () => setCurrentIndex((prev) => (prev - 1 + heroShoes.length) % heroShoes.length);

    const activeShoe = heroShoes[currentIndex];

    // Фильтрация каталога
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
        setProfileView("menu");
    };

    // Динамические классы для темы
    const bgClass = isDarkMode ? "bg-[#0b0b0b] text-white" : "bg-white text-black";
    const headerClass = isDarkMode ? "bg-[#0b0b0b]/95 border-white/10" : "bg-white/95 border-gray-100";
    const cardClass = isDarkMode ? "bg-[#141414] border-white/10 hover:border-white/30" : "bg-white border-gray-200 hover:border-gray-300";
    const modalClass = isDarkMode ? "bg-[#141414] border border-white/10 text-white" : "bg-white border border-gray-100 text-black";
    const inputClass = isDarkMode ? "bg-black border-white/20 text-white focus:border-white" : "bg-gray-50 border-gray-200 text-black focus:border-black";
    const btnInvertClass = isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-[#111] text-white hover:bg-gray-800";
    const btnSecondaryClass = isDarkMode ? "bg-[#1a1a1a] hover:bg-[#222]" : "bg-[#fafafa] hover:bg-gray-100";

    return (
        <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 pb-20 ${bgClass}`}>

            {/* ================= ШАПКА ================= */}
            <header className={`w-full backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center fixed top-0 z-40 border-b transition-colors duration-300 ${headerClass}`}>

                <div className="flex items-center gap-6 md:gap-12">
                    {/* КНОПКА ВОЗВРАТА НА ПОРТФОЛИО */}
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2">
                        ← <span className="hidden md:inline">Back to Portfolio</span>
                    </Link>

                    <nav className="hidden md:flex gap-8 text-[13px] font-black tracking-[0.15em] uppercase">
                        <button onClick={() => handleTabClick("WOMEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "WOMEN" ? (isDarkMode ? "border-b-2 border-white" : "border-b-2 border-black") : ""}`}>Women</button>
                        <button onClick={() => handleTabClick("MEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "MEN" ? (isDarkMode ? "border-b-2 border-white" : "border-b-2 border-black") : ""}`}>Men</button>
                        <button onClick={() => handleTabClick("KIDS")} className={`hover:opacity-60 transition-opacity ${activeTab === "KIDS" ? (isDarkMode ? "border-b-2 border-white" : "border-b-2 border-black") : ""}`}>Kids</button>
                        <button onClick={() => handleTabClick("SALE")} className={`hover:opacity-60 transition-opacity ${activeTab === "SALE" ? "border-b-2 border-red-500" : ""} ${activeTab === "SALE" ? "text-red-500" : ""}`}>Sale</button>
                    </nav>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center cursor-pointer" onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }}>
                    <div className={`${btnInvertClass} px-6 py-2 skew-x-[-12deg] transition-colors`}>
                        <h1 className="skew-x-[12deg] font-black text-xl italic tracking-[0.1em] uppercase">SNEAKER STORE</h1>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    {/* Кнопка смены темы */}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:opacity-50 transition-opacity">
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    </button>

                    <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity"><SearchIcon /></button>
                    <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity"><BagIcon /></Link>
                    <button onClick={handleUserIconClick} className="hover:opacity-50 transition-opacity">
                        {isLoggedIn ? <div className={`w-7 h-7 ${btnInvertClass} rounded-full flex items-center justify-center text-[10px] font-bold`}>ME</div> : <UserIcon />}
                    </button>
                </div>
            </header>

            {/* ================= ГЛАВНЫЙ ЭКРАН (HERO) ================= */}
            <main className="pt-32 px-6 md:px-12 max-w-[1800px] mx-auto">

                <section className="flex flex-col lg:flex-row items-center w-full min-h-[60vh] lg:min-h-[70vh] mb-20 relative">

                    <div className="w-full lg:w-5/12 flex flex-col items-start z-20">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeShoe.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                <h2 className="text-7xl lg:text-[110px] font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
                                    <span className="block">{activeShoe.title1}</span><span className="block">{activeShoe.title2}</span><span className="block">{activeShoe.title3}</span>
                                </h2>
                                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-800"} font-medium text-sm md:text-base uppercase whitespace-pre-line mb-10 leading-relaxed max-w-sm transition-colors`}>
                                    {activeShoe.subtitle}
                                </p>
                                <button onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })} className={`${btnInvertClass} px-12 py-5 font-bold uppercase tracking-widest text-sm shadow-xl transition-colors`}>
                                    Shop Now
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="w-full lg:w-7/12 h-[450px] lg:h-[600px] relative flex items-center justify-center mt-12 lg:mt-0">
                        <button onClick={prevShoe} className={`absolute left-0 lg:-left-4 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg ${isDarkMode ? "bg-[#222] text-white border border-white/10" : "bg-white text-black border border-gray-100"}`}>
                            <ArrowLeft />
                        </button>

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
                                    // Убрал mix-blend-multiply, чтобы твои черные фоны отображались как есть.
                                    // Если включить Dark Mode, черный фон сольется с сайтом.
                                    className="w-full max-w-[750px] object-contain drop-shadow-2xl pointer-events-none"
                                />
                            </AnimatePresence>
                        </div>

                        <button onClick={nextShoe} className={`absolute right-0 lg:right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg ${isDarkMode ? "bg-[#222] text-white border border-white/10" : "bg-white text-black border border-gray-100"}`}>
                            <ArrowRight />
                        </button>
                    </div>
                </section>

                {/* ================= РАБОЧИЙ КАТАЛОГ ================= */}
                <section id="catalog-section" className="mb-24 scroll-mt-32">

                    <div className={`flex justify-between items-end mb-10 border-b pb-6 ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                            {activeSearch ? `Search: "${activeSearch}"` : activeTab !== "ALL" ? `${activeTab} COLLECTION` : "Explore Collection"}
                        </h3>
                        <span className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} font-bold text-sm tracking-widest uppercase hidden md:block`}>
                            {displayedCatalog.length} Items found
                        </span>
                    </div>

                    {displayedCatalog.length === 0 ? (
                        <div className="py-20 text-center">
                            <h2 className={`text-3xl font-black uppercase mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>No sneakers found</h2>
                            <button onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }} className={`border-b-2 font-bold uppercase tracking-widest text-sm pb-1 ${isDarkMode ? "border-white hover:text-gray-400" : "border-black hover:text-gray-500"}`}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {currentVisibleCatalog.map((shoe) => (
                                    <div key={shoe.id} className={`border rounded-[30px] p-6 md:p-8 flex flex-col justify-between group cursor-pointer transition-all relative overflow-hidden ${cardClass}`}>

                                        {shoe.isSale && (
                                            <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full z-20">SALE</div>
                                        )}

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="mt-6 md:mt-0">
                                                <h4 className="font-black uppercase tracking-widest text-sm md:text-base mb-1">{shoe.name}</h4>
                                                <p className={`text-xs font-bold tracking-wider group-hover:hidden block ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{shoe.subtitle}</p>
                                                <p className={`text-xs font-black tracking-wider hidden group-hover:block transition-all ${isDarkMode ? "text-white" : "text-black"}`}>$ {shoe.price}</p>
                                            </div>
                                            <div className={`${isDarkMode ? "text-gray-600 group-hover:text-white" : "text-gray-300 group-hover:text-black"} group-hover:translate-x-1 transition-all`}><ArrowRightLong /></div>
                                        </div>

                                        <div className="h-48 md:h-56 mt-8 flex items-end justify-center relative z-10">
                                            {/* Оставил mix-blend-multiply для светлой темы, чтобы PNG с Unsplash смотрелись хорошо */}
                                            <img src={shoe.img} alt={shoe.name} className={`w-full h-full object-contain group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 origin-bottom ${!isDarkMode && "mix-blend-multiply"}`} />
                                        </div>

                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`} />
                                    </div>
                                ))}
                            </div>

                            {visibleCount < displayedCatalog.length && (
                                <div className="flex justify-center mt-16">
                                    <button onClick={() => setVisibleCount(prev => prev + 8)} className={`border-2 px-12 py-4 font-bold uppercase tracking-widest text-sm transition-colors ${isDarkMode ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"}`}>
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>

            {/* ================= МОДАЛКА АВТОРИЗАЦИИ ================= */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`w-full max-w-md rounded-[30px] p-10 relative shadow-2xl ${modalClass}`}>
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><CloseIcon /></button>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome</h2>
                            <p className="text-xs opacity-50 tracking-widest uppercase mb-8">Sign in to your account</p>

                            <div className="flex flex-col gap-4">
                                <input type="email" placeholder="E-mail" className={`w-full border rounded-xl px-4 py-4 text-sm font-medium transition-colors ${inputClass}`} />
                                <input type="password" placeholder="Password" className={`w-full border rounded-xl px-4 py-4 text-sm font-medium transition-colors ${inputClass}`} />
                                <button onClick={handleLogin} className={`w-full px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-4 shadow-lg transition-colors ${btnInvertClass}`}>
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= МОДАЛКА ПРОФИЛЯ ================= */}
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`w-full max-w-[420px] rounded-[30px] p-10 relative shadow-2xl ${modalClass}`}>
                            <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><CloseIcon /></button>

                            {profileView === "menu" && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <div className={`flex items-center gap-5 mb-8 pb-8 border-b ${isDarkMode ? "border-white/10" : "border-gray-100"}`}>
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg ${btnInvertClass}`}>ME</div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black uppercase tracking-tight">{profileData.name}</h2>
                                            <p className="text-[10px] opacity-50 tracking-widest uppercase mb-1">MEMBER SINCE 2026</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-10">
                                        <button onClick={() => setProfileView("history")} className={`w-full flex justify-between items-center p-5 rounded-[16px] transition-colors ${btnSecondaryClass}`}>
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Order History</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button onClick={() => setProfileView("saved")} className={`w-full flex justify-between items-center p-5 rounded-[16px] transition-colors ${btnSecondaryClass}`}>
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Saved Items</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button onClick={() => { setTempProfileData(profileData); setProfileView("settings"); }} className={`w-full flex justify-between items-center p-5 rounded-[16px] transition-colors ${btnSecondaryClass}`}>
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Settings</span>
                                            <ArrowRightLong />
                                        </button>
                                    </div>

                                    <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-colors ${isDarkMode ? "bg-red-950/30 text-red-500 hover:bg-red-900/50" : "bg-[#fff5f5] text-red-500 hover:bg-red-50"}`}>
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
                                        <div className={`p-4 rounded-xl border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                            <p className="text-[10px] font-bold tracking-widest opacity-50 mb-1">MAY 2026</p>
                                            <h4 className="font-black uppercase text-sm mb-1">Air Jordan 1 Retro</h4>
                                            <p className="text-sm font-bold text-green-500">Delivered</p>
                                        </div>
                                        <div className={`p-4 rounded-xl border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                            <p className="text-[10px] font-bold tracking-widest opacity-50 mb-1">APRIL 2026</p>
                                            <h4 className="font-black uppercase text-sm mb-1">LV Skate Sneaker</h4>
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
                                        <div className={`flex items-center gap-4 p-4 rounded-xl border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                            <img src="https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=150&auto=format&fit=crop" alt="shoe" className={`w-16 h-16 object-contain ${!isDarkMode && "mix-blend-multiply"}`} />
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
                                        <button onClick={() => setProfileView("menu")} className="opacity-50 hover:opacity-100"><ArrowLeft /></button>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Settings</h2>
                                    </div>

                                    <div className="flex flex-col gap-4 mb-8">
                                        <div>
                                            <label className="text-[10px] opacity-50 font-bold uppercase tracking-widest ml-1 mb-1 block">Display Name</label>
                                            <input
                                                type="text"
                                                value={tempProfileData.name}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                                                className={`w-full border rounded-xl px-4 py-4 text-sm font-medium transition-colors ${inputClass}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] opacity-50 font-bold uppercase tracking-widest ml-1 mb-1 block">E-mail Address</label>
                                            <input
                                                type="email"
                                                value={tempProfileData.email}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                                                className={`w-full border rounded-xl px-4 py-4 text-sm font-medium transition-colors ${inputClass}`}
                                            />
                                        </div>
                                    </div>

                                    <button onClick={handleSaveProfile} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-colors ${btnInvertClass}`}>
                                        Save Changes
                                    </button>
                                </motion.div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= ОВЕРЛЕЙ ПОИСКА ================= */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={`fixed inset-0 z-[100] flex flex-col px-6 md:px-12 py-8 overflow-hidden ${bgClass}`}>
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
                                className={`w-full text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-center placeholder-gray-400 focus:outline-none border-b-4 pb-4 md:pb-8 bg-transparent ${isDarkMode ? "border-white" : "border-black"}`}
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