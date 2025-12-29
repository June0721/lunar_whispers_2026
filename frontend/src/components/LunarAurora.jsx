import React from 'react';

/**
 * 极光背景组件 - 营造新年氛围
 */
const LunarAurora = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0a0505]">
            {/* 红色极光：象征鸿运 */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-900/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
            {/* 金色极光：象征财运 */}
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-amber-700/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
            {/* 紫色极光：象征紫气东来 */}
            <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[130px] animate-blob animation-delay-4000 mix-blend-screen" />
            {/* 噪点纹理 */}
            <div className="absolute inset-0 opacity-20 noise-texture" />
        </div>
    );
};

export default LunarAurora;
