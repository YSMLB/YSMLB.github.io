"use client";

import { useState, Suspense, useLayoutEffect, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

// --- 3D ИМПОРТЫ ---
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";

function AutoScaledModel({ path }: { path: string }) {
    const { scene } = useGLTF(path);
    const ref = useRef<THREE.Group>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            // Вычисляем реальные размеры скачанной модели
            const box = new THREE.Box3().setFromObject(ref.current);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Находим самую большую сторону и подгоняем под идеальный размер для экрана
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.5 / maxDim; // 3.5 - оптимальный размер для экрана
            ref.current.scale.setScalar(scale);

            // Идеально центруем модель, чтобы она не улетала за край
            const center = new THREE.Vector3();
            box.getCenter(center);
            ref.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        }
    }, [scene]);

    return <primitive ref={ref} object={scene} />;
}

// Заглушка загрузки
function Loader() {
    return (
        <Html center>
            <div className="text-black font-black uppercase tracking-widest text-[10px] animate-pulse bg-white/90 px-6 py-3 rounded-full shadow-2xl">
                LOADING 3D...
            </div>
        </Html>
    );
}

// --- ДАННЫЕ ДЛЯ ГЛАВНОГО СЛАЙДЕРА (HERO) ---
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

// --- ГЕНЕРАЦИЯ 30 КАРТОЧЕК ДЛЯ КАТАЛОГА (С ТВОИМИ ПУТЯМИ К КАРТИНКАМ) ---
const initialCatalogShoes = [
    { id: 1, name: "Nike Air Max 95", subtitle: "Essential / Black", price: "170.00", category: "MEN", isSale: false, bgText: "AIR MAX", img: "/NikeAirMax95.jpg", model: "/models/1.glb" },
    { id: 2, name: "Nike Cortez", subtitle: "Basic / White Black", price: "90.00", category: "WOMEN", isSale: true, bgText: "CORTEZ", img: "/NikeCortez.jpg", model: "/models/2.glb" },
    { id: 3, name: "Air Jordan 1 Retro High", subtitle: "Chicago", price: "180.00", category: "MEN", isSale: false, bgText: "JORDAN", img: "/AirJordan1RetroHigh.jpg", model: "/models/3.glb" },
    { id: 4, name: "Nike Dunk Low", subtitle: "Panda", price: "110.00", category: "WOMEN", isSale: false, bgText: "DUNK LOW", img: "/NikeDunkLow.jpg", model: "/models/4.glb" },
    { id: 5, name: "Air More Uptempo '96", subtitle: "Black / White", price: "160.00", category: "MEN", isSale: true, bgText: "UPTEMPO", img: "/AirMoreUptempo96.jpg", model: "/models/5.glb" },
    { id: 6, name: "Nike SB Dunk Low", subtitle: "Travis Scott", price: "150.00", category: "MEN", isSale: false, bgText: "SB DUNK", img: "/NikeSBDunkLow.jpg", model: "/models/6.glb" },
    { id: 7, name: "Nike Air Force 1 '07", subtitle: "Triple White", price: "115.00", category: "WOMEN", isSale: false, bgText: "FORCE 1", img: "/NikeAirForce107.jpg", model: "/models/7.glb" },
    { id: 8, name: "Air Jordan 4 Retro", subtitle: "Military Black", price: "210.00", category: "MEN", isSale: false, bgText: "JORDAN 4", img: "/AirJordan4Retro.jpg", model: "/models/8.glb" },
    { id: 9, name: "Nike Air Max Plus", subtitle: "Sunset", price: "175.00", category: "MEN", isSale: true, bgText: "AIR MAX", img: "/NikeAirMaxPlus.jpg", model: "/models/9.glb" },
    { id: 10, name: "Nike Blazer Mid '77", subtitle: "Vintage White", price: "105.00", category: "WOMEN", isSale: false, bgText: "BLAZER", img: "/NikeBlazerMid77.jpg", model: "/models/10.glb" },
    { id: 11, name: "Air Jordan 11 Retro", subtitle: "Concord", price: "220.00", category: "MEN", isSale: false, bgText: "JORDAN 11", img: "/AirJordan11Retro.jpg", model: "/models/11.glb" },
    { id: 12, name: "Nike Zoom Vomero 5", subtitle: "Cobblestone", price: "160.00", category: "WOMEN", isSale: true, bgText: "VOMERO", img: "/NikeZoomVomero5.jpg", model: "/models/12.glb" },
    { id: 13, name: "Nike Air Max 270", subtitle: "Triple Black", price: "160.00", category: "KIDS", isSale: false, bgText: "AIR MAX", img: "/NikeAirMax270.jpg", model: "/models/13.glb" },
    { id: 14, name: "Air Jordan 3 Retro", subtitle: "White Cement", price: "200.00", category: "KIDS", isSale: false, bgText: "JORDAN 3", img: "/AirJordan3Retro.jpg", model: "/models/14.glb" },
    { id: 15, name: "Nike Air VaporMax Plus", subtitle: "Wolf Grey", price: "210.00", category: "MEN", isSale: false, bgText: "VAPORMAX", img: "/NikeAirVaporMaxPlus.jpg", model: "/models/15.glb" },

    // Остальные 15 штук без 3D моделей (пока что)
    { id: 16, name: "Raf Simons Ozweego", subtitle: "Bunny / Core Black", price: "350.00", category: "MEN", isSale: false, bgText: "RAF SIMONS", img: "/RafSimonsOzweego.jpg", model: null },
    { id: 17, name: "Raf Simons Antei", subtitle: "White / Cream", price: "400.00", category: "WOMEN", isSale: true, bgText: "RAF SIMONS", img: "/RafSimonsAntei.jpg", model: null },
    { id: 18, name: "Raf Simons Cylon-21", subtitle: "Black / Red", price: "450.00", category: "MEN", isSale: false, bgText: "RAF SIMONS", img: "/RafSimonsCylon-21.jpg", model: null },
    { id: 19, name: "Raf Simons Detroit Runner", subtitle: "Canvas / Black", price: "300.00", category: "WOMEN", isSale: false, bgText: "RAF SIMONS", img: "/RafSimonsDetroitRunner.jpg", model: null },
    { id: 20, name: "Raf Simons x Stan Smith", subtitle: "Optic White", price: "280.00", category: "MEN", isSale: true, bgText: "RAF SIMONS", img: "/RafSimonsxStanSmith.jpg", model: null },
    { id: 21, name: "LV Skate Sneaker", subtitle: "Green / White", price: "1340.00", category: "MEN", isSale: false, bgText: "LOUIS VUITTON", img: "/LVSkateSneaker.jpg", model: null },
    { id: 22, name: "LV Trainer", subtitle: "Monogram / Black", price: "1220.00", category: "MEN", isSale: false, bgText: "LOUIS VUITTON", img: "/LVTrainer.jpg", model: null },
    { id: 23, name: "LV Archlight", subtitle: "Classic / White", price: "1150.00", category: "WOMEN", isSale: false, bgText: "LOUIS VUITTON", img: "/LVArchlight.jpg", model: null },
    { id: 24, name: "Adidas Yeezy Boost 350 V2", subtitle: "Zebra", price: "230.00", category: "MEN", isSale: false, bgText: "YEEZY", img: "/AdidasYeezyBoost350V2.jpg", model: null },
    { id: 25, name: "Adidas Samba OG", subtitle: "Cloud White", price: "100.00", category: "WOMEN", isSale: false, bgText: "SAMBA", img: "/AdidasSambaOG.jpg", model: null },
    { id: 26, name: "Adidas Campus 00s", subtitle: "Core Black", price: "110.00", category: "MEN", isSale: true, bgText: "CAMPUS", img: "/AdidasCampus00s.jpg", model: null },
    { id: 27, name: "Adidas Gazelle", subtitle: "Collegiate Navy", price: "100.00", category: "WOMEN", isSale: false, bgText: "GAZELLE", img: "/AdidasGazelle.jpg", model: null },
    { id: 28, name: "Adidas Ultraboost 1.0", subtitle: "Light Solid Grey", price: "190.00", category: "MEN", isSale: false, bgText: "ULTRABOOST", img: "/AdidasUltraboost1.0.jpg", model: null },
    { id: 29, name: "Adidas Superstar", subtitle: "Cloud White / Core Black", price: "100.00", category: "KIDS", isSale: true, bgText: "SUPERSTAR", img: "/AdidasSuperstar.jpg", model: null },
    { id: 30, name: "Adidas Yeezy 700 V3", subtitle: "Azael", price: "200.00", category: "MEN", isSale: false, bgText: "YEEZY", img: "/AdidasYeezy700V3.jpg", model: null }
];

