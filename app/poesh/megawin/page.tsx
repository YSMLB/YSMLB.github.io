"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- MOCK ДАННЫЕ (Имитация ответа от бэкенда) ---
const games = [
    { id: 1, title: "Lucky Jackpot", provider: "NetEnt", rating: 4.8, tags: ["HOT"], img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=500&q=80", category: "Слоты" },
    { id: 2, title: "Royal Roulette", provider: "Evolution Gaming", rating: 4.9, tags: ["NEW"], img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=500&q=80", category: "Настольные" },
    { id: 3, title: "Poker Master", provider: "Pragmatic Play", rating: 4.7, tags: [], img: "https://images.unsplash.com/photo-1517856497829-3047e3fffae1?auto=format&fit=crop&w=500&q=80", category: "Настольные" },
    { id: 4, title: "Dice Paradise", provider: "Play'n GO", rating: 4.6, tags: ["HOT"], img: "https://images.unsplash.com/photo-1518882176949-0d1991d7dfdc?auto=format&fit=crop&w=500&q=80", category: "Настольные" },
    { id: 5, title: "Neon Chips", provider: "Microgaming", rating: 4.5, tags: [], img: "https://images.unsplash.com/photo-1582229555137-0249764516ae?auto=format&fit=crop&w=500&q=80", category: "Новинки" },
    { id: 6, title: "Blackjack Pro", provider: "Red Tiger", rating: 4.8, tags: ["NEW"], img: "https://images.unsplash.com/photo-1605706859570-584347712e0f?auto=format&fit=crop&w=500&q=80", category: "Живые" },
    { id: 7, title: "Fortune Slots", provider: "NetEnt", rating: 4.7, tags: [], img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=500&q=80", category: "Слоты" },
    { id: 8, title: "Golden Wheel", provider: "Evolution Gaming", rating: 4.9, tags: ["HOT"], img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=500&q=80", category: "Живые" }
];

const categories = ["Все игры", "Слоты", "Живые", "Настольные", "Новинки"];

const bonuses = [
    { id: 1, title: "Приветственный бонус", desc: "+200% к первому депозиту до 100,000₽", color: "from-[#2a1a08] to-[#1a1005]", iconColor: "text-orange-500", bgIcon: "bg-orange-500/10" },
    { id: 2, title: "Ежедневный кэшбэк", desc: "Возвращаем до 15% каждый день", color: "from-[#081a2a] to-[#05101a]", iconColor: "text-blue-500", bgIcon: "bg-blue-500/10" },
    { id: 3, title: "Еженедельный турнир", desc: "Призовой фонд 1,000,000₽", color: "from-[#1a082a] to-[#10051a]", iconColor: "text-purple-500", bgIcon: "bg-purple-500/10" },
    { id: 4, title: "Фриспины", desc: "150 бесплатных вращений для новых игроков", color: "from-[#082a1a] to-[#051a10]", iconColor: "text-emerald-500", bgIcon: "bg-emerald-500/10" },
];

// --- ИКОНКИ ---
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>;

export default function MegaWin() {
    const [activeFilter, setActiveFilter] = useState("Все игры");

    const filteredGames = activeFilter === "Все игры"
        ? games
        : games.filter(game => game.category === activeFilter);

    return (
        <div className="bg-[#0b0e14] min-h-screen text-white font-sans selection:bg-[#ff9900] selection:text-white">

            {/* НАВИГАЦИЯ */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">

                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 text-[#ff9900] hover:scale-105 transition-transform">
                            <div className="bg-[#ff9900] text-[#0b0e14] p-1.5 rounded-lg">
                                <CrownIcon />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold leading-none tracking-tight text-white">MegaWin</h1>
                                <span className="text-[10px] text-[#ff9900] font-medium tracking-wider uppercase">Casino Online</span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
                            {["Казино", "Слоты", "Живое Казино", "Турниры", "Промо"].map(link => (
                                <button key={link} className="hover:text-white transition-colors">{link}</button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <WalletIcon />
                            <span className="font-bold text-sm text-[#ff9900]">1 245.50 ₽</span>
                        </div>
                        <button className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                            <UserIcon />
                            Войти
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-28 pb-20 max-w-[1400px] mx-auto px-6">

                {/* ГЕРОЙ БЛОК */}
                <section className="flex flex-col lg:flex-row items-center gap-12 mb-24 mt-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-[#ff9900]/10 text-[#ff9900] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 border border-[#ff9900]/20">
                            <span className="animate-pulse">✦</span> Новый игрок? Получи бонус!
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                            Выигрывай по-<br />крупному <br />в <span className="text-[#ff9900]">MegaWin!</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                            Более 5000+ игр, мгновенные выплаты и щедрые бонусы. Начни играть уже сегодня!
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-12">
                            <button className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                Получить Бонус
                            </button>
                            <button className="bg-white hover:bg-gray-200 text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-colors">
                                Играть Демо
                            </button>
                        </div>

                        <div className="flex items-center gap-12">
                            <div>
                                <h4 className="text-2xl font-bold text-[#ff9900]">5000+</h4>
                                <p className="text-sm text-gray-500 font-medium">Игр</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#ff9900]">24/7</h4>
                                <p className="text-sm text-gray-500 font-medium">Поддержка</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#ff9900]">1 мин</h4>
                                <p className="text-sm text-gray-500 font-medium">Выплаты</p>
                            </div>
                        </div>
                    </div>

                    {/* Карточка бонуса */}
                    <div className="w-full lg:w-[500px] bg-[#12151f] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="border border-[#ff9900]/50 rounded-2xl p-8 text-center mb-6 bg-[#0b0e14]/50 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 font-medium mb-2">Приветственный Бонус</p>
                                <h3 className="text-5xl font-black text-[#ff9900] mb-2">+200%</h3>
                                <p className="text-gray-300 font-medium">до 100,000₽</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#0b0e14] rounded-xl p-4 text-center border border-white/5">
                                    <h4 className="text-xl font-bold text-white mb-1">150</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Фриспинов</p>
                                </div>
                                <div className="bg-[#0b0e14] rounded-xl p-4 text-center border border-white/5">
                                    <h4 className="text-xl font-bold text-white mb-1">0%</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Комиссия</p>
                                </div>
                            </div>
                            <button className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] py-4 rounded-xl font-bold transition-colors">
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>
                </section>

                {/* ПОПУЛЯРНЫЕ ИГРЫ */}
                <section className="mb-24">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Популярные <span className="text-[#ff9900]">Игры</span></h2>
                        <p className="text-gray-400 text-sm">Выбери свою удачу из тысяч игр</p>
                    </div>

                    {/* Фильтры */}
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeFilter === cat
                                        ? "bg-[#ff9900] text-[#0b0e14] shadow-[0_0_15px_rgba(255,153,0,0.3)]"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Сетка Игр */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredGames.map(game => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={game.id}
                                    className="group bg-[#12151f] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={game.img} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                        {/* Теги */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {game.tags.map(tag => (
                                                <span key={tag} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white ${tag === 'HOT' ? 'bg-red-500' : 'bg-green-500'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Рейтинг */}
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold">
                                            <span className="text-[#ff9900]"><StarIcon /></span> {game.rating}
                                        </div>

                                        {/* Оверлей при наведении */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                                <PlayIcon /> Играть
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg leading-tight mb-1">{game.title}</h3>
                                        <p className="text-xs text-gray-500">{game.provider}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* ЩЕДРЫЕ БОНУСЫ */}
                <section className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-2">Щедрые <span className="text-[#ff9900]">Бонусы</span></h2>
                        <p className="text-gray-400 text-sm">Больше бонусов, больше выигрышей!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bonuses.map(bonus => (
                            <div key={bonus.id} className={`bg-gradient-to-br ${bonus.color} p-6 rounded-3xl border border-white/5 relative overflow-hidden group`}>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${bonus.bgIcon} ${bonus.iconColor}`}>
                                        {/* Generic Box Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>
                                    <p className="text-sm text-gray-400 mb-8 flex-1">{bonus.desc}</p>
                                    <button className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 rounded-xl font-bold text-sm transition-colors">
                                        Подробнее
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* VIP ПРОГРАММА */}
                <section className="bg-gradient-to-r from-purple-900/40 to-[#ff9900]/20 rounded-[40px] p-10 md:p-16 border border-white/10 mb-24 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff9900]/10 to-transparent pointer-events-none blur-3xl" />

                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-[#ff9900]/20 text-[#ff9900] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#ff9900]/30">
                                Специальное предложение
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6">VIP-программа лояльности</h2>
                            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
                                Эксклюзивные бонусы, персональный менеджер и приоритетный вывод средств для наших VIP-игроков.
                            </p>
                            <button className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-colors">
                                Узнать больше
                            </button>
                        </div>

                        <div className="flex-1 w-full bg-[#0b0e14]/60 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                            <div className="flex flex-col gap-4">
                                {[
                                    { level: "Уровень 1 - Бронза", val: "+5% кэшбэк" },
                                    { level: "Уровень 2 - Серебро", val: "+10% кэшбэк" },
                                    { level: "Уровень 3 - Золото", val: "+15% кэшбэк" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                        <span className="text-gray-400 font-medium">{item.level}</span>
                                        <span className="text-[#ff9900] font-bold">{item.val}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-4 bg-white/5 px-6 rounded-xl border border-white/10 mt-2">
                                    <span className="text-white font-bold">Уровень 4 - Платина</span>
                                    <span className="text-[#ff9900] font-black">+20% кэшбэк</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#080a0e] pt-16 pb-8">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                        <div>
                            <Link href="/" className="flex items-center gap-3 text-[#ff9900] mb-6">
                                <div className="bg-[#ff9900] text-[#0b0e14] p-1.5 rounded-lg">
                                    <CrownIcon />
                                </div>
                                <h1 className="text-2xl font-bold leading-none tracking-tight text-white">MegaWin</h1>
                            </Link>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Лучшее онлайн-казино с мгновенными выплатами и честной игрой.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ff9900] transition-colors">
                                        {/* Placeholder for social icons */}
                                        <div className="w-4 h-4 bg-current rounded-sm"></div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Быстрые ссылки</h4>
                            <ul className="flex flex-col gap-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">О нас</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Правила</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Ответственная игра</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Партнерская программа</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Игры</h4>
                            <ul className="flex flex-col gap-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Слоты</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Живое казино</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Настольные игры</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Турниры</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Контакты</h4>
                            <ul className="flex flex-col gap-4 text-sm text-gray-400 mb-6">
                                <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    support@megawin.com
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    8 800 555-35-35
                                </li>
                            </ul>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[#ff9900] font-bold text-sm">Поддержка 24/7</p>
                                    <p className="text-xs text-gray-500">Мы всегда на связи</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-2 text-xs font-bold text-gray-500">
                            Способы оплаты:
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {["Visa", "Mastercard", "МИР", "QIWI", "YooMoney", "Bitcoin", "Ethereum"].map(payment => (
                                <div key={payment} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded text-xs text-gray-400 font-medium hover:bg-white/10 transition-colors">
                                    {payment}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
                        <p>© 2026 MegaWin. Все права защищены.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-gray-400 transition-colors">Политика конфиденциальности</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Условия использования</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}