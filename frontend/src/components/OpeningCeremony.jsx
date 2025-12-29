import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

// 开场签文库
const PROPHECIES = [
    { cn: "岁岁常欢愉，年年皆胜意。", en: "May you be happy every year, and may everything go your way." },
    { cn: "山水万程，皆是好运。", en: "Good luck accompanies you wherever you go." },
    { cn: "凡是过往，皆为序章。", en: "What's past is prologue." },
    { cn: "追光而遇，沐光而行。", en: "Chase the light, and walk within it." },
    { cn: "心纳吉，万事亨。", en: "Keep joy in your heart, and all goes well." },
    { cn: "愿新年，胜旧年。", en: "May the new year surpass the old." },
    { cn: "日子滚烫，生活可爱。", en: "Days are warm, life is lovely." },
    { cn: "所求皆如愿，所行化坦途。", en: "May all your wishes come true, and your path be smooth." },
];

/**
 * 开场仪式组件 - 红包开启动画
 */
const OpeningCeremony = ({ onEnter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [prophecy, setProphecy] = useState(PROPHECIES[0]);

    useEffect(() => {
        // 随机选择一条签文
        setProphecy(PROPHECIES[Math.floor(Math.random() * PROPHECIES.length)]);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(() => setShowCard(true), 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 背景遮罩 */}
            <div
                className={`absolute inset-0 bg-[#050202] transition-opacity duration-1000 ${showCard ? 'opacity-95' : 'opacity-100'
                    }`}
            />
            <div className="absolute inset-0 opacity-10 pointer-events-none noise-texture" />

            {/* 阶段1: 红包 */}
            <div
                className={`relative cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${isOpen
                    ? 'scale-150 opacity-0 translate-y-20 pointer-events-none'
                    : 'scale-100 opacity-100 hover:scale-105'
                    }`}
                onClick={handleOpen}
            >
                {!isOpen && (
                    <div className="flex flex-col items-center gap-8">
                        <div className="relative group">
                            {/* 红包主体 */}
                            <div className="w-56 h-72 bg-gradient-to-b from-red-700 to-red-900 rounded-xl shadow-[0_20px_50px_rgba(220,38,38,0.2)] flex flex-col items-center justify-center relative overflow-hidden border border-white/5">
                                {/* 纹理 */}
                                <div className="absolute inset-0 opacity-20 noise-texture" />
                                {/* 金色圆圈 */}
                                <div className="w-24 h-24 rounded-full border-2 border-yellow-500/30 flex items-center justify-center mb-12 relative">
                                    <div className="w-20 h-20 rounded-full border border-yellow-500/50 flex items-center justify-center">
                                        <span className="font-serif text-4xl text-yellow-500 font-bold">福</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 text-yellow-500/50 text-xs tracking-[0.5em] uppercase">
                                    Open Me
                                </div>
                            </div>
                            {/* 发光效果 */}
                            <div className="absolute -inset-4 bg-red-600/20 blur-3xl -z-10 rounded-full group-hover:bg-red-600/30 transition-all" />
                        </div>
                        <h2 className="text-xl font-serif text-red-100/80 tracking-widest animate-pulse">
                            点击开启鸿运
                        </h2>
                    </div>
                )}
            </div>

            {/* 阶段2: 签文卡片 */}
            {showCard && (
                <div className="relative max-w-sm w-full animate-slide-in-bottom">
                    <div className="relative bg-[#1a0f0f] text-red-50 rounded-sm p-10 text-center border border-red-500/20 shadow-2xl">
                        {/* 装饰角 */}
                        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-red-500/30" />
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-red-500/30" />

                        <div className="mb-8">
                            <p className="text-red-200/60 text-sm mb-4 tracking-wider">Apocania 祝你：</p>
                            <h3 className="font-serif text-3xl font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500">
                                {prophecy.cn}
                            </h3>
                            <p className="font-serif italic text-red-200/50 text-sm">
                                {prophecy.en}
                            </p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mb-8" />

                        <button
                            onClick={onEnter}
                            className="group w-full py-3 bg-red-900/30 hover:bg-red-800/40 border border-red-500/20 text-red-200 rounded-full transition-all duration-500 flex items-center justify-center gap-2"
                        >
                            <span>进入祈福</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* 制作人标识 */}
                        <div className="mt-6 opacity-20 font-serif italic text-[10px] tracking-widest uppercase text-red-200/60">
                            Crafted by Apocania • 2026
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpeningCeremony;
