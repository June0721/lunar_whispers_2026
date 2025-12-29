import React, { useState } from 'react';
import avatarImg from '../assets/apocania-avatar.jpg';

/**
 * 制作人印章组件 - 固定在右下角，悬停展开
 */
const MakerBadge = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex items-center justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`
                flex items-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isHovered ? 'w-48 opacity-100' : 'w-0 opacity-0'}
            `}>
                <div className="bg-[#1a0f0f]/80 backdrop-blur-md border border-red-500/20 rounded-r-full md:rounded-r-none md:rounded-l-full py-1.5 pl-4 pr-3 ml-[-12px] md:ml-0 md:mr-[-12px] whitespace-nowrap shadow-xl">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-serif text-red-200/70">
                        Made by Apocania
                    </span>
                </div>
            </div>

            {/* 头像容器 - 在手机端显示在左边，展开方向也做相应调整 */}
            <div className={`
                relative w-12 h-12 rounded-xl overflow-hidden order-first md:order-last
                bg-gradient-to-br from-red-600/20 to-red-900/40 
                backdrop-blur-md border border-red-500/30
                cursor-help transition-all duration-500
                ${isHovered ? 'rotate-3 scale-110 shadow-[0_0_25px_rgba(220,38,38,0.4)]' : 'shadow-lg'}
            `}>
                {/* 噪点纹理层 */}
                <div className="absolute inset-0 opacity-20 noise-texture z-0" />

                {/* 动漫头像图片 */}
                <img
                    src={avatarImg}
                    alt="Apocania"
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />

                {/* 覆盖层 */}
                <div className="absolute inset-0 bg-red-900/10 pointer-events-none mix-blend-overlay" />

                {/* 装饰边框 */}
                <div className="absolute -inset-[1px] rounded-xl border border-white/10 pointer-events-none z-10" />
            </div>
        </div>
    );
};

export default MakerBadge;
