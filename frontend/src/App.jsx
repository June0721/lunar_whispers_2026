import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Feather, Sparkles, RefreshCw } from 'lucide-react';

// Components
import LunarAurora from './components/LunarAurora';
import GoldDustEffect from './components/GoldDustEffect';
import OpeningCeremony from './components/OpeningCeremony';
import WishCard from './components/WishCard';
import WriteModal from './components/WriteModal';
import MakerBadge from './components/MakerBadge';

// API
import { getWishes, createWish, likeWish, deleteWish, getClientId } from './api/wishes';

/**
 * Lunar Whispers - 新年祝福网站主应用
 */
function App() {
    const [wishes, setWishes] = useState([]);
    const [hasEntered, setHasEntered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientId, setClientId] = useState('');

    // 获取客户端ID
    useEffect(() => {
        setClientId(getClientId());
    }, []);

    // 加载祝福数据
    const loadWishes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWishes();
            setWishes(data.wishes || []);
        } catch (err) {
            console.error('加载失败:', err);
            setError('加载失败，请刷新重试');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 进入主界面后加载数据
    useEffect(() => {
        if (hasEntered) {
            loadWishes();
        }
    }, [hasEntered, loadWishes]);

    // 提交新祝福
    const handleSubmit = async (data) => {
        const newWish = await createWish(data);
        setWishes(prev => [newWish, ...prev]);
    };

    // 点赞
    const handleLike = async (wishId) => {
        try {
            const result = await likeWish(wishId);
            if (result.success) {
                setWishes(prev => prev.map(w =>
                    w.id === wishId ? { ...w, likes: result.likes } : w
                ));
            }
        } catch (err) {
            console.error('点赞失败:', err);
        }
    };

    // 删除自己的祝福
    const handleDelete = async (wishId) => {
        if (!confirm('确定要删除这条祝福吗？')) return;

        try {
            await deleteWish(wishId);
            setWishes(prev => prev.filter(w => w.id !== wishId));
        } catch (err) {
            console.error('删除失败:', err);
            alert(err.message || '删除失败');
        }
    };

    return (
        <div className="relative min-h-screen text-gray-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
            {/* 背景效果 */}
            <LunarAurora />
            <GoldDustEffect />

            {/* 开场动画 */}
            {!hasEntered && <OpeningCeremony onEnter={() => setHasEntered(true)} />}

            {/* 主应用 */}
            <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>

                {/* 导航栏 */}
                <nav className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/20">
                            <Flame className="text-white w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-xl tracking-tight font-medium text-white">Lunar Whispers</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">The 2026 Collection</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={loadWishes}
                            className="hidden sm:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hidden sm:flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Feather className="w-4 h-4" />
                            写福牌
                        </button>
                    </div>
                </nav>

                {/* Hero 区域 */}
                <header className="relative z-10 pt-8 md:pt-12 pb-16 md:pb-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-7xl mb-10 leading-[1.4] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-red-50 to-red-300/60 pt-2 pb-4">
                        Keep the warmth, <br />pass it on.
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 font-light mt-4">
                        旧岁千般皆如意，新年万事定称心。<br />
                        在这里留下你的光，照亮别人的路。
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-red-100 border border-white/10 rounded-full font-medium hover:scale-105 active:scale-95 backdrop-blur-md transition-all group"
                    >
                        <Feather className="w-4 h-4 mr-2.5 text-red-400" />
                        <span className="tracking-widest uppercase text-sm">Make a Wish</span>
                    </button>
                </header>

                {/* 祝福墙 */}
                <main className="relative z-10 max-w-7xl mx-auto px-4 pb-48 md:pb-32">
                    {error && (
                        <div className="text-center py-10 text-red-400">
                            {error}
                            <button onClick={loadWishes} className="ml-2 underline">重试</button>
                        </div>
                    )}

                    {isLoading && wishes.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-500" />
                            <p className="text-gray-500">加载中...</p>
                        </div>
                    ) : wishes.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <Sparkles className="text-gray-500" />
                            </div>
                            <p className="text-gray-500 font-serif">暂无祈福，成为第一个点灯人吧。</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishes.map((wish) => (
                                <WishCard
                                    key={wish.id}
                                    wish={wish}
                                    onLike={() => handleLike(wish.id)}
                                    onDelete={() => handleDelete(wish.id)}
                                    isOwner={wish.is_owner === true}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* 底部 */}
                <footer className="relative z-10 py-8 px-6 border-t border-white/5 bg-[#050202]/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <p className="text-gray-600 font-serif italic text-sm flex-1 text-center md:text-left">
                            "May you never be too grown up to search the skies on New Year's Eve."
                        </p>
                        <div>
                            <MakerBadge />
                        </div>
                    </div>
                </footer>

                {/* 移动端浮动按钮 */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-red-600 to-amber-600 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
                >
                    <Feather size={24} />
                </button>
            </div>

            {/* 写祝福弹窗 */}
            <WriteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />

        </div>
    );
}

export default App;
