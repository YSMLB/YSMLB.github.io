"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Mock data
const games = [
    { id: 1, title: "Lucky Jackpot", provider: "NetEnt", rating: 4.8, tags: ["HOT"], img: "https://play-lh.googleusercontent.com/MDzMTxMDjW9Ms9g7-fw65atLgrfRkjxD_-slhFaIaoVY05n8u1y3ALrvvIoKnDiF2Q=w7680-h4320", category: "Слоты" },
    { id: 2, title: "Royal Roulette", provider: "Evolution Gaming", rating: 4.9, tags: ["NEW"], img: "https://avatars.mds.yandex.net/get-mpic/4557391/2a000001942b9fe6937f722b5775cbf1e3ba/9hq", category: "Настольные" },
    { id: 3, title: "Poker Master", provider: "Pragmatic Play", rating: 4.7, tags: [], img: "https://avatars.mds.yandex.net/i?id=5c04d7aefc9ae7fa2be5b6c4c5f595d8c6f2d23b-10701951-images-thumbs&n=13", category: "Настольные" },
    { id: 4, title: " DiceParadise", provider: "Play'n GO", rating: 4.6, tags: ["HOT"], img: "https://app-s.ru/_nw/148/93278995.jpg", category: "Настольные" },
    { id: 5, title: "Neon Chips", provider: "Microgaming", rating: 4.5, tags: [], img: "https://static.vecteezy.com/system/resources/previews/005/525/213/non_2x/neon-casino-playing-cards-with-poker-chips-and-hologram-of-digital-rings-in-dark-empty-scene-vector.jpg", category: "Новинки" },
    { id: 6, title: "Blackjack Pro", provider: "Red Tiger", rating: 4.8, tags: ["NEW"], img: "https://avatars.mds.yandex.net/i?id=8cb151a4764ea4deff3b73a78c21354ef773ed10-5219773-images-thumbs&n=13", category: "Живые" },
    { id: 7, title: "Fortune Slots", provider: "NetEnt", rating: 4.7, tags: [], img: "https://avatars.mds.yandex.net/i?id=47ef78b8a09fc611be188be10706df46_l-3816297-images-thumbs&n=13", category: "Слоты" },
    { id: 8, title: "Golden Wheel", provider: "Evolution Gaming", rating: 4.9, tags: ["HOT"], img: "https://www.wildsbet.com/images/games/golden-hero/golden-wheel.webp", category: "Живые" }
];

const categories = ["Все игры", "Слоты", "Живые", "Настольные", "Новинки"];
const slotSymbolsNormal = ["🍒", "🍋", "🍉", "🍇", "⭐", "💎", "7️⃣", "BAR"];
const slotSymbolsEgypt = ["👑", "🏺", "🔱", "🪙", "🦅", "🦁", "💎", "📜"];
const cardDeck = ["🂡", "🂮", "🂭", "🂫", "🂪", "🂩", "🂨", "🂧", "🃁", "🃎", "🃍", "🃋", "🃊", "🃉"];
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const bonuses = [
    { id: 1, title: "Приветственный бонус", desc: "+200% к первому депозиту до 100,000₽", color: "from-[#2a1a08] to-[#1a1005]", iconColor: "text-orange-500", bgIcon: "bg-orange-500/10", details: "Вейджер: x35. Минимальный депозит для активации: 1,000 ₽. Время на отыгрыш бонуса: 72 часа с момента пополнения. Максимальная ставка при активном бонусе: 500 ₽." },
    { id: 2, title: "Ежедневный кэшбэк", desc: "Возвращаем до 15% каждый день", color: "from-[#081a2a] to-[#05101a]", iconColor: "text-blue-500", bgIcon: "bg-blue-500/10", details: "Кэшбэк начисляется автоматически каждый день в 00:00 (МСК) от суммы чистого проигрыша. Вейджер на кэшбэк: x3. Процент зависит от вашего VIP-уровня." },
    { id: 3, title: "Еженедельный турнир", desc: "Призовой фонд 1,000,000₽", color: "from-[#1a082a] to-[#10051a]", iconColor: "text-purple-500", bgIcon: "bg-purple-500/10", details: "Играй в слоты от провайдера Pragmatic Play. За каждые выигранные 100 ₽ начисляется 1 турнирное очко. Топ-50 игроков разделят призовой фонд в конце недели. Без вейджера на выигрыш!" },
    { id: 4, title: "Фриспины", desc: "150 бесплатных вращений для новых игроков", color: "from-[#082a1a] to-[#051a10]", iconColor: "text-emerald-500", bgIcon: "bg-emerald-500/10", details: "Выдаются частями по 30 фриспинов в день в течение 5 дней на слот 'Lucky Jackpot'. Вейджер на выигрыш с фриспинов: x30. Максимальный вывод: 15,000 ₽." },
];

// Icons
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;

