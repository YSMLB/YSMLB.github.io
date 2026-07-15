"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;

export default function CartPage() {
    return (
        <div className="bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white">

            <header className="w-full px-6 md:px-12 py-8 flex justify-between items-center border-b border-gray-100">
                <Link href="/sneakers" className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-gray-500 transition-colors">
                    <ArrowLeft /> Back to Store
                </Link>
                <div className="bg-[#111] text-white px-6 py-2 skew-x-[-12deg]">
                    <h1 className="skew-x-[12deg] font-black text-xl italic tracking-[0.1em] uppercase">SNEAKER STORE</h1>
                </div>
                <div className="w-24"></div> {/* Placeholder для баланса */}
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20">
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-16">
                    Your Cart
                </h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-dashed border-gray-200 rounded-[30px] p-20 flex flex-col items-center justify-center text-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 mb-6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                    <h3 className="text-2xl font-black uppercase tracking-wider mb-2">Cart is empty</h3>
                    <p className="text-gray-400 font-medium mb-8">Looks like you haven't added anything yet.</p>
                    <Link href="/sneakers" className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow-lg">
                        Start Shopping
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}