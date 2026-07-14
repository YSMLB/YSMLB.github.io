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
const slotSymbols = ["🍒", "🍋", "🍉", "🍇", "⭐", "💎", "7️⃣", "BAR"];

const bonuses = [
    { id: 1, title: "Приветственный бонус", desc: "+200% к первому депозиту до 100,000₽", color: "from-[#2a1a08] to-[#1a1005]", iconColor: "text-orange-500", bgIcon: "bg-orange-500/10", details: "Вейджер: x35. Минимальный депозит для активации: 1,000 ₽. Время на отыгрыш бонуса: 72 часа с момента пополнения. Максимальная ставка при активном бонусе: 500 ₽." },
    { id: 2, title: "Ежедневный кэшбэк", desc: "Возвращаем до 15% каждый день", color: "from-[#081a2a] to-[#05101a]", iconColor: "text-blue-500", bgIcon: "bg-blue-500/10", details: "Кэшбэк начисляется автоматически каждый день в 00:00 (МСК) от суммы чистого проигрыша. Вейджер на кэшбэк: x3. Процент зависит от вашего VIP-уровня." },
    { id: 3, title: "Еженедельный турнир", desc: "Призовой фонд 1,000,000₽", color: "from-[#1a082a] to-[#10051a]", iconColor: "text-purple-500", bgIcon: "bg-purple-500/10", details: "Играй в слоты от провайдера Pragmatic Play. За каждые выигранные 100 ₽ начисляется 1 турнирное очко. Топ-50 игроков разделят призовой фонд в конце недели. Без вейджера на выигрыш!" },
    { id: 4, title: "Фриспины", desc: "150 бесплатных вращений для новых игроков", color: "from-[#082a1a] to-[#051a10]", iconColor: "text-emerald-500", bgIcon: "bg-emerald-500/10", details: "Выдаются частями по 30 фриспинов в день в течение 5 дней на слот 'Lucky Jackpot'. Вейджер на выигрыш с фриспинов: x30. Максимальный вывод: 15,000 ₽." },
];

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

    // БАЛАНСЫ
    const [demoBalance, setDemoBalance] = useState(0);
    const [realBalance, setRealBalance] = useState(0);
    const [activeBalanceType, setActiveBalanceType] = useState('demo');

    // Личный кабинет
    const [stats, setStats] = useState({ wagered: 0, won: 0 });
    const [history, setHistory] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Модалки
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState<number | "">("");
    const [selectedBonus, setSelectedBonus] = useState(null);
    const [isVipModalOpen, setIsVipModalOpen] = useState(false);

    // Игровая система (Слоты 5x3)
    const [activeGame, setActiveGame] = useState(null);
    const [gameStatus, setGameStatus] = useState('idle');
    const [showEpicWin, setShowEpicWin] = useState(false);
    const [gameResultInfo, setGameResultInfo] = useState('');
    const [betAmount, setBetAmount] = useState<number | "">(100);

    // Инициализация сетки 5 колонок по 3 ряда
    const generateGrid = () => Array(5).fill(0).map(() => Array(3).fill(0).map(() => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]));
    const [reelsGrid, setReelsGrid] = useState(generateGrid());
    const rollIntervalRef = useRef(null);

    const filteredGames = activeFilter === "Все игры" ? games : games.filter(game => game.category === activeFilter);
    const currentBalance = activeBalanceType === 'real' ? realBalance : demoBalance;

    // --- МАСКА ДЛЯ ТЕЛЕФОНА ---
    const handlePhoneChange = (e) => {
        const val = e.target.value;
        const numbers = val.replace(/\D/g, '');
        if (numbers.length === 0) { setInputPhone(""); return; }
        let formatted = "+7";
        const body = numbers.startsWith('7') || numbers.startsWith('8') ? numbers.slice(1) : numbers;
        if (body.length > 0) formatted += ` (${body.slice(0, 3)}`;
        if (body.length >= 4) formatted += `) ${body.slice(3, 6)}`;
        if (body.length >= 7) formatted += `-${body.slice(6, 8)}`;
        if (body.length >= 9) formatted += `-${body.slice(8, 10)}`;
        setInputPhone(formatted);
    };

    const handleAuthSubmit = () => {
        if (authStep === 1) {
            if (inputPhone.replace(/\D/g, '').length < 11) return;
            setPhone(inputPhone);
            setSmsCode("");
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

    const handleDeposit = () => {
        const amount = Number(depositAmount);
        if (amount <= 0) return;
        setRealBalance(prev => prev + amount);
        setActiveBalanceType('real');
        setIsDepositOpen(false);
        setHistory(prev => [{ id: Date.now(), type: 'deposit', amount: amount, game: 'Пополнение (Реал)', time: new Date().toLocaleTimeString() }, ...prev]);
        setDepositAmount("");
    };

    const handlePlayGame = (game) => {
        if (!isLoggedIn) { setIsAuthOpen(true); return; }
        setActiveGame(game);
        setGameStatus('idle');
        setShowEpicWin(false);
        setGameResultInfo('');
        setReelsGrid(generateGrid());
    };

    const executeBet = () => {
        const bet = Number(betAmount);
        if (bet <= 0 || currentBalance < bet) {
            setGameResultInfo('Недостаточно средств или неверная ставка!');
            return;
        }

        if (activeBalanceType === 'real') setRealBalance(prev => prev - bet);
        else setDemoBalance(prev => prev - bet);

        setStats(prev => ({ ...prev, wagered: prev.wagered + bet }));
        setGameStatus('rolling');
        setShowEpicWin(false);
        setGameResultInfo('');

        // Вращаем 5 колонок
        rollIntervalRef.current = setInterval(() => {
            setReelsGrid(generateGrid());
        }, 100);

        setTimeout(() => {
            clearInterval(rollIntervalRef.current);
            const luck = Math.random();
            let finalGrid = generateGrid();
            let isWin = false;
            let winAmount = 0;

            if (luck > 0.65) {
                // ВЫИГРЫШ: Форсируем выигрышную линию (средний ряд) или закидываем сетку WILD'ами
                isWin = true;
                const winSymbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                // Делаем средний ряд одинаковым для красоты
                for (let i = 0; i < 5; i++) finalGrid[i][1] = winSymbol;

                const multiplier = (Math.random() * 15 + 2).toFixed(1);
                winAmount = Math.floor(bet * multiplier);

                if (activeBalanceType === 'real') setRealBalance(prev => prev + winAmount);
                else setDemoBalance(prev => prev + winAmount);

                setStats(prev => ({ ...prev, won: prev.won + winAmount }));
                setGameStatus('win');
                setShowEpicWin(true); // Запуск эпичной анимации поверх барабанов
                setGameResultInfo(`ВЫИГРЫШ: +${winAmount} ₽ (x${multiplier})`);
            } else {
                setGameStatus('loss');
                setGameResultInfo('Ставка не сыграла');
            }

            setReelsGrid(finalGrid);
            setHistory(prev => [{
                id: Date.now(), type: isWin ? 'win' : 'loss', amount: isWin ? winAmount : -bet, bet: bet,
                game: `${activeGame.title} (${activeBalanceType === 'real' ? 'Реал' : 'Демо'})`, time: new Date().toLocaleTimeString()
            }, ...prev]);

        }, 1500);
    };

    // Оптимальные ставки
    const setMaxBet = () => setBetAmount(currentBalance > 0 ? currentBalance : 0);
    const setMinBet = () => setBetAmount(10);

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
                            <button onClick={() => { setActiveFilter("Все игры"); document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' }); }} className={`hover:text-white transition-colors ${activeFilter === "Все игры" ? "text-white" : ""}`}>Казино</button>
                            <button onClick={() => { setActiveFilter("Слоты"); document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' }); }} className={`hover:text-white transition-colors ${activeFilter === "Слоты" ? "text-white" : ""}`}>Слоты</button>
                            <button onClick={() => { setActiveFilter("Живые"); document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' }); }} className={`hover:text-white transition-colors ${activeFilter === "Живые" ? "text-white" : ""}`}>Живое Казино</button>
                            <button onClick={() => document.getElementById('promo-section').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Промо</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
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
                        <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">Более 5000+ игр, мгновенные выплаты и щедрые бонусы. Начни играть уже сегодня!</p>

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
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold"><span className="text-[#ff9900]"><StarIcon /></span> {game.rating}</div>
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
                <section id="promo-section" className="mb-24 scroll-mt-28">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-2">Щедрые <span className="text-[#ff9900]">Бонусы</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bonuses.map(bonus => (
                            <div key={bonus.id} className={`bg-[#0e1118] p-8 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px] bg-gradient-to-b from-[#12151f] to-transparent`}>
                                <div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${bonus.bgIcon} ${bonus.iconColor}`}><BoxIcon /></div>
                                    <h3 className="text-xl font-bold mb-2 text-white">{bonus.title}</h3>
                                    <p className="text-sm text-gray-400">{bonus.desc}</p>
                                </div>
                                <button onClick={() => setSelectedBonus(bonus)} className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-sm transition-colors">Подробнее</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* VIP ПРОГРАММА */}
                <section className="bg-gradient-to-r from-[#2d1b3d] to-[#4a2e1b] rounded-[40px] p-10 md:p-16 border border-white/5 mb-24 relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center bg-black/30 text-[#ff9900] border border-[#ff9900]/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Специальное предложение</div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">VIP-программа<br />лояльности</h2>
                            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-sm">Эксклюзивные бонусы, персональный менеджер и приоритетный вывод средств для наших VIP-игроков.</p>
                            <button onClick={() => setIsVipModalOpen(true)} className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-3.5 rounded-xl font-bold transition-colors">Узнать больше</button>
                        </div>
                        <div className="flex-1 w-full bg-[#161318]/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-inner">
                            <div className="flex flex-col gap-2">
                                {[{ level: "Уровень 1 - Бронза", val: "+5% кэшбэк" }, { level: "Уровень 2 - Серебро", val: "+10% кэшбэк" }, { level: "Уровень 3 - Золото", val: "+15% кэшбэк" }].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 px-4 hover:bg-white/5 rounded-xl transition-colors">
                                        <span className="text-gray-300 text-sm font-medium">{item.level}</span><span className="text-[#ff9900] font-bold text-sm">{item.val}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-4 px-4 bg-white/10 rounded-xl mt-2">
                                    <span className="text-white font-bold text-sm">Уровень 4 - Платина</span><span className="text-[#ff9900] font-black text-sm">+20% кэшбэк</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-[#080a0e] pt-16 pb-8 mt-auto">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center text-xs text-gray-600 gap-4">
                        <p>© 2026 MegaWin. Все права защищены.</p>
                    </div>
                </div>
            </footer>

            {/* --- МОДАЛКА: ПОДРОБНОСТИ О БОНУСЕ --- */}
            <AnimatePresence>
                {selectedBonus && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                            <button onClick={() => setSelectedBonus(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${selectedBonus.bgIcon} ${selectedBonus.iconColor}`}><BoxIcon /></div>
                            <h2 className="text-2xl font-black tracking-tighter mb-2 text-white">{selectedBonus.title}</h2>
                            <p className="text-[#ff9900] font-bold mb-6">{selectedBonus.desc}</p>
                            <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-5 text-sm text-gray-400 leading-relaxed font-medium">{selectedBonus.details}</div>
                            <button onClick={() => { setSelectedBonus(null); !isLoggedIn ? setIsAuthOpen(true) : setIsDepositOpen(true); }} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-6 transition-colors">Активировать</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- МОДАЛКА: ИНФОРМАЦИЯ О VIP --- */}
            <AnimatePresence>
                {isVipModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#12151f] border border-[#ff9900]/30 rounded-3xl w-full max-w-2xl p-8 relative shadow-[0_0_50px_rgba(255,153,0,0.1)]">
                            <button onClick={() => setIsVipModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-white uppercase">Статусы <span className="text-[#ff9900]">MegaWin</span></h2>
                            <p className="text-gray-400 text-sm mb-8">Играй на реальные деньги, зарабатывай XP и повышай уровень. Чем выше уровень, тем больше привилегий.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-5"><div className="flex justify-between mb-2"><span className="font-bold text-gray-300">🥉 Бронза</span><span className="text-xs text-gray-500">0 - 10k XP</span></div><ul className="text-sm text-gray-400"><li>• Кэшбэк 5%</li><li>• Лимит 100,000₽/сутки</li></ul></div>
                                <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-5"><div className="flex justify-between mb-2"><span className="font-bold text-gray-200">🥈 Серебро</span><span className="text-xs text-gray-500">10k - 50k XP</span></div><ul className="text-sm text-gray-400"><li>• Кэшбэк 10%</li><li>• Лимит 300,000₽/сутки</li></ul></div>
                                <div className="bg-[#0b0e14] border border-[#ff9900]/20 rounded-xl p-5"><div className="flex justify-between mb-2"><span className="font-bold text-[#ffcd38]">🥇 Золото</span><span className="text-xs text-gray-500">50k - 200k XP</span></div><ul className="text-sm text-gray-400"><li>• Кэшбэк 15%</li><li>• Личный менеджер</li></ul></div>
                                <div className="bg-gradient-to-br from-[#0b0e14] to-[#1a1005] border border-[#ff9900] rounded-xl p-5 shadow-[0_0_15px_rgba(255,153,0,0.1)]"><div className="flex justify-between mb-2"><span className="font-black text-[#ff9900] uppercase">💎 Платина</span><span className="text-xs text-[#ff9900]/70">200k+ XP</span></div><ul className="text-sm text-gray-300"><li>• Кэшбэк 20%</li><li>• Безлимитный вывод</li></ul></div>
                            </div>
                            {!isLoggedIn && <button onClick={() => { setIsVipModalOpen(false); setIsAuthOpen(true); }} className="w-full bg-white hover:bg-gray-200 text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">Начать путь к VIP</button>}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- МОДАЛКИ: АВТ, ДЕПОЗИТ, ПРОФИЛЬ (БЕЗ ИЗМЕНЕНИЙ, ОСТАВЛЯЕМ КАК ЕСТЬ) --- */}
            {isAuthOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
                        <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Вход</h2>
                        <div className="flex flex-col gap-4 mt-8">
                            {authStep === 1 ? (
                                <><input type="tel" value={inputPhone} onChange={handlePhoneChange} placeholder="+7 (999) 000-00-00" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff9900] transition-colors" /><button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Получить код</button></>
                            ) : (
                                <><input type="text" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} placeholder="0000" maxLength={4} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] font-bold text-white focus:outline-none focus:border-[#ff9900] transition-colors" /><button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Подтвердить</button></>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isDepositOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
                        <button onClick={() => setIsDepositOpen(false)} className="absolute top-6 right-6 text-gray-500"><CloseIcon /></button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-[#ff9900]">Касса</h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">{[1000, 5000, 10000].map(amt => <button key={amt} onClick={() => setDepositAmount(amt)} className={`py-3 rounded-lg border font-bold transition-all ${depositAmount === amt ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-[#0b0e14] text-white border-white/10'}`}>{amt} ₽</button>)}</div>
                        <div className="mb-6"><input type="number" placeholder="Другая сумма" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white text-center font-bold text-lg focus:border-[#ff9900]" /></div>
                        <button onClick={handleDeposit} disabled={!depositAmount} className="w-full bg-white text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase disabled:opacity-50">Оплатить {depositAmount ? `${depositAmount} ₽` : ""}</button>
                    </div>
                </div>
            )}

            {isProfileOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-end">
                    <div className="bg-[#12151f] border-l border-white/10 w-full max-w-md h-full flex flex-col p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black uppercase">Профиль</h2><button onClick={() => setIsProfileOpen(false)} className="text-gray-500"><CloseIcon /></button></div>
                        <div className="bg-white/5 rounded-2xl p-6 flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-[#ff9900] rounded-full flex items-center justify-center text-[#0b0e14]"><UserIcon /></div><div><p className="text-gray-400 text-xs uppercase font-bold">Игрок</p><p className="font-bold text-lg">{phone}</p></div></div>
                        <div className="bg-[#0b0e14] rounded-2xl p-5 mb-6"><h3 className="font-bold mb-4">Счета</h3>
                            <button onClick={() => setActiveBalanceType('real')} className={`w-full flex justify-between p-4 rounded-xl border mb-3 ${activeBalanceType === 'real' ? 'border-[#ff9900] bg-[#ff9900]/10' : 'border-white/10'}`}><span className="font-medium text-white">Реальный</span><span className="font-black text-[#ff9900]">{realBalance} ₽</span></button>
                            <button onClick={() => setActiveBalanceType('demo')} className={`w-full flex justify-between p-4 rounded-xl border ${activeBalanceType === 'demo' ? 'border-white bg-white/10' : 'border-white/10'}`}><span className="font-medium text-gray-400">Демо</span><span className="font-black text-white">{demoBalance} ₽</span></button>
                        </div>
                        <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }} className="mt-auto bg-red-500/10 text-red-500 py-4 rounded-xl font-bold uppercase tracking-widest text-sm w-full">Выйти</button>
                    </div>
                </div>
            )}

            {/* --- ЭПИЧНЫЙ СИМУЛЯТОР СЛОТОВ 5x3 (КАК НА СКРИНЕ) --- */}
            <AnimatePresence>
                {activeGame && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[110] flex flex-col">

                        {/* Хедер игры */}
                        <div className="h-16 bg-[#0b0e14] border-b border-white/10 flex justify-between items-center px-4 shrink-0 z-50">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-white p-2"><CloseIcon /></button>
                                <h3 className="font-bold text-white text-sm hidden md:block">{activeGame.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 bg-black rounded-lg border border-white/10 p-1">
                                <button onClick={() => setActiveBalanceType('real')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeBalanceType === 'real' ? 'bg-[#ff9900] text-black' : 'text-gray-500'}`}>Реал: {realBalance}₽</button>
                                <button onClick={() => setActiveBalanceType('demo')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeBalanceType === 'demo' ? 'bg-white text-black' : 'text-gray-500'}`}>Демо: {demoBalance}₽</button>
                            </div>
                        </div>

                        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-6" style={{ backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.7), rgba(11, 14, 20, 0.95)), url(${activeGame.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                            <div className="w-full max-w-5xl flex flex-col items-center z-10 relative">

                                {/* ТАБЛО ДЖЕКПОТОВ (КАК НА СКРИНЕ) */}
                                <div className="flex flex-col items-center mb-4 md:mb-8 w-full px-2">
                                    <div className="bg-red-800/90 border-2 border-yellow-400 rounded-full px-6 py-2 md:px-12 md:py-3 shadow-[0_0_20px_rgba(220,38,38,0.6)] z-20 relative">
                                        <span className="text-yellow-400 font-black text-xl md:text-4xl uppercase tracking-wider drop-shadow-md">GRAND <span className="text-white">8,329,565</span></span>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-2 md:-mt-2 z-10">
                                        <div className="bg-purple-900/90 border-2 border-yellow-400 rounded-full px-4 py-1.5 md:px-6 md:py-2 shadow-lg"><span className="text-yellow-400 font-bold text-sm md:text-xl">MAJOR <span className="text-white">9,882,129</span></span></div>
                                        <div className="bg-blue-900/90 border-2 border-yellow-400 rounded-full px-4 py-1.5 md:px-6 md:py-2 shadow-lg"><span className="text-yellow-400 font-bold text-sm md:text-xl">MINOR <span className="text-white">1,985,882</span></span></div>
                                    </div>
                                    <div className="bg-green-900/90 border-2 border-yellow-400 rounded-full px-4 py-1 mt-2 shadow-lg"><span className="text-yellow-400 font-bold text-xs md:text-lg">MINI <span className="text-white">999,954</span></span></div>
                                </div>

                                {/* СЕТКА СЛОТОВ 5x3 */}
                                <div className="relative bg-gradient-to-b from-red-900 to-red-950 border-4 border-yellow-500 rounded-[20px] md:rounded-[40px] p-2 md:p-6 shadow-[0_0_50px_rgba(255,215,0,0.3)] mb-6 w-full">
                                    <div className="bg-[#0b0e14] border-4 border-[#12151f] rounded-xl md:rounded-3xl p-2 md:p-4 grid grid-cols-5 gap-1 md:gap-3 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] relative">

                                        {/* Эпичный выигрыш: Наложение огромных WILD (Как на скрине) */}
                                        <AnimatePresence>
                                            {showEpicWin && (
                                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        {/* Центральный гигантский WILD */}
                                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute z-40 bg-gradient-to-b from-yellow-300 to-yellow-600 border-4 border-white text-red-700 font-black text-4xl md:text-8xl px-6 py-2 md:px-12 md:py-4 rounded-[40px] md:rounded-[100px] shadow-[0_0_50px_rgba(255,215,0,1)] rotate-[-5deg] tracking-tighter" style={{ WebkitTextStroke: '2px white' }}>WILD</motion.div>
                                                        {/* Боковые WILD */}
                                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute left-[5%] top-[10%] bg-gradient-to-b from-yellow-300 to-yellow-600 border-2 border-white text-red-700 font-black text-2xl md:text-5xl px-4 py-1 md:px-8 md:py-2 rounded-full shadow-[0_0_30px_rgba(255,215,0,1)] rotate-[10deg] tracking-tighter">WILD</motion.div>
                                                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="absolute right-[5%] bottom-[10%] bg-gradient-to-b from-yellow-300 to-yellow-600 border-2 border-white text-red-700 font-black text-2xl md:text-5xl px-4 py-1 md:px-8 md:py-2 rounded-full shadow-[0_0_30px_rgba(255,215,0,1)] rotate-[-15deg] tracking-tighter">WILD</motion.div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Отрисовка 5 колонок */}
                                        {reelsGrid.map((col, colIdx) => (
                                            <div key={colIdx} className="flex flex-col gap-1 md:gap-3">
                                                {col.map((symbol, rowIdx) => (
                                                    <div key={rowIdx} className="w-full aspect-[4/5] bg-gradient-to-b from-gray-200 to-white rounded-md md:rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
                                                        <motion.div
                                                            initial={gameStatus === 'rolling' ? { y: -100, filter: "blur(4px)" } : { y: 0 }}
                                                            animate={gameStatus === 'rolling' ? { y: [100, -100], transition: { repeat: Infinity, duration: 0.1, ease: "linear" } } : { y: 0, filter: "blur(0px)", transition: { type: "spring", bounce: 0.5 } }}
                                                            className="text-3xl md:text-6xl absolute"
                                                        >
                                                            {symbol}
                                                        </motion.div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                    </div>
                                </div>

                                {/* ИНФО О ВЫИГРЫШЕ */}
                                <div className="h-8 md:h-12 flex items-center justify-center mb-4 w-full">
                                    {gameStatus === 'win' && <span className="text-[#ff9900] text-xl md:text-3xl font-black uppercase drop-shadow-[0_0_15px_rgba(255,153,0,0.8)]">{gameResultInfo}</span>}
                                    {gameStatus === 'loss' && <span className="text-gray-400 text-sm md:text-lg font-bold uppercase">{gameResultInfo}</span>}
                                    {gameStatus === 'idle' && <span className="text-gray-400 font-medium text-xs md:text-sm tracking-widest uppercase">Делайте ваши ставки</span>}
                                </div>

                                {/* ПАНЕЛЬ УПРАВЛЕНИЯ (СВОЙ ВВОД + КНОПКИ) */}
                                <div className="bg-[#12151f]/90 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-4 w-full flex flex-col md:flex-row items-center justify-between gap-4">

                                    <div className="flex flex-col w-full md:w-auto gap-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ставка (₽)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={setMinBet} disabled={gameStatus === 'rolling'} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 md:px-4 rounded-xl text-xs md:text-sm font-bold text-gray-400">MIN</button>
                                            <input
                                                type="number"
                                                value={betAmount}
                                                onChange={(e) => setBetAmount(e.target.value)}
                                                disabled={gameStatus === 'rolling'}
                                                className="bg-[#0b0e14] border border-white/10 rounded-xl w-20 md:w-28 text-center font-bold text-white focus:border-[#ff9900] focus:outline-none disabled:opacity-50"
                                            />
                                            <button onClick={() => setBetAmount(100)} disabled={gameStatus === 'rolling'} className="hidden md:block bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl text-sm font-bold">100</button>
                                            <button onClick={() => setBetAmount(500)} disabled={gameStatus === 'rolling'} className="hidden md:block bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl text-sm font-bold">500</button>
                                            <button onClick={() => setBetAmount(1000)} disabled={gameStatus === 'rolling'} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 md:px-4 rounded-xl text-xs md:text-sm font-bold">1000</button>
                                            <button onClick={setMaxBet} disabled={gameStatus === 'rolling'} className="bg-[#ff9900]/20 hover:bg-[#ff9900]/40 text-[#ff9900] border border-[#ff9900]/30 px-3 md:px-4 rounded-xl text-xs md:text-sm font-bold">MAX</button>
                                        </div>
                                    </div>

                                    <button onClick={executeBet} disabled={gameStatus === 'rolling'} className={`w-full md:w-64 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-base md:text-xl transition-all ${gameStatus === 'rolling' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-t from-[#e68a00] to-[#ff9900] text-[#0b0e14] shadow-[0_10px_0_#b36b00,0_15px_20px_rgba(255,153,0,0.4)] hover:translate-y-1 hover:shadow-[0_6px_0_#b36b00,0_10px_15px_rgba(255,153,0,0.4)] active:translate-y-2 active:shadow-[0_0_0_#b36b00,0_0_0_rgba(255,153,0,0.4)]'}`}>
                                        {gameStatus === 'rolling' ? 'КРУТИМ...' : 'SPIN 🎰'}
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