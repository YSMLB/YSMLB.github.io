"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- MOCK ДАННЫЕ ---
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
const slotSymbols = ["🍒", "🍋", "🍉", "🍇", "⭐", "💎", "7️⃣"];

// --- ИКОНКИ ---
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;

export default function MegaWin() {
    const [activeFilter, setActiveFilter] = useState("Все игры");

    // СОСТОЯНИЯ ПРИЛОЖЕНИЯ
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [phone, setPhone] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [smsCode, setSmsCode] = useState("");

    // ДВОЙНОЙ БАЛАНС
    const [demoBalance, setDemoBalance] = useState(0);
    const [realBalance, setRealBalance] = useState(0);
    const [activeBalanceType, setActiveBalanceType] = useState('demo'); // 'demo' | 'real'

    // Личный кабинет
    const [stats, setStats] = useState({ wagered: 0, won: 0 });
    const [history, setHistory] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Модалки
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState<number | "">(""); // Пустое поле для своего ввода

    // Игровая система (Слоты)
    const [activeGame, setActiveGame] = useState(null);
    const [gameStatus, setGameStatus] = useState('idle');
    const [gameResultInfo, setGameResultInfo] = useState('');
    const [betAmount, setBetAmount] = useState(100);
    const [reels, setReels] = useState(["🍒", "🍋", "🍉"]);
    const rollIntervalRef = useRef(null);

    const filteredGames = activeFilter === "Все игры" ? games : games.filter(game => game.category === activeFilter);

    // --- МАСКА ДЛЯ ТЕЛЕФОНА ---
    const handlePhoneChange = (e) => {
        const val = e.target.value;
        const numbers = val.replace(/\D/g, '');

        if (numbers.length === 0) {
            setInputPhone("");
            return;
        }

        let formatted = "+7";
        const body = numbers.startsWith('7') || numbers.startsWith('8') ? numbers.slice(1) : numbers;

        if (body.length > 0) formatted += ` (${body.slice(0, 3)}`;
        if (body.length >= 4) formatted += `) ${body.slice(3, 6)}`;
        if (body.length >= 7) formatted += `-${body.slice(6, 8)}`;
        if (body.length >= 9) formatted += `-${body.slice(8, 10)}`;

        setInputPhone(formatted);
    };

    // --- ЛОГИКА АВТОРИЗАЦИИ ---
    const handleAuthSubmit = () => {
        if (authStep === 1) {
            if (inputPhone.replace(/\D/g, '').length < 11) return; // Проверка длины
            setPhone(inputPhone);
            setSmsCode(""); // ИСПРАВЛЕНИЕ: Очищаем поле кода
            setAuthStep(2);
        } else {
            setIsLoggedIn(true);
            setDemoBalance(10000);
            setRealBalance(0);
            setActiveBalanceType('demo');
            setIsAuthOpen(false);
            setAuthStep(1);
        }
    };

    // --- ЛОГИКА ПОПОЛНЕНИЯ (НА РЕАЛЬНЫЙ СЧЕТ) ---
    const handleDeposit = () => {
        const amount = Number(depositAmount);
        if (amount <= 0) return;

        setRealBalance(prev => prev + amount);
        setActiveBalanceType('real'); // Автоматически переключаем на реал
        setIsDepositOpen(false);

        setHistory(prev => [{
            id: Date.now(), type: 'deposit', amount: amount, game: 'Пополнение (Реал)', time: new Date().toLocaleTimeString()
        }, ...prev]);

        setDepositAmount("");
    };

    // --- ЛОГИКА ИГРЫ (СЛОТЫ) ---
    const handlePlayGame = (game) => {
        if (!isLoggedIn) {
            setIsAuthOpen(true);
            return;
        }
        setActiveGame(game);
        setGameStatus('idle');
        setGameResultInfo('');
        setReels(["🍒", "🍋", "🍉"]);
    };

    const executeBet = () => {
        const currentBalance = activeBalanceType === 'real' ? realBalance : demoBalance;

        if (currentBalance < betAmount) {
            setGameResultInfo('Недостаточно средств!');
            return;
        }

        // Списание ставки
        if (activeBalanceType === 'real') {
            setRealBalance(prev => prev - betAmount);
        } else {
            setDemoBalance(prev => prev - betAmount);
        }

        setStats(prev => ({ ...prev, wagered: prev.wagered + betAmount }));
        setGameStatus('rolling');
        setGameResultInfo('');

        rollIntervalRef.current = setInterval(() => {
            setReels([
                slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
                slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
                slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
            ]);
        }, 80);

        setTimeout(() => {
            clearInterval(rollIntervalRef.current);
            const luck = Math.random();

            let finalReels = [];
            let isWin = false;
            let winAmount = 0;

            if (luck > 0.70) {
                isWin = true;
                const winSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                finalReels = [winSymbol, winSymbol, winSymbol];

                const multiplier = (Math.random() * 8 + 2).toFixed(1);
                winAmount = Math.floor(betAmount * multiplier);

                if (activeBalanceType === 'real') {
                    setRealBalance(prev => prev + winAmount);
                } else {
                    setDemoBalance(prev => prev + winAmount);
                }

                setStats(prev => ({ ...prev, won: prev.won + winAmount }));
                setGameStatus('win');
                setGameResultInfo(`ВЫИГРЫШ: +${winAmount} ₽ (x${multiplier})`);
            } else {
                finalReels = [
                    slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
                    slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
                    slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
                ];
                if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
                    finalReels[2] = finalReels[0] === "🍒" ? "🍋" : "🍒";
                }
                setGameStatus('loss');
                setGameResultInfo('Ставка не сыграла');
            }

            setReels(finalReels);

            setHistory(prev => [{
                id: Date.now(),
                type: isWin ? 'win' : 'loss',
                amount: isWin ? winAmount : -betAmount,
                bet: betAmount,
                game: `${activeGame.title} (${activeBalanceType === 'real' ? 'Реал' : 'Демо'})`,
                time: new Date().toLocaleTimeString()
            }, ...prev]);

        }, 1500);
    };

    const handleNavClick = (filter) => {
        setActiveFilter(filter);
        document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#0b0e14] min-h-screen text-white font-sans selection:bg-[#ff9900] selection:text-white pb-20">

            {/* --- НАВИГАЦИЯ --- */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12 lg:gap-16">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="bg-[#ff9900] text-[#0b0e14] w-12 h-12 flex items-center justify-center rounded-[14px]">
                                <CrownIcon />
                            </div>
                            <div className="flex flex-col justify-center mt-1">
                                <h1 className="text-[26px] font-black leading-none tracking-tight text-white mb-0.5">MegaWin</h1>
                                <span className="text-[10px] text-[#ff9900] font-bold tracking-[0.15em] uppercase leading-none">Casino Online</span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-gray-400">
                            <button onClick={() => handleNavClick("Все игры")} className={`hover:text-white transition-colors ${activeFilter === "Все игры" ? "text-white" : ""}`}>Казино</button>
                            <button onClick={() => handleNavClick("Слоты")} className={`hover:text-white transition-colors ${activeFilter === "Слоты" ? "text-white" : ""}`}>Слоты</button>
                            <button onClick={() => handleNavClick("Живые")} className={`hover:text-white transition-colors ${activeFilter === "Живые" ? "text-white" : ""}`}>Живое Казино</button>
                            <button onClick={() => handleNavClick("Настольные")} className={`hover:text-white transition-colors ${activeFilter === "Настольные" ? "text-white" : ""}`}>Турниры</button>
                            <button onClick={() => document.getElementById('promo-section').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Промо</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                {/* Кнопка кошелька показывает текущий активный баланс */}
                                <button onClick={() => setIsDepositOpen(true)} className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg border border-white/10 transition-colors group">
                                    <WalletIcon />
                                    <span className="font-bold text-sm text-[#ff9900] group-hover:text-white transition-colors">
                                        {(activeBalanceType === 'real' ? realBalance : demoBalance).toLocaleString('ru-RU')} ₽
                                        <span className="text-gray-500 text-xs ml-1 uppercase">({activeBalanceType})</span>
                                    </span>
                                </button>
                                <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                                    <UserIcon /> Профиль
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                                <UserIcon /> Войти
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-28 max-w-[1400px] mx-auto px-6">

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
                            <button onClick={() => { !isLoggedIn ? setIsAuthOpen(true) : setIsDepositOpen(true) }} className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                {isLoggedIn ? "Пополнить баланс" : "Получить Бонус"}
                            </button>
                            <button onClick={() => handlePlayGame(games[Math.floor(Math.random() * games.length)])} className="bg-white hover:bg-gray-200 text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-colors">
                                Мне повезет!
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-[500px] bg-[#12151f] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="border border-[#ff9900]/50 rounded-2xl p-8 text-center mb-6 bg-[#0b0e14]/50 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 font-medium mb-2">Приветственный Бонус</p>
                                <h3 className="text-5xl font-black text-[#ff9900] mb-2">+200%</h3>
                                <p className="text-gray-300 font-medium">до 100,000₽</p>
                            </div>
                            {!isLoggedIn && (
                                <button onClick={() => setIsAuthOpen(true)} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] py-4 rounded-xl font-bold transition-colors">
                                    Зарегистрироваться
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ПОПУЛЯРНЫЕ ИГРЫ */}
                <section id="games-section" className="mb-24 scroll-mt-28">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Популярные <span className="text-[#ff9900]">Игры</span></h2>
                        <p className="text-gray-400 text-sm">Выбери свою удачу из тысяч игр</p>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveFilter(cat)} className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeFilter === cat ? "bg-[#ff9900] text-[#0b0e14] shadow-[0_0_15px_rgba(255,153,0,0.3)]" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredGames.map(game => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} key={game.id} className="group bg-[#12151f] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 cursor-pointer" onClick={() => handlePlayGame(game)}>
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={game.img} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold">
                                            <span className="text-[#ff9900]"><StarIcon /></span> {game.rating}
                                        </div>

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

                {/* ЩЕДРЫЕ БОНУСЫ (ДИЗАЙН ИЗ ФИГМЫ) */}
                <section id="promo-section" className="mb-24 scroll-mt-28">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-2">Щедрые <span className="text-[#ff9900]">Бонусы</span></h2>
                        <p className="text-gray-400 text-sm">Больше бонусов, больше выигрышей!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Карточка 1 */}
                        <div className="bg-[#1f1207] p-8 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                            <div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-[#ff9900]/10 text-[#ff9900]">
                                    <BoxIcon />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">Приветственный бонус</h3>
                                <p className="text-sm text-gray-400">+200% к первому депозиту до 100,000₽</p>
                            </div>
                            <button className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-sm transition-colors">Подробнее</button>
                        </div>

                        {/* Карточка 2 */}
                        <div className="bg-[#0b1724] p-8 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                            <div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-blue-500/10 text-blue-500">
                                    <BoxIcon />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">Ежедневный кэшбэк</h3>
                                <p className="text-sm text-gray-400">Возвращаем до 15% каждый день</p>
                            </div>
                            <button className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-sm transition-colors">Подробнее</button>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-[#190a23] p-8 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                            <div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-purple-500/10 text-purple-500">
                                    <BoxIcon />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">Еженедельный турнир</h3>
                                <p className="text-sm text-gray-400">Призовой фонд 1,000,000₽</p>
                            </div>
                            <button className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-sm transition-colors">Подробнее</button>
                        </div>

                        {/* Карточка 4 */}
                        <div className="bg-[#081f13] p-8 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                            <div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-emerald-500/10 text-emerald-500">
                                    <BoxIcon />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">Фриспины</h3>
                                <p className="text-sm text-gray-400">150 бесплатных вращений для новых игроков</p>
                            </div>
                            <button className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-sm transition-colors">Подробнее</button>
                        </div>
                    </div>
                </section>

                {/* VIP ПРОГРАММА (ДИЗАЙН ИЗ ФИГМЫ) */}
                <section className="bg-gradient-to-r from-[#2d1b3d] to-[#4a2e1b] rounded-[40px] p-10 md:p-16 border border-white/5 mb-24 relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">

                        <div className="flex-1">
                            <div className="inline-flex items-center bg-black/30 text-[#ff9900] border border-[#ff9900]/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                                Специальное предложение
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">VIP-программа<br />лояльности</h2>
                            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-sm">
                                Эксклюзивные бонусы, персональный менеджер и приоритетный вывод средств для наших VIP-игроков.
                            </p>
                            <button className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-3.5 rounded-xl font-bold transition-colors">
                                Узнать больше
                            </button>
                        </div>

                        <div className="flex-1 w-full bg-[#161318]/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-inner">
                            <div className="flex flex-col gap-2">
                                {[
                                    { level: "Уровень 1 - Бронза", val: "+5% кэшбэк" },
                                    { level: "Уровень 2 - Серебро", val: "+10% кэшбэк" },
                                    { level: "Уровень 3 - Золото", val: "+15% кэшбэк" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 px-4 hover:bg-white/5 rounded-xl transition-colors">
                                        <span className="text-gray-300 text-sm font-medium">{item.level}</span>
                                        <span className="text-[#ff9900] font-bold text-sm">{item.val}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-4 px-4 bg-white/10 rounded-xl mt-2">
                                    <span className="text-white font-bold text-sm">Уровень 4 - Платина</span>
                                    <span className="text-[#ff9900] font-black text-sm">{item?.val || "+20% кэшбэк"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- МОДАЛКА: АВТОРИЗАЦИЯ (ИСПРАВЛЕНА) --- */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Вход в систему</h2>
                            <p className="text-gray-400 text-sm mb-8">Получи стартовый бонус 10,000 ₽ на демо-счет.</p>

                            <div className="flex flex-col gap-4">
                                {authStep === 1 ? (
                                    <>
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Номер телефона</label>
                                        <input
                                            type="tel"
                                            value={inputPhone}
                                            onChange={handlePhoneChange}
                                            placeholder="+7 (999) 000-00-00"
                                            className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff9900] transition-colors"
                                        />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Получить код</button>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Код из СМС (введи любой)</label>
                                        <input
                                            type="text"
                                            value={smsCode}
                                            onChange={(e) => setSmsCode(e.target.value)}
                                            placeholder="0000"
                                            maxLength={4}
                                            className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] font-bold text-white focus:outline-none focus:border-[#ff9900] transition-colors"
                                        />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Подтвердить</button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- МОДАЛКА: ПОПОЛНЕНИЕ (СВОЯ СУММА) --- */}
            <AnimatePresence>
                {isDepositOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                            <button onClick={() => setIsDepositOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#ff9900]">Касса</h2>
                            <p className="text-gray-400 text-sm mb-6">Пополнение Реального счета.</p>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {[1000, 5000, 10000].map(amt => (
                                    <button key={amt} onClick={() => setDepositAmount(amt)} className={`py-3 rounded-lg border font-bold transition-all ${depositAmount === amt ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-[#0b0e14] text-white border-white/10 hover:border-[#ff9900]/50'}`}>
                                        {amt} ₽
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <input
                                    type="number"
                                    placeholder="Другая сумма"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff9900] transition-colors text-center font-bold text-lg"
                                />
                            </div>

                            <button onClick={handleDeposit} disabled={!depositAmount} className="w-full bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">
                                Оплатить {depositAmount ? `${depositAmount} ₽` : ""}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- МОДАЛКА: ЛИЧНЫЙ КАБИНЕТ (С ВЫБОРОМ БАЛАНСА) --- */}
            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-end">
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-[#12151f] border-l border-white/10 w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">

                            <div className="p-6 bg-[#0b0e14] border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
                                <h2 className="text-2xl font-black uppercase">Профиль</h2>
                                <button onClick={() => setIsProfileOpen(false)} className="text-gray-500 hover:text-white"><CloseIcon /></button>
                            </div>

                            <div className="p-6 flex flex-col gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-[#ff9900] to-yellow-400 rounded-full flex items-center justify-center text-[#0b0e14] shadow-lg shadow-[#ff9900]/20">
                                        <UserIcon />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Игрок</p>
                                        <p className="font-bold text-lg">{phone || "Неизвестный"}</p>
                                    </div>
                                </div>

                                {/* УПРАВЛЕНИЕ БАЛАНСАМИ */}
                                <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-5">
                                    <h3 className="font-bold text-white mb-4">Ваши счета</h3>
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => setActiveBalanceType('real')} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${activeBalanceType === 'real' ? 'border-[#ff9900] bg-[#ff9900]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                                            <span className="font-medium text-white">Реальный</span>
                                            <span className="font-black text-[#ff9900]">{realBalance.toLocaleString('ru-RU')} ₽</span>
                                        </button>
                                        <button onClick={() => setActiveBalanceType('demo')} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${activeBalanceType === 'demo' ? 'border-white text-white bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                                            <span className="font-medium text-gray-400">Демо счет</span>
                                            <span className="font-black text-white">{demoBalance.toLocaleString('ru-RU')} ₽</span>
                                        </button>
                                    </div>
                                    <button onClick={() => { setIsProfileOpen(false); setIsDepositOpen(true) }} className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                                        Пополнить Реал
                                    </button>
                                </div>

                                {/* История */}
                                <div>
                                    <h3 className="font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">История операций</h3>
                                    <div className="flex flex-col gap-3">
                                        {history.length === 0 ? (
                                            <p className="text-gray-500 text-sm text-center py-8">История пуста.</p>
                                        ) : (
                                            history.map(item => (
                                                <div key={item.id} className="bg-[#0b0e14] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-sm text-white">{item.game}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{item.time} {item.bet ? `• Ставка: ${item.bet}₽` : ''}</p>
                                                    </div>
                                                    <div className={`font-black text-sm ${item.type === 'win' || item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {item.amount > 0 ? '+' : ''}{item.amount} ₽
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); setHistory([]); setStats({ wagered: 0, won: 0 }); setRealBalance(0); }} className="mt-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-xl font-bold transition-colors w-full uppercase tracking-widest text-sm">
                                    Выйти из аккаунта
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- СИМУЛЯТОР СЛОТОВ (ОКНО ГЕЙМПЛЕЯ) --- */}
            <AnimatePresence>
                {activeGame && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[110] flex flex-col">

                        <div className="h-16 bg-[#0b0e14] border-b border-white/10 flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
                            <div className="flex items-center gap-2 md:gap-4">
                                <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-white p-2"><CloseIcon /></button>
                                <h3 className="font-bold text-white text-sm md:text-base">{activeGame.title} <span className="hidden md:inline text-gray-500 text-xs ml-2">by {activeGame.provider}</span></h3>
                            </div>

                            <div className="flex items-center gap-2 bg-black rounded-lg border border-white/10 p-1">
                                <button onClick={() => setActiveBalanceType('real')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeBalanceType === 'real' ? 'bg-[#ff9900] text-black' : 'text-gray-500'}`}>
                                    Реал: {realBalance}₽
                                </button>
                                <button onClick={() => setActiveBalanceType('demo')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeBalanceType === 'demo' ? 'bg-white text-black' : 'text-gray-500'}`}>
                                    Демо: {demoBalance}₽
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6" style={{
                            backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.85), rgba(11, 14, 20, 0.95)), url(${activeGame.img})`,
                            backgroundSize: 'cover', backgroundPosition: 'center'
                        }}>

                            <div className="w-full max-w-3xl flex flex-col items-center z-10">

                                {/* МАШИНА СЛОТОВ */}
                                <div className="bg-[#12151f] border-4 border-[#ff9900] rounded-[30px] md:rounded-[40px] p-4 md:p-6 shadow-[0_0_50px_rgba(255,153,0,0.2)] mb-6 md:mb-8 w-full">
                                    <div className="bg-[#0b0e14] border-4 border-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-8 flex justify-center gap-2 md:gap-8 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]">

                                        {reels.map((symbol, idx) => (
                                            <div key={idx} className="w-20 h-24 md:w-32 md:h-40 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 rounded-xl md:rounded-2xl border-y-4 border-white/20 flex items-center justify-center shadow-lg relative overflow-hidden">
                                                <motion.div
                                                    key={symbol + gameStatus}
                                                    initial={gameStatus === 'rolling' ? { y: -100, filter: "blur(4px)" } : { y: 0 }}
                                                    animate={gameStatus === 'rolling' ? { y: [100, -100], transition: { repeat: Infinity, duration: 0.1, ease: "linear" } } : { y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.5 } }}
                                                    className="text-5xl md:text-7xl absolute"
                                                >
                                                    {symbol}
                                                </motion.div>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                                {/* ИНФОРМАЦИЯ О РЕЗУЛЬТАТЕ */}
                                <div className="h-12 md:h-16 flex items-center justify-center mb-4 md:mb-6">
                                    {gameStatus === 'win' && <motion.span initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-[#ff9900] text-2xl md:text-4xl font-black uppercase drop-shadow-[0_0_15px_rgba(255,153,0,0.8)]">{gameResultInfo}</motion.span>}
                                    {gameStatus === 'loss' && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-lg md:text-xl font-bold uppercase">{gameResultInfo}</motion.span>}
                                    {gameStatus === 'idle' && <span className="text-gray-500 font-medium text-sm md:text-base">Крутите слоты ({activeBalanceType === 'real' ? 'Реальный счет' : 'Демо счет'})</span>}
                                </div>

                                {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
                                <div className="bg-[#12151f]/90 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest text-center md:text-left">Ставка</span>
                                        <div className="flex gap-2 justify-center">
                                            {[100, 500, 1000].map(bet => (
                                                <button key={bet} onClick={() => setBetAmount(bet)} disabled={gameStatus === 'rolling'} className={`px-4 py-3 md:px-6 md:py-4 rounded-xl font-black text-sm md:text-base transition-all ${betAmount === bet ? 'bg-white text-[#0b0e14] shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                                    {bet} ₽
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={executeBet}
                                        disabled={gameStatus === 'rolling'}
                                        className={`w-full md:w-auto px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-base md:text-lg transition-all ${gameStatus === 'rolling' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-t from-[#e68a00] to-[#ff9900] text-[#0b0e14] shadow-[0_10px_0_#b36b00,0_15px_20px_rgba(255,153,0,0.4)] hover:translate-y-1 hover:shadow-[0_6px_0_#b36b00,0_10px_15px_rgba(255,153,0,0.4)] active:translate-y-2 active:shadow-[0_0_0_#b36b00,0_0_0_rgba(255,153,0,0.4)]'}`}
                                    >
                                        {gameStatus === 'rolling' ? 'КРУТИМ...' : 'КРУТИТЬ'}
                                    </button>

                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}