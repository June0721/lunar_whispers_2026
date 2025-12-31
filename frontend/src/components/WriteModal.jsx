import React, { useState } from 'react';
import { X, Sparkles, Calendar, Star, Send } from 'lucide-react';

/**
 * 写祝福弹窗组件
 */
const WriteModal = ({ isOpen, onClose, onSubmit }) => {
    const [activeTab, setActiveTab] = useState('祝福');
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tabs = [
        { id: '祝福', label: '送祝福', icon: Sparkles, color: 'text-red-400' },
        { id: '回顾', label: '2025 回顾', icon: Calendar, color: 'text-amber-400' },
        { id: '期许', label: '2026 许愿', icon: Star, color: 'text-purple-400' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                content: content.trim(),
                name: name.trim() || '匿名',
                tag: activeTab,
            });
            // 重置表单
            setContent('');
            setName('');
            onClose();
        } catch (error) {
            console.error('提交失败:', error);
            alert(error.message || '提交失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 遮罩 */}
            <div
                className="absolute inset-0 bg-[#050202]/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* 弹窗主体 */}
            <div className="relative w-full max-w-xl bg-[#0f0a0a]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-zoom-in backdrop-blur-xl">
                <div className="absolute inset-0 opacity-5 pointer-events-none noise-texture" />

                {/* 关闭按钮 - 移动到容器顶部以在移动端更易触达 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-red-200 transition-colors bg-white/5 rounded-full md:bg-transparent"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col md:flex-row md:min-h-0">
                    {/* 侧边栏 - 类型选择 */}
                    <div className="w-full md:w-1/3 bg-[#1a0f0f] border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-6 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto no-scrollbar">
                        <h3 className="hidden md:block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                            Select Type
                        </h3>
                        {tabs.map((t) => {
                            const Icon = t.icon;
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-1.5 md:gap-3 p-2 md:p-3 rounded-xl text-center md:text-left transition-all duration-200 ${isActive
                                        ? 'bg-white/5 border border-white/5 shadow-inner'
                                        : 'hover:bg-white/5 text-gray-500'
                                        }`}
                                >
                                    <div className={`p-1 md:p-2 rounded-lg ${isActive ? 'bg-[#2a1515]' : 'bg-[#1f1212]'} ${isActive ? t.color : 'text-gray-600'}`}>
                                        <Icon className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                    <span className={`text-[10px] md:text-sm font-medium ${isActive ? 'text-red-100' : 'text-gray-500'}`}>
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 表单区域 */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col bg-[#0f0a0a]">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="font-serif text-xl md:text-2xl text-red-50">New Entry</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 tracking-widest uppercase ml-1">
                                    Your Message
                                </label>
                                <textarea
                                    required
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="写下你的心愿..."
                                    maxLength={500}
                                    className="w-full h-28 md:h-32 bg-[#1a0f0f] border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none transition-all font-serif"
                                />
                                <div className="text-right text-xs text-gray-700">
                                    {content.length}/500
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 tracking-widest uppercase ml-1">
                                    Signature
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="你的名字 (可选)"
                                    maxLength={50}
                                    className="w-full bg-[#1a0f0f] border border-white/10 rounded-xl p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                                />
                            </div>

                            <div className="mt-auto pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className="w-full py-3 bg-red-800 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-red-100 font-medium rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                    <span>{isSubmitting ? '发送中...' : 'Post to Wall'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteModal;
