"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// --- ГЕНЕРАЦИЯ 30 КАРТОЧЕК ДЛЯ КАТАЛОГА (С КАТЕГОРИЯМИ) ---
const initialCatalogShoes = Array.from({ length: 30 }, (_, i) => {
    const type = i % 3;
    // Распределяем случайные категории для работы фильтров
    const category = i % 4 === 0 ? "WOMEN" : i % 5 === 0 ? "KIDS" : "MEN";
    const isSale = i % 6 === 0;

    return {
        id: i + 1,
        name: type === 0 ? "AIR JORDAN 1" : type === 1 ? "JORDAN MIDS" : "NIKE AIR MAX 95",
        subtitle: type === 0 ? "Classic / Black" : type === 1 ? "Bred Toe / Red" : "Essential / Colorway",
        price: (Math.random() * 200 + 100).toFixed(2),
        category: category,
        isSale: isSale,
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

export default function SneakerStore() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // АВТОРИЗАЦИЯ И ПРОФИЛЬ
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // РЕДАКТИРОВАНИЕ ПРОФИЛЯ
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: "MY PROFILE", email: "user@sneakerstore.com" });
    const [tempProfileData, setTempProfileData] = useState(profileData);

    // ПОИСК И ФИЛЬТРЫ
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL"); // ALL, WOMEN, MEN, KIDS, SALE
    const [visibleCount, setVisibleCount] = useState(8);

    const nextShoe = () => setCurrentIndex((prev) => (prev + 1) % heroShoes.length);
    const prevShoe = () => setCurrentIndex((prev) => (prev - 1 + heroShoes.length) % heroShoes.length);

    const activeShoe = heroShoes[currentIndex];

    // Фильтрация каталога (Поиск + Вкладки)
    const displayedCatalog = initialCatalogShoes
        .filter(shoe => activeTab === "ALL" || shoe.category === activeTab || (activeTab === "SALE" && shoe.isSale))
        .filter(shoe => !activeSearch || shoe.name.toLowerCase().includes(activeSearch.toLowerCase()));

    const currentVisibleCatalog = displayedCatalog.slice(0, visibleCount);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setActiveSearch(searchInput);
            setIsSearchOpen(false);
            setVisibleCount(8); // Сбрасываем пагинацию при новом поиске
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setVisibleCount(8); // Сбрасываем пагинацию при смене вкладки
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setIsAuthOpen(false);
    };

    const handleUserIconClick = () => {
        if (isLoggedIn) setIsProfileOpen(true);
        else setIsAuthOpen(true);
    };

    const handleSaveProfile = () => {
        setProfileData(tempProfileData);
        setIsEditingProfile(false);
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden selection:bg-black selection:text-white pb-20">

            {/* ================= ШАПКА ================= */}
            <header className="w-full bg-white/95 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center fixed top-0 z-40 border-b border-gray-100">

                {/* Функциональные вкладки как на скрине */}
                <nav className="hidden md:flex gap-8 text-[13px] font-black tracking-[0.15em] uppercase">
                    <button onClick={() => handleTabClick("WOMEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "WOMEN" ? "border-b-2 border-black" : ""}`}>Women</button>
                    <button onClick={() => handleTabClick("MEN")} className={`hover:opacity-60 transition-opacity ${activeTab === "MEN" ? "border-b-2 border-black" : ""}`}>Men</button>
                    <button onClick={() => handleTabClick("KIDS")} className={`hover:opacity-60 transition-opacity ${activeTab === "KIDS" ? "border-b-2 border-black" : ""}`}>Kids</button>
                    <button onClick={() => handleTabClick("SALE")} className={`hover:opacity-60 transition-opacity ${activeTab === "SALE" ? "border-b-2 border-red-500" : ""} ${activeTab === "SALE" ? "text-red-500" : "text-black"}`}>Sale</button>
                </nav>

                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center cursor-pointer" onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }}>
                    <div className="bg-[#111] text-white px-6 py-2 skew-x-[-12deg] hover:bg-gray-800 transition-colors">
                        <h1 className="skew-x-[12deg] font-black text-xl italic tracking-[0.1em] uppercase">SNEAKER STORE</h1>
                    </div>
                </div>

                <div className="flex gap-8 items-center text-black">
                    <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-50 transition-opacity"><SearchIcon /></button>
                    <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity"><BagIcon /></Link>
                    <button onClick={handleUserIconClick} className="hover:opacity-50 transition-opacity">
                        {isLoggedIn ? <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">ME</div> : <UserIcon />}
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
                                <p className="text-gray-800 font-medium text-sm md:text-base uppercase whitespace-pre-line mb-10 leading-relaxed max-w-sm">
                                    {activeShoe.subtitle}
                                </p>
                                <button onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#111] text-white px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow-xl shadow-black/10">
                                    Shop Now
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Статичный слайдер по твоему ТЗ */}
                    <div className="w-full lg:w-7/12 h-[450px] lg:h-[600px] relative flex items-center justify-center mt-12 lg:mt-0">

                        <button onClick={prevShoe} className="absolute left-0 lg:-left-4 z-30 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.08)] text-black">
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
                                    className="w-full max-w-[750px] object-contain drop-shadow-2xl mix-blend-multiply pointer-events-none"
                                />
                            </AnimatePresence>
                        </div>

                        <button onClick={nextShoe} className="absolute right-0 lg:right-4 z-30 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.08)] text-black">
                            <ArrowRight />
                        </button>

                    </div>
                </section>

                {/* ================= РАБОЧИЙ КАТАЛОГ ================= */}
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
                            <button onClick={() => { setActiveSearch(""); setSearchInput(""); setActiveTab("ALL"); }} className="border-b-2 border-black font-bold uppercase tracking-widest text-sm pb-1 hover:text-gray-500">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {currentVisibleCatalog.map((shoe) => (
                                    <div key={shoe.id} className="border border-gray-200 rounded-[30px] p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:shadow-2xl hover:border-gray-300 transition-all bg-white relative overflow-hidden">

                                        {shoe.isSale && (
                                            <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full z-20">SALE</div>
                                        )}

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="mt-6 md:mt-0">
                                                <h4 className="font-black uppercase tracking-widest text-sm md:text-base mb-1 text-black">{shoe.name}</h4>
                                                <p className="text-xs text-gray-500 font-bold tracking-wider group-hover:hidden block">{shoe.subtitle}</p>
                                                <p className="text-xs text-black font-black tracking-wider hidden group-hover:block transition-all">$ {shoe.price}</p>
                                            </div>
                                            <div className="text-gray-300 group-hover:text-black transition-colors"><ArrowRightLong /></div>
                                        </div>

                                        <div className="h-48 md:h-56 mt-8 flex items-end justify-center relative z-10">
                                            <img src={shoe.img} alt={shoe.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 origin-bottom" />
                                        </div>

                                        <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                                    </div>
                                ))}
                            </div>

                            {/* Рабочая кнопка Load More */}
                            {visibleCount < displayedCatalog.length && (
                                <div className="flex justify-center mt-16">
                                    <button onClick={() => setVisibleCount(prev => prev + 8)} className="border-2 border-black text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
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
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[30px] p-10 relative shadow-2xl border border-gray-100">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><CloseIcon /></button>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Welcome</h2>
                            <p className="text-xs text-gray-500 tracking-widest uppercase mb-8">Sign in to your account</p>

                            <div className="flex flex-col gap-4">
                                <input type="email" placeholder="E-mail" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-gray-400" />
                                <input type="password" placeholder="Password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-gray-400" />
                                <button onClick={handleLogin} className="w-full bg-[#111] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm mt-4 hover:bg-gray-800 transition-colors shadow-lg">
                                    Login
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= МОДАЛКА ПРОФИЛЯ (С РЕДАКТИРОВАНИЕМ) ================= */}
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-[420px] rounded-[30px] p-10 relative shadow-2xl border border-gray-100">
                            <button onClick={() => { setIsProfileOpen(false); setIsEditingProfile(false); }} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"><CloseIcon /></button>

                            {!isEditingProfile ? (
                                // --- РЕЖИМ ПРОСМОТРА ---
                                <>
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg">ME</div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black uppercase tracking-tight">{profileData.name}</h2>
                                            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">MEMBER SINCE 2026</p>
                                            <button onClick={() => { setTempProfileData(profileData); setIsEditingProfile(true); }} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:underline">
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-100 mb-8" />

                                    <div className="flex flex-col gap-3 mb-10">
                                        <button className="w-full flex justify-between items-center bg-[#fafafa] p-5 rounded-[16px] hover:bg-gray-100 transition-colors">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Order History</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button className="w-full flex justify-between items-center bg-[#fafafa] p-5 rounded-[16px] hover:bg-gray-100 transition-colors">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Saved Items</span>
                                            <ArrowRightLong />
                                        </button>
                                        <button className="w-full flex justify-between items-center bg-[#fafafa] p-5 rounded-[16px] hover:bg-gray-100 transition-colors">
                                            <span className="font-bold text-[11px] uppercase tracking-widest">Settings</span>
                                            <ArrowRightLong />
                                        </button>
                                    </div>

                                    <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }} className="w-full bg-[#fff5f5] text-red-500 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-red-50 transition-colors">
                                        SIGN OUT
                                    </button>
                                </>
                            ) : (
                                // --- РЕЖИМ РЕДАКТИРОВАНИЯ ---
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Edit Profile</h2>

                                    <div className="flex flex-col gap-4 mb-8">
                                        <div>
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1 mb-1 block">Display Name</label>
                                            <input
                                                type="text"
                                                value={tempProfileData.name}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1 mb-1 block">E-mail Address</label>
                                            <input
                                                type="email"
                                                value={tempProfileData.email}
                                                onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-gray-100 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-colors">
                                            Save
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= ОВЕРЛЕЙ ПОИСКА (РАБОЧИЙ) ================= */}
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
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                placeholder="TYPE SNEAKER NAME..."
                                className="w-full text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-center text-black placeholder-gray-200 focus:outline-none border-b-4 border-black pb-4 md:pb-8"
                            />
                            <p className="text-gray-400 text-xs md:text-sm tracking-widest uppercase mt-8 font-bold text-center">
                                Press Enter to Search • Trending: Jordan, Uptempo, Max
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}