import React from 'react';
import { Heart, Sparkles, Calendar, Star, Trash2 } from 'lucide-react';

/**
 * 祝福卡片组件 - 玻璃拟态风格
 */
const WishCard = ({ wish, onLike, onDelete, isOwner }) => {
    // 主题样式配置
    const themeStyles = {
        祝福: {
            border: 'border-red-500/20',
            bg: 'bg-red-500/10',
            text: 'text-red-200',
            icon: 'text-red-400',
            accent: 'from-red-500 to-orange-500'
        },
        回顾: {
            border: 'border-amber-500/20',
            bg: 'bg-amber-500/10',
            text: 'text-amber-200',
            icon: 'text-amber-400',
            accent: 'from-amber-400 to-yellow-600'
        },
        期许: {
            border: 'border-purple-500/20',
            bg: 'bg-purple-500/10',
            text: 'text-purple-200',
            icon: 'text-purple-400',
            accent: 'from-purple-500 to-pink-500'
        },
    };

    const style = themeStyles[wish.tag] || themeStyles['祝福'];

    // 选择图标
    const getIcon = () => {
        switch (wish.tag) {
            case '回顾': return Calendar;
            case '期许': return Star;
            default: return Sparkles;
        }
    };
    const Icon = getIcon();

    // 格式化时间
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    return (
        <div
            className={`group relative h-64 rounded-xl border ${style.border} bg-[#120808]/60 backdrop-blur-md p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-col`}
        >
            {/* 噪点纹理 */}
            <div className="absolute inset-0 rounded-xl opacity-5 pointer-events-none noise-texture" />

            {/* 头部 */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`px-3 py-1 rounded-full ${style.bg} border border-white/5 flex items-center gap-2`}>
                    <Icon className={`w-3 h-3 ${style.icon}`} />
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${style.text}`}>
                        {wish.tag || '祝福'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="font-serif italic text-xs text-white/20">
                        {formatDate(wish.created_at) || '2026'}
                    </div>
                    {/* 删除按钮（仅owner可见） */}
                    {isOwner && onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all"
                            title="删除"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* 内容 */}
            <div className="relative z-10 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <p className="text-gray-300 leading-loose font-light text-[15px] break-all whitespace-pre-wrap">
                        {wish.content}
                    </p>
                </div>
            </div>

            {/* 底部 */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10 mt-auto">
                <div className="flex items-center gap-3">
                    {/* 头像 */}
                    <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${style.accent} flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}
                    >
                        {wish.name ? wish.name.charAt(0).toUpperCase() : '友'}
                    </div>
                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                        {wish.name || '匿名'}
                    </span>
                </div>

                {/* 点赞按钮 */}
                <button
                    onClick={(e) => { e.stopPropagation(); onLike(); }}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors group/btn"
                >
                    <Heart
                        className={`w-3.5 h-3.5 transition-transform group-active/btn:scale-75 ${wish.likes > 0 ? 'fill-red-500/20 text-red-500' : ''
                            }`}
                    />
                    <span>{wish.likes || 0}</span>
                </button>
            </div>
        </div>
    );
};

export default WishCard;