export default function MegaWin() {
    const [activeFilter, setActiveFilter] = useState("Все игры");

    // Auth & Accounts
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [phone, setPhone] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [smsCode, setSmsCode] = useState("");
    const [demoBalance, setDemoBalance] = useState(0);
    const [realBalance, setRealBalance] = useState(0);
    const [activeBalanceType, setActiveBalanceType] = useState('demo');

    const [stats, setStats] = useState({ wagered: 0, won: 0 });
    const [history, setHistory] = useState<any[]>([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Modals
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState<number | "">("");
    const [selectedBonus, setSelectedBonus] = useState<any>(null);
    const [isVipModalOpen, setIsVipModalOpen] = useState(false);

    // Game Engine Core
    const [activeGame, setActiveGame] = useState<any>(null);
    const [gameStatus, setGameStatus] = useState('idle');
    const [gameResultInfo, setGameResultInfo] = useState('');
    const [betAmount, setBetAmount] = useState<number | "">(100);

    // Slots state
    const generateGrid = () => Array(5).fill(0).map(() => Array(3).fill(0).map(() => slotSymbolsNormal[Math.floor(Math.random() * slotSymbolsNormal.length)]));
    const [reelsGrid, setReelsGrid] = useState(() => generateGrid());
    const [showEpicWin, setShowEpicWin] = useState(false);

    // Roulette state
    const [rouletteBetOption, setRouletteBetOption] = useState('red');
    const [wheelRotation, setWheelRotation] = useState(0);
    const [winningColor, setWinningColor] = useState('');

    // Blackjack state
    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [dealerHand, setDealerHand] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);

    // Dice state
    const [diceResult, setDiceResult] = useState<string[]>(["⚀", "⚀"]);
    const [diceBetType, setDiceBetType] = useState('over');

    const rollIntervalRef = useRef<any>(null);
    const filteredGames = activeFilter === "Все игры" ? games : games.filter(game => game.category === activeFilter);
    const currentBalance = activeBalanceType === 'real' ? realBalance : demoBalance;

    const handlePhoneChange = (e: any) => {
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

    const handlePlayGame = (game: any) => {
        if (!isLoggedIn) { setIsAuthOpen(true); return; }
        setActiveGame(game);
        setGameStatus('idle');
        setGameResultInfo('');
        setShowEpicWin(false);

        if (game.id === 1 || game.id === 7) {
            const symbols = game.id === 7 ? slotSymbolsEgypt : slotSymbolsNormal;
            setReelsGrid(Array(5).fill(0).map(() => Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)])));
        } else if (game.id === 2 || game.id === 8) {
            setWheelRotation(0);
            setWinningColor('');
        } else if (game.id === 3 || game.id === 6) {
            setPlayerHand([]);
            setDealerHand([]);
            setPlayerScore(0);
            setDealerScore(0);
        } else {
            setDiceResult(["⚀", "⚀"]);
        }
    };

    const startAction = () => {
        const bet = Number(betAmount);
        if (bet <= 0 || currentBalance < bet) {
            setGameResultInfo('Недостаточно средств!');
            return;
        }

        if (activeBalanceType === 'real') setRealBalance(prev => prev - bet);
        else setDemoBalance(prev => prev - bet);
        setStats(prev => ({ ...prev, wagered: prev.wagered + bet }));

        if (activeGame.id === 1 || activeGame.id === 7) runSlotsEngine(bet);
        else if (activeGame.id === 2 || activeGame.id === 8) runRouletteEngine(bet);
        else if (activeGame.id === 3 || activeGame.id === 6) runBlackjackEngine(bet);
        else runDiceEngine(bet);
    };

    const runSlotsEngine = (bet: number) => {
        setGameStatus('rolling');
        setShowEpicWin(false);

        const symbols = activeGame.id === 7 ? slotSymbolsEgypt : slotSymbolsNormal;
        rollIntervalRef.current = setInterval(() => {
            setReelsGrid(Array(5).fill(0).map(() => Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)])));
        }, 100);

        setTimeout(() => {
            clearInterval(rollIntervalRef.current);
            const luck = Math.random();
            let finalGrid = Array(5).fill(0).map(() => Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)]));
            let isWin = luck > 0.65;
            let winAmount = 0;

            if (isWin) {
                const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                for (let i = 0; i < 5; i++) finalGrid[i][1] = winSymbol;
                const mult = (Math.random() * 10 + 2).toFixed(1);
                winAmount = Math.floor(bet * Number(mult));
                addFunds(winAmount);
                setGameStatus('win');
                setShowEpicWin(true);

                setTimeout(() => setShowEpicWin(false), 2500);

                setGameResultInfo(`ВЫИГРЫШ: +${winAmount} ₽ (x${mult})`);
            } else {
                setGameStatus('loss');
                setGameResultInfo('Ставка не сыграла');
            }
            setReelsGrid(finalGrid);
            saveToHistory(isWin, winAmount, bet, activeGame.title);
        }, 1500);
    };

    const runRouletteEngine = (bet: number) => {
        setGameStatus('rolling');
        const targetRotation = wheelRotation + 1440 + Math.floor(Math.random() * 360);
        setWheelRotation(targetRotation);

        setTimeout(() => {
            const sectorRand = Math.random();
            let resultColor = 'black';
            if (sectorRand < 0.48) resultColor = 'red';
            else if (sectorRand < 0.96) resultColor = 'black';
            else resultColor = 'zero';

            setWinningColor(resultColor);
            let isWin = rouletteBetOption === resultColor;
            let winAmount = 0;

            if (isWin) {
                const mult = resultColor === 'zero' ? 35 : 2;
                winAmount = bet * mult;
                addFunds(winAmount);
                setGameStatus('win');
                setGameResultInfo(`ПОБЕДА! Выпало: ${resultColor.toUpperCase()}. +${winAmount} ₽`);
            } else {
                setGameStatus('loss');
                setGameResultInfo(`ПРОИГРЫШ. Выпало: ${resultColor.toUpperCase()}`);
            }
            saveToHistory(isWin, winAmount, bet, activeGame.title);
        }, 2000);
    };

    const runBlackjackEngine = (bet: number) => {
        setGameStatus('bj_player_turn');
        setGameResultInfo('Твой ход! Бери карты или останавливайся.');
        const p1 = Math.floor(Math.random() * 10) + 2;
        const p2 = Math.floor(Math.random() * 10) + 2;
        const d1 = Math.floor(Math.random() * 10) + 2;

        setPlayerHand([cardDeck[Math.floor(Math.random() * cardDeck.length)], cardDeck[Math.floor(Math.random() * cardDeck.length)]]);
        setDealerHand([cardDeck[Math.floor(Math.random() * cardDeck.length)]]);
        setPlayerScore(p1 + p2);
        setDealerScore(d1);
    };

    const blackjackHit = () => {
        const cardVal = Math.floor(Math.random() * 10) + 2;
        const nextScore = playerScore + cardVal;
        setPlayerHand(prev => [...prev, cardDeck[Math.floor(Math.random() * cardDeck.length)]]);
        setPlayerScore(nextScore);

        if (nextScore > 21) {
            setGameStatus('loss');
            setGameResultInfo(`ПЕРЕБОР! Твой счет: ${nextScore}. Ты проиграл.`);
            saveToHistory(false, 0, Number(betAmount), activeGame.title);
        }
    };

    const blackjackStand = () => {
        setGameStatus('rolling');
        setGameResultInfo('Дилер добирает карты...');
        let currentDealer = dealerScore;
        const dCards = [...dealerHand];

        const interval = setInterval(() => {
            if (currentDealer < 17) {
                const cardVal = Math.floor(Math.random() * 10) + 2;
                currentDealer += cardVal;
                dCards.push(cardDeck[Math.floor(Math.random() * cardDeck.length)]);
                setDealerHand([...dCards]);
                setDealerScore(currentDealer);
            } else {
                clearInterval(interval);
                let isWin = false;
                let winAmount = 0;
                const bet = Number(betAmount);

                if (currentDealer > 21 || playerScore > currentDealer) {
                    isWin = true;
                    winAmount = bet * 2;
                    addFunds(winAmount);
                    setGameStatus('win');
                    setGameResultInfo(`ПОБЕДА! У дилера: ${currentDealer}, у тебя: ${playerScore}. +${winAmount} ₽`);
                } else if (playerScore === currentDealer) {
                    addFunds(bet);
                    setGameStatus('idle');
                    setGameResultInfo(`НИЧЬЯ. Возврат ставки.`);
                } else {
                    setGameStatus('loss');
                    setGameResultInfo(`ПРОИГРЫШ. У дилера: ${currentDealer}, у тебя: ${playerScore}.`);
                }
                saveToHistory(isWin, winAmount, bet, activeGame.title);
            }
        }, 700);
    };

    const runDiceEngine = (bet: number) => {
        setGameStatus('rolling');
        rollIntervalRef.current = setInterval(() => {
            setDiceResult([diceFaces[Math.floor(Math.random() * 6)], diceFaces[Math.floor(Math.random() * 6)]]);
        }, 80);

        setTimeout(() => {
            clearInterval(rollIntervalRef.current);
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const sum = d1 + d2;
            setDiceResult([diceFaces[d1 - 1], diceFaces[d2 - 1]]);

            let isWin = false;
            if (diceBetType === 'over' && sum > 7) isWin = true;
            else if (diceBetType === 'under' && sum < 7) isWin = true;
            else if (diceBetType === 'seven' && sum === 7) isWin = true;

            let winAmount = 0;
            if (isWin) {
                const mult = diceBetType === 'seven' ? 4 : 2;
                winAmount = bet * mult;
                addFunds(winAmount);
                setGameStatus('win');
                setGameResultInfo(`ПОБЕДА! Сумма костей: ${sum}. +${winAmount} ₽`);
            } else {
                setGameStatus('loss');
                setGameResultInfo(`ПРОИГРЫШ. Сумма костей: ${sum}.`);
            }
            saveToHistory(isWin, winAmount, bet, activeGame.title);
        }, 1200);
    };

    const addFunds = (amt: number) => {
        if (activeBalanceType === 'real') setRealBalance(prev => prev + amt);
        else setDemoBalance(prev => prev + amt);
        setStats(prev => ({ ...prev, won: prev.won + amt }));
    };

    const saveToHistory = (isWin: boolean, amt: number, bet: number, title: string) => {
        setHistory(prev => [{
            id: Date.now(), type: isWin ? 'win' : 'loss', amount: isWin ? amt : -bet, bet: bet,
            game: `${title} (${activeBalanceType === 'real' ? 'Реал' : 'Демо'})`, time: new Date().toLocaleTimeString()
        }, ...prev]);
    };

    const handleNavClick = (filter: string) => {
        setActiveFilter(filter);
        document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const setMaxBet = () => setBetAmount(currentBalance > 0 ? currentBalance : 0);
    const setMinBet = () => setBetAmount(10);

    return (
        <div className="bg-[#0b0e14] min-h-screen text-white font-sans selection:bg-[#ff9900] selection:text-white pb-20">

            <header className="fixed top-0 left-0 w-full z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12 lg:gap-16">
                        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
                            <div className="bg-[#ff9900] text-[#0b0e14] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-[14px]">
                                <CrownIcon />
                            </div>
                            <div className="flex flex-col justify-center mt-1">
                                <h1 className="text-xl md:text-[26px] font-black leading-none tracking-tight text-white mb-0.5">MegaWin</h1>
                                <span className="text-[8px] md:text-[10px] text-[#ff9900] font-bold tracking-[0.15em] uppercase leading-none">Casino Online</span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-gray-400">
                            <button onClick={() => handleNavClick("Все игры")} className={`hover:text-white transition-colors ${activeFilter === "Все игры" ? "text-white" : ""}`}>Казино</button>
                            <button onClick={() => handleNavClick("Слоты")} className={`hover:text-white transition-colors ${activeFilter === "Слоты" ? "text-white" : ""}`}>Слоты</button>
                            <button onClick={() => handleNavClick("Живые")} className={`hover:text-white transition-colors ${activeFilter === "Живые" ? "text-white" : ""}`}>Живое Казино</button>
                            <button onClick={() => handleNavClick("Настольные")} className={`hover:text-white transition-colors ${activeFilter === "Настольные" ? "text-white" : ""}`}>Турниры</button>
                            <button onClick={() => document.getElementById('promo-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Промо</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => setIsDepositOpen(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-white/10 transition-colors group">
                                    <WalletIcon />
                                    <span className="font-bold text-xs md:text-sm text-[#ff9900] group-hover:text-white transition-colors">
                                        {(activeBalanceType === 'real' ? realBalance : demoBalance).toLocaleString('ru-RU')} ₽
                                        <span className="hidden sm:inline text-gray-500 text-xs ml-1 uppercase">({activeBalanceType})</span>
                                    </span>
                                </button>
                                <button onClick={() => setIsProfileOpen(true)} className="flex items-center justify-center bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] w-9 h-9 md:w-auto md:px-5 md:py-2.5 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                                    <UserIcon /> <span className="hidden md:inline ml-2">Профиль</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-xs md:text-sm transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                                <UserIcon /> Войти
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-24 md:pt-28 max-w-[1400px] mx-auto px-4 md:px-6">

                <section className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24 mt-4 md:mt-8">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#ff9900]/10 text-[#ff9900] px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 md:mb-8 border border-[#ff9900]/20">
                            <span className="animate-pulse">✦</span> Новый игрок? Получи бонус!
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-4 md:mb-6 tracking-tight">
                            Выигрывай по-<br className="hidden lg:block" />крупному <br className="hidden lg:block" />в <span className="text-[#ff9900]">MegaWin!</span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-lg mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Более 5000+ игр, мгновенные выплаты и щедрые бонусы. Начни играть уже сегодня!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 md:mb-12">
                            <button onClick={() => { !isLoggedIn ? setIsAuthOpen(true) : setIsDepositOpen(true) }} className="w-full sm:w-auto bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                {isLoggedIn ? "Пополнить баланс" : "Получить Бонус"}
                            </button>
                            <button onClick={() => handlePlayGame(games[Math.floor(Math.random() * games.length)])} className="w-full sm:w-auto bg-white hover:bg-gray-200 text-[#0b0e14] px-8 py-4 rounded-xl font-bold transition-colors">
                                Мне повезет!
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-[500px] bg-[#12151f] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <div className="border border-[#ff9900]/50 rounded-2xl p-6 md:p-8 text-center mb-6 bg-[#0b0e14]/50 backdrop-blur-sm">
                                <p className="text-xs md:text-sm text-gray-400 font-medium mb-2">Приветственный Бонус</p>
                                <h3 className="text-4xl md:text-5xl font-black text-[#ff9900] mb-2">+200%</h3>
                                <p className="text-gray-300 font-medium text-sm md:text-base">до 100,000₽</p>
                            </div>
                            {!isLoggedIn && (
                                <button onClick={() => setIsAuthOpen(true)} className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] py-4 rounded-xl font-bold transition-colors">
                                    Зарегистрироваться
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <section id="games-section" className="mb-16 md:mb-24 scroll-mt-24 md:scroll-mt-28">
                    <div className="mb-6 md:mb-10 text-center sm:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Популярные <span className="text-[#ff9900]">Игры</span></h2>
                        <p className="text-gray-400 text-xs md:text-sm">Выбери свою удачу из тысяч игр</p>
                    </div>

                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 mb-6 md:mb-8 scrollbar-hide">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveFilter(cat)} className={`whitespace-nowrap px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeFilter === cat ? "bg-[#ff9900] text-[#0b0e14] shadow-[0_0_15px_rgba(255,153,0,0.3)]" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        <AnimatePresence>
                            {filteredGames.map(game => (
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} key={game.id} className="group bg-[#12151f] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 cursor-pointer flex flex-col" onClick={() => handlePlayGame(game)}>
                                    <div className="relative h-32 md:h-48 w-full overflow-hidden shrink-0">
                                        <img src={game.img} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 text-[9px] md:text-[10px] font-bold">
                                            <span className="text-[#ff9900]"><StarIcon /></span> {game.rating}
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm hidden md:flex">
                                            <button className="bg-[#ff9900] text-[#0b0e14] px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                                <PlayIcon /> Играть
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-sm md:text-lg leading-tight mb-1 truncate">{game.title}</h3>
                                        <p className="text-[10px] md:text-xs text-gray-500 truncate">{game.provider}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </section>

                <section id="promo-section" className="mb-16 md:mb-24 scroll-mt-24 md:scroll-mt-28">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Щедрые <span className="text-[#ff9900]">Бонусы</span></h2>
                        <p className="text-gray-400 text-xs md:text-sm">Больше бонусов, больше выигрышей!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {bonuses.map(bonus => (
                            <div key={bonus.id} className="bg-[#12151f] p-6 md:p-8 rounded-[20px] md:rounded-[24px] border border-white/5 flex flex-col justify-between min-h-[220px] md:min-h-[260px] bg-gradient-to-b from-[#12151f] to-transparent">
                                <div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 md:mb-6 ${bonus.bgIcon} ${bonus.iconColor}`}><BoxIcon /></div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{bonus.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-400">{bonus.desc}</p>
                                </div>
                                <button onClick={() => setSelectedBonus(bonus)} className="w-full bg-white text-[#0b0e14] hover:bg-gray-200 py-3 mt-6 rounded-xl font-bold text-xs md:text-sm transition-colors">Подробнее</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-gradient-to-r from-[#2d1b3d] to-[#4a2e1b] rounded-[24px] md:rounded-[40px] p-6 md:p-10 lg:p-16 border border-white/5 mb-16 md:mb-24 relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16 relative z-10">
                        <div className="flex-1 text-center lg:text-left w-full">
                            <div className="inline-flex items-center bg-black/30 text-[#ff9900] border border-[#ff9900]/30 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Специальное предложение</div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 leading-tight">VIP-программа<br className="hidden md:block" />лояльности</h2>
                            <p className="text-gray-300 mb-6 md:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed text-xs md:text-sm">Эксклюзивные бонусы, персональный менеджер и приоритетный вывод средств для наших VIP-игроков.</p>
                            <button onClick={() => setIsVipModalOpen(true)} className="w-full sm:w-auto bg-[#ff9900] hover:bg-[#e68a00] text-[#0b0e14] px-8 py-3.5 rounded-xl font-bold transition-colors">Узнать больше</button>
                        </div>
                        <div className="flex-1 w-full bg-[#161318]/80 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/5 shadow-inner">
                            <div className="flex flex-col gap-2">
                                {[{ level: "Уровень 1 - Бронза", val: "+5% кэшбэк" }, { level: "Уровень 2 - Серебро", val: "+10% кэшбэк" }, { level: "Уровень 3 - Золото", val: "+15% кэшбэк" }].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 md:py-4 px-3 md:px-4 hover:bg-white/5 rounded-xl transition-colors">
                                        <span className="text-gray-300 text-xs md:text-sm font-medium">{item.level}</span><span className="text-[#ff9900] font-bold text-xs md:text-sm">{item.val}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-3 md:py-4 px-3 md:px-4 bg-white/10 rounded-xl mt-2">
                                    <span className="text-white font-bold text-xs md:text-sm">Уровень 4 - Платина</span><span className="text-[#ff9900] font-black text-xs md:text-sm">+20% кэшбэк</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-[#080a0e] pt-12 md:pt-16 pb-6 md:pb-8 mt-auto">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
                        <div>
                            <Link href="/" className="flex items-center gap-3 text-[#ff9900] mb-4 md:mb-6 hover:opacity-80 transition-opacity">
                                <div className="bg-[#ff9900] text-[#0b0e14] w-10 h-10 flex items-center justify-center rounded-[10px]">
                                    <CrownIcon />
                                </div>
                                <div className="flex flex-col justify-center mt-1">
                                    <span className="text-xl font-black leading-none tracking-tight text-white mb-0.5">MegaWin</span>
                                    <span className="text-[9px] text-[#ff9900] font-bold tracking-[0.15em] uppercase leading-none">Casino Online</span>
                                </div>
                            </Link>
                            <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">
                                Лучшее онлайн-казино с мгновенными выплатами и честной игрой.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Быстрые ссылки</h4>
                            <ul className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">О нас</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Правила</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Ответственная игра</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Игры</h4>
                            <ul className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Слоты</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Живое казино</a></li>
                                <li><a href="#" className="hover:text-[#ff9900] transition-colors">Турниры</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Контакты</h4>
                            <ul className="flex flex-col gap-4 text-xs md:text-sm text-gray-400 mb-6">
                                <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#ff9900" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    support@megawin.com
                                </li>
                            </ul>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[#ff9900] font-bold text-xs md:text-sm">Поддержка 24/7</p>
                                    <p className="text-[10px] md:text-xs text-gray-500">Мы всегда на связи</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-6 md:mt-8 pt-6 flex flex-col-reverse md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-600 gap-4">
                        <p>© 2026 MegaWin. Все права защищены.</p>
                        <div className="flex gap-4 md:gap-6">
                            <a href="#" className="hover:text-gray-400 transition-colors">Политика конфиденциальности</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Условия использования</a>
                        </div>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {selectedBonus && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#12151f] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setSelectedBonus(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 p-2"><CloseIcon /></button>
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 ${selectedBonus.bgIcon} ${selectedBonus.iconColor}`}><BoxIcon /></div>
                            <h2 className="text-xl md:text-2xl font-black mb-2">{selectedBonus.title}</h2>
                            <p className="text-[#ff9900] font-bold mb-4 md:mb-6 text-sm md:text-base">{selectedBonus.desc}</p>
                            <div className="bg-[#0b0e14] rounded-xl p-4 md:p-5 text-xs md:text-sm text-gray-400 leading-relaxed">{selectedBonus.details}</div>
                            <button onClick={() => { setSelectedBonus(null); !isLoggedIn ? setIsAuthOpen(true) : setIsDepositOpen(true); }} className="w-full bg-[#ff9900] text-[#0b0e14] px-6 py-3 md:py-4 rounded-xl font-bold uppercase mt-6 text-sm">Активировать</button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVipModalOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#12151f] border border-[#ff9900]/30 rounded-2xl md:rounded-3xl w-full max-w-2xl p-6 md:p-8 relative shadow-[0_0_50px_rgba(255,153,0,0.1)] max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setIsVipModalOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 p-2"><CloseIcon /></button>
                            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 md:mb-8 pr-8">Статусы <span className="text-[#ff9900]">MegaWin</span></h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-[#0b0e14] p-4 md:p-5 rounded-xl text-sm md:text-base"><span>🥉 Бронза</span><p className="text-xs text-gray-500 mt-2">Кэшбэк 5%</p></div>
                                <div className="bg-[#0b0e14] p-4 md:p-5 rounded-xl text-sm md:text-base"><span>🥈 Серебро</span><p className="text-xs text-gray-500 mt-2">Кэшбэк 10%</p></div>
                                <div className="bg-[#0b0e14] p-4 md:p-5 rounded-xl text-sm md:text-base"><span>🥇 Золото</span><p className="text-xs text-gray-500 mt-2">Кэшбэк 15% + Менеджер</p></div>
                                <div className="bg-gradient-to-br from-[#0b0e14] to-[#2a1a08] border border-[#ff9900] p-4 md:p-5 rounded-xl text-sm md:text-base"><span>💎 Платина</span><p className="text-xs text-[#ff9900] mt-2">Кэшбэк 20% + Безлимит</p></div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAuthOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#12151f] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 p-2"><CloseIcon /></button>
                            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 md:mb-8">Вход</h2>
                            <div className="flex flex-col gap-4">
                                {authStep === 1 ? (
                                    <>
                                        <input type="tel" value={inputPhone} onChange={handlePhoneChange} placeholder="+7 (999) 000-00-00" className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm md:text-base text-white focus:outline-none focus:border-[#ff9900]" />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] text-[#0b0e14] px-6 py-3 md:py-4 rounded-xl font-bold uppercase mt-2 md:mt-4 text-sm">Получить код</button>
                                    </>
                                ) : (
                                    <>
                                        <input type="text" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} placeholder="0000" maxLength={4} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 md:py-4 text-center text-xl md:text-2xl tracking-[1em] font-bold text-white focus:outline-none" />
                                        <button onClick={handleAuthSubmit} className="w-full bg-[#ff9900] text-[#0b0e14] px-6 py-3 md:py-4 rounded-xl font-bold uppercase mt-2 md:mt-4 text-sm">Подтвердить</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isDepositOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#12151f] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 p-2"><CloseIcon /></button>
                            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 text-[#ff9900]">Касса</h2>
                            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                                {[1000, 5000, 10000].map(amt => <button key={amt} onClick={() => setDepositAmount(amt)} className={`py-2 md:py-3 rounded-lg border font-bold text-xs md:text-sm ${depositAmount === amt ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-[#0b0e14] text-white border-white/10'}`}>{amt} ₽</button>)}
                            </div>
                            <input type="number" placeholder="Другая сумма" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value as any)} className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-4 py-3 md:py-4 text-white text-center font-bold text-base md:text-lg mb-6 focus:border-[#ff9900] focus:outline-none" />
                            <button onClick={handleDeposit} disabled={!depositAmount} className="w-full bg-white text-[#0b0e14] py-3 md:py-4 rounded-xl font-bold uppercase disabled:opacity-50 text-sm">Оплатить</button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isProfileOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-end">
                        <div className="bg-[#12151f] border-l border-white/10 w-full max-w-md h-full flex flex-col p-4 md:p-6 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6"><h2 className="text-xl md:text-2xl font-black uppercase">Профиль</h2><button onClick={() => setIsProfileOpen(false)} className="text-gray-400 p-2"><CloseIcon /></button></div>
                            <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center gap-4 mb-6"><div className="w-12 h-12 md:w-14 md:h-14 bg-[#ff9900] rounded-full flex items-center justify-center text-[#0b0e14] shrink-0"><UserIcon /></div><div><p className="font-bold text-base md:text-lg">{phone}</p></div></div>
                            <div className="bg-[#0b0e14] rounded-xl md:rounded-2xl p-4 md:p-5 mb-6">
                                <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Балансы</h3>
                                <button onClick={() => setActiveBalanceType('real')} className={`w-full flex justify-between p-3 md:p-4 rounded-xl border mb-2 md:mb-3 text-sm md:text-base ${activeBalanceType === 'real' ? 'border-[#ff9900] bg-[#ff9900]/10' : 'border-white/10'}`}><span>Реальный</span><span className="text-[#ff9900] font-bold">{realBalance} ₽</span></button>
                                <button onClick={() => setActiveBalanceType('demo')} className={`w-full flex justify-between p-3 md:p-4 rounded-xl border text-sm md:text-base ${activeBalanceType === 'demo' ? 'border-white bg-white/10' : 'border-white/10'}`}><span>Демо</span><span className="font-bold">{demoBalance} ₽</span></button>
                            </div>
                            <div className="flex-1 overflow-y-auto"><h3 className="font-bold mb-2 md:mb-3 text-sm md:text-base">История</h3>
                                {history.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">История пуста</p> : history.map(h => <div key={h.id} className="bg-[#0b0e14] p-3 rounded-xl mb-2 flex justify-between text-xs md:text-sm"><div><p className="truncate max-w-[150px] md:max-w-[200px]">{h.game}</p><span className="text-[10px] md:text-xs text-gray-500">{h.time}</span></div><span className={h.amount > 0 ? 'text-green-500' : 'text-red-500'}>{h.amount}₽</span></div>)}
                            </div>
                            <button onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }} className="bg-red-500/10 text-red-500 py-3 md:py-4 rounded-xl font-bold uppercase w-full mt-4 md:mt-6 text-sm">Выйти</button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {activeGame && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[110] flex flex-col">

                        <div className="h-14 md:h-16 bg-[#0b0e14] border-b border-white/10 flex justify-between items-center px-3 md:px-6 shrink-0 z-50">
                            <div className="flex items-center gap-2 md:gap-4">
                                <button onClick={() => setActiveGame(null)} className="text-gray-400 hover:text-white p-2"><CloseIcon /></button>
                                <h3 className="font-bold text-white text-sm md:text-base truncate max-w-[120px] sm:max-w-none">{activeGame.title}</h3>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 bg-black rounded-lg border border-white/10 p-1">
                                <button onClick={() => setActiveBalanceType('real')} className={`px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold transition-colors ${activeBalanceType === 'real' ? 'bg-[#ff9900] text-black' : 'text-gray-500 hover:text-white'}`}>Реал: {realBalance}₽</button>
                                <button onClick={() => setActiveBalanceType('demo')} className={`px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold transition-colors ${activeBalanceType === 'demo' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Демо: {demoBalance}₽</button>
                            </div>
                        </div>

                        <div className="flex-1 relative flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(11, 14, 20, 0.85), rgba(11, 14, 20, 0.95)), url(${activeGame.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                            <div className="w-full max-w-4xl flex flex-col items-center justify-center h-full max-h-full">

                                {(activeGame.id === 1 || activeGame.id === 7) && (
                                    <div className="w-full flex flex-col items-center">
                                        {activeGame.id === 1 && (
                                            <div className="flex flex-col items-center mb-2 md:mb-4 w-full">
                                                <div className="bg-red-800/90 border-2 border-yellow-400 rounded-full px-4 md:px-8 py-1 shadow-[0_0_20px_rgba(220,38,38,0.6)]"><span className="text-yellow-400 font-black text-lg md:text-3xl uppercase tracking-widest drop-shadow-md whitespace-nowrap">GRAND 8,329,565</span></div>
                                                <div className="flex gap-1 md:gap-2 mt-1"><div className="bg-purple-900/90 border border-yellow-400 rounded-full px-2 md:px-4 py-0.5 md:py-1 text-[9px] md:text-xs text-yellow-400 font-bold whitespace-nowrap">MAJOR 9,882,129</div><div className="bg-blue-900/90 border border-yellow-400 rounded-full px-2 md:px-4 py-0.5 md:py-1 text-[9px] md:text-xs text-yellow-400 font-bold whitespace-nowrap">MINOR 1,985,882</div></div>
                                            </div>
                                        )}
                                        <div className="relative bg-gradient-to-b from-red-950 to-black border-2 md:border-4 border-yellow-500 rounded-2xl md:rounded-[30px] p-2 md:p-4 shadow-2xl w-full">
                                            <div className="grid grid-cols-5 gap-1 md:gap-2 bg-black/60 p-2 md:p-3 rounded-xl md:rounded-2xl relative min-h-[160px] md:min-h-[220px] shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]">
                                                <AnimatePresence>
                                                    {showEpicWin && (
                                                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-xl md:rounded-2xl">
                                                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="bg-gradient-to-b from-yellow-300 to-yellow-600 border-2 md:border-4 border-white text-red-800 font-black text-3xl md:text-8xl px-6 md:px-12 py-2 md:py-3 rounded-[30px] md:rounded-[50px] shadow-[0_0_50px_rgba(255,215,0,1)] tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>WILD</motion.div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {reelsGrid.map((col, cIdx) => (
                                                    <div key={cIdx} className="flex flex-col gap-1 md:gap-2">
                                                        {col.map((symbol, rIdx) => (
                                                            <div key={rIdx} className="w-full aspect-square bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden border border-white/5">
                                                                <motion.span animate={gameStatus === 'rolling' ? { y: [40, -40], transition: { repeat: Infinity, duration: 0.1, ease: "linear" } } : { y: 0 }} className="text-2xl md:text-5xl absolute drop-shadow-md">{symbol}</motion.span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(activeGame.id === 2 || activeGame.id === 8) && (
                                    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
                                        <motion.div animate={{ rotate: wheelRotation }} transition={{ type: "spring", damping: 30, stiffness: 40 }} className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full border-4 md:border-8 border-amber-700 bg-gradient-to-tr from-green-900 to-green-950 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center relative">
                                            <div className="absolute inset-2 rounded-full border-2 md:border-4 border-dashed border-white/20" />
                                            <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full absolute top-2 md:top-4 z-20 shadow-md animate-bounce" />
                                            <div className="text-center font-black text-[10px] md:text-sm tracking-widest text-white/40 uppercase leading-tight">MEGA<br />ROULETTE</div>
                                            <div className="w-full h-0.5 md:h-1 bg-amber-800/40 absolute" /><div className="w-full h-0.5 md:h-1 bg-amber-800/40 absolute rotate-45" /><div className="w-full h-0.5 md:h-1 bg-amber-800/40 absolute rotate-90" /><div className="w-full h-0.5 md:h-1 bg-amber-800/40 absolute rotate-[135deg]" />
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-900 rounded-full border-2 md:border-4 border-amber-600 z-10 flex items-center justify-center shadow-lg"><span className="text-base md:text-lg font-bold text-[#ff9900]">★</span></div>
                                        </motion.div>
                                        <div className="bg-[#12151f] p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/10 flex gap-2 md:gap-4 w-full max-w-md justify-center">
                                            <button onClick={() => setRouletteBetOption('red')} disabled={gameStatus === 'rolling'} className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-wider text-[10px] md:text-sm transition-all border-2 ${rouletteBetOption === 'red' ? 'bg-red-600 border-white scale-105 shadow-lg' : 'bg-red-900/40 border-transparent text-red-400 hover:bg-red-800/50'}`}>Красное (x2)</button>
                                            <button onClick={() => setRouletteBetOption('black')} disabled={gameStatus === 'rolling'} className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-wider text-[10px] md:text-sm transition-all border-2 ${rouletteBetOption === 'black' ? 'bg-neutral-800 border-white scale-105 shadow-lg' : 'bg-neutral-900/40 border-transparent text-neutral-400 hover:bg-neutral-800/50'}`}>Черное (x2)</button>
                                            <button onClick={() => setRouletteBetOption('zero')} disabled={gameStatus === 'rolling'} className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-wider text-[10px] md:text-sm transition-all border-2 ${rouletteBetOption === 'zero' ? 'bg-green-600 border-white scale-105 shadow-lg' : 'bg-green-900/40 border-transparent text-green-400 hover:bg-green-800/50'}`}>Зеро (x35)</button>
                                        </div>
                                    </div>
                                )}

                                {(activeGame.id === 3 || activeGame.id === 6) && (
                                    <div className="w-full flex flex-col gap-4 md:gap-6 max-w-2xl bg-green-950/80 backdrop-blur-md p-4 md:p-8 rounded-2xl md:rounded-[32px] border-2 border-emerald-600/30 relative shadow-2xl">
                                        <div className="absolute inset-2 md:inset-4 border border-dashed border-emerald-500/20 rounded-xl md:rounded-[24px] pointer-events-none" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Рука Дилера ({dealerScore})</span>
                                            <div className="flex flex-wrap justify-center gap-1 sm:gap-3 min-h-[6rem] md:min-h-[6rem]">
                                                {dealerHand.map((card, i) => (<motion.div initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} key={i} className="w-12 h-20 md:w-16 md:h-24 bg-white rounded-md md:rounded-lg flex items-center justify-center text-3xl md:text-4xl text-black font-serif shadow-lg border border-gray-300">{card}</motion.div>))}
                                                {gameStatus === 'bj_player_turn' && (<div className="w-12 h-20 md:w-16 md:h-24 bg-gradient-to-b from-red-800 to-red-950 rounded-md md:rounded-lg border-2 border-white/50 shadow-lg flex items-center justify-center font-bold text-white/50 text-lg md:text-xl">♠</div>)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mt-2 md:mt-6">
                                            <div className="flex flex-wrap justify-center gap-1 sm:gap-3 min-h-[6rem] md:min-h-[6rem] mb-2">
                                                {playerHand.map((card, i) => (<motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} key={i} className="w-12 h-20 md:w-16 md:h-24 bg-white rounded-md md:rounded-lg flex items-center justify-center text-3xl md:text-4xl text-black font-serif shadow-lg border border-gray-300">{card}</motion.div>))}
                                            </div>
                                            <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-widest">Твоя Рука ({playerScore})</span>
                                        </div>
                                        {gameStatus === 'bj_player_turn' && (
                                            <div className="flex justify-center gap-2 md:gap-4 mt-2 md:mt-4 z-20">
                                                <button onClick={blackjackHit} className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl tracking-wider text-xs md:text-sm shadow-lg hover:scale-105 transition-transform">Ещё (Hit)</button>
                                                <button onClick={blackjackStand} className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl tracking-wider text-xs md:text-sm shadow-lg hover:scale-105 transition-transform">Хватит (Stand)</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(activeGame.id === 4 || activeGame.id === 5) && (
                                    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
                                        <div className="flex gap-4 md:gap-6 justify-center">
                                            {diceResult.map((face, i) => (
                                                <motion.div key={i + gameStatus} animate={gameStatus === 'rolling' ? { rotate: [0, 20, -20, 0], y: [0, -10, 10, 0] } : { rotate: 0, y: 0 }} transition={{ repeat: gameStatus === 'rolling' ? Infinity : 0, duration: 0.15 }} className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-b from-white to-gray-200 rounded-xl md:rounded-2xl border-b-4 md:border-b-8 border-gray-400 flex items-center justify-center text-6xl md:text-9xl text-neutral-900 shadow-2xl">
                                                    {face}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="bg-[#12151f] p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/10 flex gap-2 w-full max-w-md justify-center">
                                            <button onClick={() => setDiceBetType('under')} disabled={gameStatus === 'rolling'} className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[9px] md:text-xs uppercase border transition-colors ${diceBetType === 'under' ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5'}`}>Меньше 7 (x2)</button>
                                            <button onClick={() => setDiceBetType('seven')} disabled={gameStatus === 'rolling'} className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[9px] md:text-xs uppercase border transition-colors ${diceBetType === 'seven' ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5'}`}>Точно 7 (x4)</button>
                                            <button onClick={() => setDiceBetType('over')} disabled={gameStatus === 'rolling'} className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-[9px] md:text-xs uppercase border transition-colors ${diceBetType === 'over' ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5'}`}>Больше 7 (x2)</button>
                                        </div>
                                    </div>
                                )}

                                <div className="min-h-[3rem] md:h-16 flex items-center justify-center mt-4 md:mt-6 text-center w-full px-2">
                                    {gameStatus === 'win' && <span className="text-[#ff9900] text-lg md:text-3xl font-black uppercase drop-shadow-[0_0_15px_rgba(255,153,0,0.8)]">{gameResultInfo}</span>}
                                    {gameStatus === 'loss' && <span className="text-gray-400 text-xs md:text-lg font-bold uppercase">{gameResultInfo}</span>}
                                    {gameStatus === 'idle' && <span className="text-gray-500 font-medium text-[10px] md:text-sm tracking-widest uppercase">Готовы к игре</span>}
                                    {gameStatus === 'rolling' && <span className="text-yellow-500 font-medium text-[10px] md:text-sm tracking-widest uppercase animate-pulse">Генерация результатов...</span>}
                                </div>

                                {gameStatus !== 'bj_player_turn' && (
                                    <div className="bg-[#12151f]/95 backdrop-blur-md border border-white/10 rounded-xl md:rounded-3xl p-3 md:p-4 w-full flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 mt-2 md:mt-4">
                                        <div className="flex flex-col w-full md:w-auto gap-1.5 md:gap-2">
                                            <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">Ставка (₽)</span>
                                            <div className="flex gap-2">
                                                <button onClick={setMinBet} disabled={gameStatus === 'rolling'} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 md:px-4 py-2 md:py-0 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-gray-400 disabled:opacity-50">MIN</button>
                                                <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value as any)} disabled={gameStatus === 'rolling'} className="bg-[#0b0e14] border border-white/10 rounded-lg md:rounded-xl flex-1 md:w-28 text-center font-bold text-sm md:text-base text-white focus:border-[#ff9900] focus:outline-none min-w-0" />
                                                <button onClick={() => setBetAmount(500)} disabled={gameStatus === 'rolling'} className="hidden md:block bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-xl text-sm font-bold disabled:opacity-50">500</button>
                                                <button onClick={setMaxBet} disabled={gameStatus === 'rolling'} className="bg-[#ff9900]/20 hover:bg-[#ff9900]/40 text-[#ff9900] border border-[#ff9900]/30 px-3 md:px-4 py-2 md:py-0 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold disabled:opacity-50">MAX</button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={startAction}
                                            disabled={gameStatus === 'rolling'}
                                            className={`w-full md:w-64 py-3 md:py-5 rounded-lg md:rounded-xl font-black uppercase tracking-widest text-sm md:text-lg transition-all ${gameStatus === 'rolling' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-t from-[#e68a00] to-[#ff9900] text-[#0b0e14] shadow-[0_6px_0_#b36b00,0_10px_15px_rgba(255,153,0,0.4)] md:shadow-[0_10px_0_#b36b00,0_15px_20px_rgba(255,153,0,0.4)] hover:translate-y-1 active:translate-y-2'}`}
                                        >
                                            {gameStatus === 'rolling' ? 'ЗАПУСК...' : activeGame.category === 'Слоты' ? 'SPIN 🎰' : 'ИГРАТЬ 🎲'}
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}