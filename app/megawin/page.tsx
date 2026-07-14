"use client";

import { useState, useEffect } from "react";
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
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function MegaWin() {
    const [activeFilter, setActiveFilter] = useState("Все игры");

    // СОСТОЯНИЯ ПРИЛОЖЕНИЯ (STATE MANAGEMENT)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [balance, setBalance] = useState(0);

    // Модалки
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authStep, setAuthStep] = useState(1); // 1 = Телефон, 2 = Код
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState(1000);

    // Игровая система
    const [activeGame, setActiveGame] = useState(null);
    const [gameStatus, setGameStatus] = useState('idle'); // idle, rolling, win, loss
    const [gameResultInfo, setGameResultInfo] = useState('');
    const [betAmount, setBetAmount] = useState(100);

    const filteredGames = activeFilter === "Все игры"
        ? games
        : games.filter(game => game.category === activeFilter);

    // --- ЛОГИКА АВТОРИЗАЦИИ ---
    const handleAuthSubmit = () => {
        if (authStep === 1) {
            setAuthStep(2); // Переходим к вводу кода
        } else {
            setIsLoggedIn(true);
            setBalance(10000); // Даем стартовый демо-баланс
            setIsAuthOpen(false);
            setAuthStep(1);
        }
    };

    // --- ЛОГИКА ПОПОЛНЕНИЯ ---
    const handleDeposit = () => {
        setBalance(prev => prev + depositAmount);
        setIsDepositOpen(false);
    };

    // --- ЛОГИКА ИГРЫ (RNG СИМУЛЯТОР) ---
    const handlePlayGame = (game) => {
        if (!isLoggedIn) {
            setIsAuthOpen(true);
            return;
        }
        setActiveGame(game);
        setGameStatus('idle');
        setGameResultInfo('');
    };

    const executeBet = () => {
        if (balance < betAmount) {
            setGameResultInfo('Недостаточно средств!');
            return;
        }

        setBalance(prev => prev - betAmount); // Списываем ставку
        setGameStatus('rolling');
        setGameResultInfo('Генерация результата...');

        // Симуляция ответа от сервера провайдера
        setTimeout(() => {
            const luck = Math.random();

            if (luck > 0.65) {
                // Выигрыш! (Случайный множитель от x1.5 до x10)
                const multiplier = (Math.random() * 8.5 + 1.5).toFixed(1);
                const winAmount = Math.floor(betAmount * multiplier);

                setBalance(prev => prev + winAmount);
                setGameStatus('win');
                setGameResultInfo(`ОГРОМНЫЙ ВЫИГРЫШ! +${winAmount} ₽ (x${multiplier})`);
            } else {
                // Проигрыш
                setGameStatus('loss');
                setGameResultInfo('Ставка не сыграла. Попробуй еще раз!');
            }
        }, 1500); // Крутим 1.5 секунды
    };

    return (
        <div className="bg-[#0b0e14] min-h-screen text-white font-sans selection:bg-[#ff9900] selection:text-white pb-20">

            {/* НАВИГАЦИЯ */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/5">
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
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => setIsDepositOpen(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-colors group">
                                    <WalletIcon />
                                    <span className="font-bold text-sm text-[#ff9900] group-hover:text-white transition-colors">
                                        {balance.toLocaleString('ru-RU')} ₽ <span className="text-gray-500 text-xs ml-1">+</span>
                                    </span>
                                </button>
                                <div className="w-10 h-10 bg-gradient-to-tr from-[#ff9900] to-yellow-400 rounded-lg flex items-center justify-center text-[#0b0e14] cursor-pointer">
                                    <UserIcon />
                                </div>
                            </>
                        ) : (
                            <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                                <UserIcon />
                                Войти
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

                    {/* Карточка бонуса */}
                    <div className="w-full lg:w-[500px] bg-[#12151f] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="border border-[#ff9900]/50 rounded-2xl p-8 text-center mb-6 bg-[#0b0e14]/50 backdrop-blur-sm">
                                <p className="text-sm text-gray-400 font-medium mb-2">Приветственный Бонус</p>
                                <h3 className="text-5xl font-black text-[#ff9900] mb-2">+200%</h3>
                                <p className="text-gray-300 font-medium">до 100,000₽</p>
                            </div>
                            <button onClick={() => setIsAuthOpen(true)} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] py-4 rounded-xl font-bold transition-colors">
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
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} key={game.id} className="group bg-[#12151f] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={game.img} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold"><span className="text-[#ff9900]"><StarIcon /></span> {game.rating}</div>

                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button onClick={() => handlePlayGame(game)} className="bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-[0_0_20px_rgba(255,153,0,0.4)]">
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
            </main>

            {/* --- МОДАЛКА: АВТОРИЗАЦИЯ --- */}
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
                                        <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff9900] transition-colors" />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Получить код</button>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block">Код из СМС (введи любой)</label>
                                        <input type="text" placeholder="0000" maxLength={4} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] font-bold text-white focus:outline-none focus:border-[#ff9900] transition-colors" />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest mt-4">Подтвердить</button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- МОДАЛКА: ПОПОЛНЕНИЕ (ДЕПОЗИТ) --- */}
            <AnimatePresence>
                {isDepositOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#12151f] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                            <button onClick={() => setIsDepositOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[#ff9900]">Касса</h2>
                            <p className="text-gray-400 text-sm mb-6">Пополнение демо-баланса.</p>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[1000, 5000, 10000].map(amt => (
                                    <button key={amt} onClick={() => setDepositAmount(amt)} className={`py-3 rounded-lg border font-bold transition-all ${depositAmount === amt ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-[#0b0e14] text-white border-white/10 hover:border-[#ff9900]/50'}`}>
                                        {amt} ₽
                                    </button>
                                ))}
                            </div>

                            <button onClick={handleDeposit} className="w-full bg-white hover:bg-gray-200 text-[#0b0e14] px-6 py-4 rounded-xl font-bold uppercase tracking-widest">
                                Оплатить {depositAmount} ₽
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- СИМУЛЯТОР ИГРЫ (ОКНО ГЕЙМПЛЕЯ) --- */}
            <AnimatePresence>
                {activeGame && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[110] flex flex-col">

                        {/* Игровой Хедер */}
                        <div className="h-16 bg-[#0b0e14] border-b border-white/10 flex justify-between items-center px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                                <h3 className="font-bold text-white">{activeGame.title} <span className="text-gray-500 text-xs ml-2">by {activeGame.provider}</span></h3>
                            </div>
                            <div className="bg-white/10 px-4 py-1.5 rounded-full font-bold text-[#ff9900]">
                                Баланс: {balance.toLocaleString('ru-RU')} ₽
                            </div>
                        </div>

                        {/* Игровое Поле (Canvas-имитация) */}
                        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6" style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${activeGame.img})`,
                            backgroundSize: 'cover', backgroundPosition: 'center'
                        }}>

                            <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-xl text-center shadow-2xl relative overflow-hidden">
                                <h2 className="text-3xl font-black mb-8 uppercase text-white">Сделайте Вашу Ставку</h2>

                                {/* Анимация результата */}
                                <div className="h-32 flex items-center justify-center mb-8 border-y border-white/10">
                                    {gameStatus === 'idle' && <span className="text-gray-500 text-lg">Ждем ставку...</span>}
                                    {gameStatus === 'rolling' && (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full" />
                                    )}
                                    {gameStatus === 'win' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#ff9900] text-2xl md:text-3xl font-black uppercase shadow-black drop-shadow-lg">{gameResultInfo}</motion.span>}
                                    {gameStatus === 'loss' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gray-400 text-xl font-bold uppercase">{gameResultInfo}</motion.span>}
                                </div>

                                {/* Выбор ставки */}
                                <div className="flex justify-center gap-4 mb-8">
                                    {[100, 500, 1000].map(bet => (
                                        <button key={bet} onClick={() => setBetAmount(bet)} disabled={gameStatus === 'rolling'} className={`px-6 py-2 rounded-lg font-bold transition-all ${betAmount === bet ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                            {bet} ₽
                                        </button>
                                    ))}
                                </div>

                                {/* Кнопка запуска */}
                                <button
                                    onClick={executeBet}
                                    disabled={gameStatus === 'rolling'}
                                    className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-lg transition-all ${gameStatus === 'rolling' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] shadow-[0_0_30px_rgba(255,153,0,0.4)] hover:scale-[1.02]'}`}
                                >
                                    {gameStatus === 'rolling' ? 'Игра идет...' : 'СДЕЛАТЬ СТАВКУ'}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}