// --- ИКОНКИ ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ArrowRightLong = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// =====================================================================
// НОВЫЙ КОМПОНЕНТ ДЛЯ 1В1 КИНЕМАТОГРАФИЧНОГО 3D ПРОСМОТРА КАК НА ВИДЕО
// =====================================================================
const ProductCinematicView = ({ shoe, onClose }: { shoe: any, onClose: () => void }) => {
    const [showUI, setShowUI] = useState(false);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    // Таймер: через 4.5 секунды кручения анимированно выезжает интерфейс.
    // Юзер может кликнуть в любую точку, чтобы пропустить анимацию
    useEffect(() => {
        const timer = setTimeout(() => setShowUI(true), 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-[#fafafa] overflow-hidden flex flex-col"
            onClick={() => setShowUI(true)} // Клик по фону пропускает ожидание
        >
            {/* ШАПКА КАК НА СКРИНШОТЕ */}
            <header className="absolute top-0 left-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50 pointer-events-auto">
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex items-center gap-2 font-black uppercase tracking-widest text-[11px] hover:text-gray-500 transition-colors text-[#111]">
                    <ArrowLeft /> BACK TO CATALOG
                </button>
                <Link href="/cart" target="_blank" className="hover:opacity-50 transition-opacity text-[#111]"><BagIcon /></Link>
            </header>

            {/* ГРОМАДНЫЙ ТЕКСТ НА ФОНЕ БЕЗ ОГРАНИЧЕНИЙ */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <h1 className="text-[30vw] font-black italic text-black/[0.03] tracking-tighter leading-none whitespace-nowrap select-none">
                    {shoe.bgText || shoe.name.split(" ")[0]}
                </h1>
            </div>

            {/* ЗОНА 3D КРОССОВКА */}
            {/* Сначала он по центру (100% ширины), потом отъезжает влево (освобождая место под UI справа) */}
            <motion.div
                className="absolute top-0 left-0 h-full flex items-center justify-center z-10 pointer-events-auto"
                initial={{ right: 0 }}
                animate={{ right: showUI ? "40%" : "0%" }} // Двигаем границу вправо на 40% при появлении UI
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Плавная кинематографичная кривая
            >
                {shoe.model ? (
                    <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 45 }}>
                        {/* Идеальный студийный свет, чтобы текстуры читались */}
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
                        <Environment preset="city" />

                        <Suspense fallback={<Loader />}>
                            <AutoScaledModel path={shoe.model} />
                            {/* Красивая контактная тень на полу */}
                            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                        </Suspense>

                        <OrbitControls
                            autoRotate={!showUI} // Крутится, пока UI скрыт
                            autoRotateSpeed={4}  // Скорость кручения
                            enableZoom={showUI}  // Зум доступен только после появления UI
                            enablePan={false}
                            maxPolarAngle={Math.PI / 2 + 0.1} // Запрещаем смотреть прямо снизу
                        />
                    </Canvas>
                ) : (
                    // Заглушка для тех кроссовок, у которых пока нет .glb файла
                    <div className="w-full h-full flex items-center justify-center">
                        <img src={shoe.img} alt={shoe.name} className="w-[80%] max-w-[800px] object-contain mix-blend-multiply drop-shadow-2xl pointer-events-none" />
                    </div>
                )}

                {/* Подсказка внизу экрана */}
                <AnimatePresence>
                    {showUI && shoe.model && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-12 flex items-center gap-2 text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase animate-pulse pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /><path d="M12 19l-7-7 7-7" /></svg>
                            Drag to rotate
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ПАНЕЛЬ UI СПРАВА (Выезжает сбоку) */}
            <AnimatePresence>
                {showUI && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        onClick={(e) => e.stopPropagation()} // Чтобы клики по панели не закрывали её
                        className="absolute right-0 top-0 h-full w-full lg:w-[45%] xl:w-[40%] z-30 flex flex-col justify-center px-8 lg:px-20 bg-gradient-to-l from-[#fafafa] via-[#fafafa]/90 to-transparent pointer-events-auto"
                    >
                        <p className="text-gray-400 font-bold text-[10px] tracking-[0.15em] uppercase mb-2">{shoe.subtitle}</p>
                        <h2 className="text-5xl lg:text-[70px] font-black italic uppercase leading-[0.9] tracking-tighter mb-4 text-[#111]">{shoe.name}</h2>
                        <p className="text-xl lg:text-2xl font-bold mb-12 text-[#111]">$ {shoe.price}</p>

                        <div className="mb-10 w-full max-w-[420px]">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#111]">Select Size (EU)</span>
                                <span className="text-[10px] font-bold text-gray-400 underline cursor-pointer hover:text-black">Size Guide</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-md border font-bold text-sm transition-all ${selectedSize === size ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#111] border-gray-200 hover:border-gray-400 shadow-sm'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full max-w-[420px] bg-[#111] text-white py-4 font-bold uppercase tracking-[0.15em] text-xs hover:bg-black transition-colors rounded-sm shadow-xl">
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

    // ПРОСМОТР ТОВАРА
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

            {/* ================= ШАПКА ================= */}
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

            {/* ================= МОДАЛКИ (АВТОРИЗАЦИЯ И ПРОФИЛЬ) ================= */}
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