// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- БАЗА ДАННЫХ ЕДЫ (РАСШИРЕННАЯ) ---
const menuItems = [
    // Бургеры
    { id: 1, name: "Смэш-Бургер", desc: "Двойная котлета из мраморной говядины, сыр чеддер, соус ПОЕШЬ.", price: 450, category: "Бургеры", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Сырный Монстр", desc: "Котлета, моцарелла фри, соус дорблю и халапеньо.", price: 480, category: "Бургеры", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "BBQ Бекон", desc: "Котлета BBQ, хрустящий бекон, карамелизированный лук.", price: 460, category: "Бургеры", img: "https://images.unsplash.com/photo-1594212202875-86ac519fe4b9?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Чикен Премиум", desc: "Куриное филе в панировке, айсберг, томаты, чесночный соус.", price: 390, category: "Бургеры", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=500&q=80" },
    // Пицца
    { id: 5, name: "Пицца Пепперони", desc: "Классическая пепперони с моцареллой и томатным соусом. 30 см.", price: 650, category: "Пицца", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Пицца Маргарита", desc: "Ничего лишнего: томаты, моцарелла, базилик. 30 см.", price: 500, category: "Пицца", img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Мясная сборная", desc: "Ветчина, бекон, пепперони, охотничьи колбаски. 30 см.", price: 720, category: "Пицца", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Четыре сыра", desc: "Моцарелла, чеддер, пармезан, дорблю. Сливочный соус. 30 см.", price: 680, category: "Пицца", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80" },
    // Азия
    { id: 9, name: "Ролл Филадельфия", desc: "Свежий лосось, сливочный сыр, огурец, рис, нори. 8 шт.", price: 550, category: "Азия", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80" },
    { id: 10, name: "Ролл Калифорния", desc: "Снежный краб, авокадо, масаго, японский майонез. 8 шт.", price: 490, category: "Азия", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "Том Ям", desc: "Острый тайский суп с креветками, кальмарами и грибами. Порция 400 мл.", price: 480, category: "Азия", img: "https://images.unsplash.com/photo-1548943487-a2e4d43b4859?auto=format&fit=crop&w=500&q=80" },
    { id: 12, name: "Удон с говядиной", desc: "Лапша удон, мраморная говядина, овощи вок, соус терияки.", price: 450, category: "Азия", img: "https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?auto=format&fit=crop&w=500&q=80" },
    // Снеки
    { id: 13, name: "Картофель Фри", desc: "Хрустящий картофель с морской солью. 150г.", price: 150, category: "Снеки", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80" },
    { id: 14, name: "Сырные палочки", desc: "Моцарелла в панировке, подается с ягодным соусом. 6 шт.", price: 220, category: "Снеки", img: "https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=500&q=80" },
    { id: 15, name: "Наггетсы", desc: "Куриные наггетсы из нежного филе. 9 шт.", price: 180, category: "Снеки", img: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80" },
    // Десерты
    { id: 16, name: "Чизкейк Нью-Йорк", desc: "Классический запеченный чизкейк из сливочного сыра.", price: 250, category: "Десерты", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" },
    { id: 17, name: "Шоколадный Фондан", desc: "Теплый кекс с жидким центром и шариком ванильного мороженого.", price: 280, category: "Десерты", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80" },
    // Напитки
    { id: 18, name: "Крафт Кола", desc: "Освежающий напиток со льдом, 0.5л", price: 120, category: "Напитки", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80" },
    { id: 19, name: "Лимонад Цитрус", desc: "Фирменный лимонад с апельсином и грейпфрутом, 0.5л", price: 180, category: "Напитки", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" },
    { id: 20, name: "Морс Клюквенный", desc: "Домашний морс из свежей клюквы, 0.5л", price: 100, category: "Напитки", img: "https://images.unsplash.com/photo-1595981267035-7b04d84b5fe6?auto=format&fit=crop&w=500&q=80" }
];

const categories = ["Все", "Бургеры", "Пицца", "Азия", "Снеки", "Десерты", "Напитки"];

// --- ИКОНКИ ---
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

export default function PoeshApp() {
    const [activeCategory, setActiveCategory] = useState("Все");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [address, setAddress] = useState("Оренбург, укажите улицу...");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [addingItem, setAddingItem] = useState(null);

    // ОПТИМИЗАЦИЯ: Мемоизация списка меню (пересчитывается только при смене категории)
    const filteredMenu = useMemo(() => {
        return activeCategory === "Все"
            ? menuItems
            : menuItems.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const addToCart = (item) => {
        // Триггер анимации +1
        setAddingItem(item.id);
        setTimeout(() => setAddingItem(null), 500);

        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + amount;
                return newQty > 0 ? { ...item, qty: newQty } : item;
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleCheckout = () => {
        setOrderPlaced(true);
        setTimeout(() => {
            setCart([]);
            setOrderPlaced(false);
            setIsCartOpen(false);
        }, 3000);
    };

    return (
        <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#ff5722] selection:text-white pb-20 overflow-x-hidden">

            {/* НАВИГАЦИЯ */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">

                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#ff5722]">
                            ПОЕШЬ
                        </h1>
                        {/* Кнопка адреса */}
                        <button
                            onClick={() => setIsMapOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-medium text-gray-300 transition-colors"
                        >
                            <MapPinIcon />
                            <span className="truncate max-w-[200px]">{address}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="hidden md:flex items-center gap-2 text-sm font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                        >
                            <UserIcon />
                            Войти
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 bg-[#ff5722] hover:bg-[#ff8a50] text-white px-4 py-2 rounded-full transition-colors shadow-lg shadow-[#ff5722]/20"
                        >
                            <CartIcon />
                            <span className="font-bold text-sm">{totalPrice > 0 ? `${totalPrice} ₽` : "Корзина"}</span>
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ГЕРОЙ БЛОК */}
            <section className="pt-28 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-[#ff5722] to-[#ff8a50] rounded-3xl h-[400px] flex items-center justify-between overflow-hidden relative shadow-2xl">

                    <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16">
                        <button onClick={() => setIsMapOpen(true)} className="md:hidden flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-white mb-6 w-max">
                            <MapPinIcon /> {address}
                        </button>
                        <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-4 text-black">
                            Быстрая доставка <br />в Оренбурге
                        </h2>
                        <p className="text-black/80 font-medium text-lg mb-8 max-w-md hidden md:block">
                            Горячие бургеры, свежая пицца и роллы. Привезем за 45 минут или отдадим заказ бесплатно.
                        </p>
                        <button
                            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        >
                            Смотреть меню
                        </button>
                    </div>

                    {/* ПОЛНОЦЕННАЯ КАРТИНКА ДЛЯ ПРАВОЙ ЧАСТИ */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff8a50] to-transparent z-10" style={{ width: '30%' }}></div>
                        <img
                            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
                            alt="Promo Food"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                </div>
            </section>

            {/* МЕНЮ */}
            <main id="menu" className="px-4 md:px-8 max-w-7xl mx-auto">

                {/* Фильтры */}
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar items-center border-b border-white/10 mb-8 sticky top-20 z-30 bg-[#0a0a0a]/90 backdrop-blur-md pt-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeCategory === cat
                                    ? "bg-white text-black"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Сетка товаров */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map(item => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                                key={item.id}
                                className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors flex flex-col group relative"
                            >
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img src={item.img} loading="lazy" alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white">
                                        {item.category}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{item.desc}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-black">{item.price} ₽</span>

                                        {/* Кнопка с анимацией */}
                                        <div className="relative">
                                            <motion.button
                                                whileTap={{ scale: 0.85 }}
                                                onClick={() => addToCart(item)}
                                                className="bg-white/10 hover:bg-[#ff5722] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <PlusIcon />
                                            </motion.button>

                                            {/* Анимация +1 */}
                                            <AnimatePresence>
                                                {addingItem === item.id && (
                                                    <motion.span
                                                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, y: -30, scale: 1.2 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#ff5722] font-black text-sm pointer-events-none"
                                                    >
                                                        +1
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* МОДАЛКА: КАРТА (АДРЕС) */}
            <AnimatePresence>
                {isMapOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <h3 className="text-xl font-bold">Куда доставить?</h3>
                                <button onClick={() => setIsMapOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                            </div>

                            {/* Фейковая карта через Яндекс iframe для Оренбурга */}
                            <div className="w-full h-64 bg-gray-800 relative">
                                <iframe src="https://yandex.ru/map-widget/v1/?ll=55.096955%2C51.768199&z=12&theme=dark" width="100%" height="100%" frameBorder="0" allowFullScreen={true}></iframe>
                                <div className="absolute inset-0 pointer-events-none border-b border-white/10 shadow-[inset_0_-20px_20px_rgba(17,17,17,1)]"></div>
                            </div>

                            <div className="p-6 bg-[#111]">
                                <label className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2 block">Введите улицу и дом</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Например: ул. Чкалова, 11"
                                        value={address === "Оренбург, укажите улицу..." ? "" : address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff5722] transition-colors"
                                    />
                                    <button onClick={() => setIsMapOpen(false)} className="bg-[#ff5722] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#ff8a50] transition-colors">
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* МОДАЛКА: АВТОРИЗАЦИЯ */}
            <AnimatePresence>
                {isAuthOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><CloseIcon /></button>
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Вход в систему</h2>
                            <p className="text-gray-400 text-sm mb-8">Чтобы копить баллы и отслеживать заказы.</p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2 block">Номер телефона</label>
                                    <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#ff5722] transition-colors" />
                                </div>
                                <button onClick={() => setIsAuthOpen(false)} className="w-full bg-[#ff5722] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#ff8a50] transition-colors mt-4">
                                    Получить код
                                </button>
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-6">Продолжая, вы соглашаетесь с политикой конфиденциальности.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* КОРЗИНА (Sidebar) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#111] border-l border-white/10 z-[100] flex flex-col shadow-2xl">

                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                                <h2 className="text-2xl font-black uppercase">Ваш заказ</h2>
                                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white transition-colors"><CloseIcon /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                                        <CartIcon />
                                        <p className="mt-4 font-medium text-lg">Корзина пуста</p>
                                        <p className="text-sm text-center mt-2">Добавьте что-нибудь вкусное из меню</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <motion.div layout key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                                                <p className="text-[#ff5722] font-bold text-sm mt-1">{item.price * item.qty} ₽</p>
                                            </div>
                                            <div className="flex items-center bg-black rounded-full overflow-hidden border border-white/10">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gray-300">-</button>
                                                <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-gray-300">+</button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-[#0a0a0a] border-t border-white/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-400 font-medium">Итого к оплате:</span>
                                        <span className="text-3xl font-black">{totalPrice} ₽</span>
                                    </div>
                                    <button onClick={handleCheckout} disabled={orderPlaced} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${orderPlaced ? "bg-green-500 text-white" : "bg-[#ff5722] hover:bg-[#ff8a50] text-white shadow-lg shadow-[#ff5722]/20"}`}>
                                        {orderPlaced ? "ЗАКАЗ ПРИНЯТ ✓" : "ОФОРМИТЬ ЗАКАЗ"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}