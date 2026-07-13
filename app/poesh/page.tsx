// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- БАЗА ДАННЫХ ЕДЫ ---
const menuItems = [
    { id: 1, name: "Смэш-Бургер", desc: "Двойная котлета из мраморной говядины, сыр чеддер, соус ПОЕШЬ.", price: 450, category: "Бургеры", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Пицца Пепперони", desc: "Классическая пепперони с моцареллой и томатным соусом. 30 см.", price: 650, category: "Пицца", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Ролл Филадельфия", desc: "Свежий лосось, сливочный сыр, огурец, рис, нори. 8 шт.", price: 550, category: "Азия", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Том Ям с морепродуктами", desc: "Острый тайский суп с креветками, кальмарами и грибами.", price: 480, category: "Азия", img: "https://images.unsplash.com/photo-1548943487-a2e4d43b4859?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Сырный Бургер", desc: "Котлета, много сыра, халапеньо для остроты.", price: 420, category: "Бургеры", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Пицца Маргарита", desc: "Ничего лишнего: томаты, моцарелла, базилик.", price: 500, category: "Пицца", img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Картофель Фри", desc: "Хрустящий картофель с солью.", price: 150, category: "Снеки", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Крафт Кола", desc: "Освежающий напиток со льдом, 0.5л", price: 120, category: "Напитки", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80" },
];

const categories = ["Все", "Бургеры", "Пицца", "Азия", "Снеки", "Напитки"];

// --- ИКОНКИ ---
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

export default function PoeshApp() {
    const [activeCategory, setActiveCategory] = useState("Все");
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Фильтрация меню
    const filteredMenu = activeCategory === "Все"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    // Логика корзины
    const addToCart = (item) => {
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
        }).filter(item => item.qty > 0)); // Удаляем, если стало 0
    };

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Оформление заказа
    const handleCheckout = () => {
        setOrderPlaced(true);
        setTimeout(() => {
            setCart([]);
            setOrderPlaced(false);
            setIsCartOpen(false);
        }, 3000);
    };

    return (
        <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#ff5722] selection:text-white pb-20">

            {/* НАВИГАЦИЯ */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">

                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#ff5722]">
                            ПОЕШЬ
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
                    >
                        <CartIcon />
                        <span className="font-bold text-sm">{totalPrice} ₽</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#ff5722] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* ГЕРОЙ БЛОК */}
            <section className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-[#ff5722] to-[#ff8a50] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
                    <div className="relative z-10 md:w-1/2">
                        <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-4 text-black">
                            Быстрая доставка <br />в Оренбурге
                        </h2>
                        <p className="text-black/80 font-medium text-lg mb-8 max-w-md">
                            Горячие бургеры, свежая пицца и роллы. Привезем за 45 минут или отдадим заказ бесплатно.
                        </p>
                        <button
                            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        >
                            Смотреть меню
                        </button>
                    </div>
                    {/* Декоративный элемент на фоне баннера */}
                    <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </section>

            {/* МЕНЮ */}
            <main id="menu" className="px-4 md:px-8 max-w-7xl mx-auto">

                {/* Фильтры */}
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar items-center border-b border-white/10 mb-8">
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
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredMenu.map(item => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={item.id}
                                className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors flex flex-col"
                            >
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                        {item.category}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{item.desc}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-black">{item.price} ₽</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="bg-white/10 hover:bg-[#ff5722] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* КОРЗИНА (Sidebar) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#111] border-l border-white/10 z-[60] flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                                <h2 className="text-2xl font-black uppercase">Ваш заказ</h2>
                                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <CloseIcon />
                                </button>
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
                                        <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl">
                                            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm">{item.name}</h4>
                                                <p className="text-[#ff5722] font-bold text-sm mt-1">{item.price * item.qty} ₽</p>
                                            </div>
                                            <div className="flex items-center bg-black rounded-full overflow-hidden">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10">-</button>
                                                <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10">+</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-[#0a0a0a] border-t border-white/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-400 font-medium">Итого к оплате:</span>
                                        <span className="text-3xl font-black">{totalPrice} ₽</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={orderPlaced}
                                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${orderPlaced ? "bg-green-500 text-white" : "bg-[#ff5722] hover:bg-[#ff8a50] text-white"
                                            }`}
                                    >
                                        {orderPlaced ? "ЗАКАЗ ПРИНЯТ ✓" : "ОФОРМИТЬ ЗАКАЗ"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}