import { useState, useEffect } from 'react';
import * as adminApi from '../api/admin';
import './AdminPanel.css';

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(adminApi.isLoggedIn());
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState(null);
    const [wishes, setWishes] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const [message, setMessage] = useState({ type: '', text: '' });

    // 检查登录状态
    useEffect(() => {
        if (isLoggedIn) {
            loadData();
        }
    }, [isLoggedIn]);

    // 加载数据
    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, wishesData] = await Promise.all([
                adminApi.getStats(),
                adminApi.getAllWishes()
            ]);
            setStats(statsData);
            setWishes(wishesData.wishes);
        } catch (err) {
            if (err.message === '请先登录') {
                setIsLoggedIn(false);
            } else {
                showMessage('error', err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // 显示消息
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // 登录
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            await adminApi.login(password);
            setIsLoggedIn(true);
            setPassword('');
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 登出
    const handleLogout = async () => {
        await adminApi.logout();
        setIsLoggedIn(false);
        setStats(null);
        setWishes([]);
    };

    // 隐藏/显示祝福
    const toggleWishVisibility = async (wish) => {
        try {
            if (wish.is_hidden) {
                await adminApi.showWish(wish.id);
                showMessage('success', '已显示');
            } else {
                await adminApi.hideWish(wish.id);
                showMessage('success', '已隐藏');
            }
            loadData();
        } catch (err) {
            showMessage('error', err.message);
        }
    };

    // 删除祝福
    const handleDeleteWish = async (wishId) => {
        if (!confirm('确定要删除这条祝福吗？此操作不可恢复。')) return;

        try {
            await adminApi.deleteWish(wishId);
            showMessage('success', '删除成功');
            loadData();
        } catch (err) {
            showMessage('error', err.message);
        }
    };

    // 登录页面
    if (!isLoggedIn) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="login-header">
                        <h1>🌙 管理后台</h1>
                        <p>Lunar Whispers Admin</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="password">管理员密码</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="请输入密码"
                                autoFocus
                            />
                        </div>

                        {loginError && (
                            <div className="login-error">{loginError}</div>
                        )}

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading || !password}
                        >
                            {loading ? '登录中...' : '登录'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <a href="/">← 返回首页</a>
                    </div>
                </div>
            </div>
        );
    }

    // 管理面板
    return (
        <div className="admin-container">
            {/* 顶部导航 */}
            <header className="admin-header">
                <div className="admin-title">
                    <h1>🌙 Lunar Whispers 管理后台</h1>
                </div>
                <div className="admin-actions">
                    <button onClick={loadData} className="refresh-btn" disabled={loading}>
                        🔄 刷新
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        退出登录
                    </button>
                </div>
            </header>

            {/* 消息提示 */}
            {message.text && (
                <div className={`admin-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* 标签页 */}
            <div className="admin-tabs">
                <button
                    className={activeTab === 'stats' ? 'active' : ''}
                    onClick={() => setActiveTab('stats')}
                >
                    📊 统计数据
                </button>
                <button
                    className={activeTab === 'wishes' ? 'active' : ''}
                    onClick={() => setActiveTab('wishes')}
                >
                    📝 祝福管理
                </button>
            </div>

            {/* 内容区域 */}
            <main className="admin-content">
                {loading && <div className="loading-overlay">加载中...</div>}

                {/* 统计数据 */}
                {activeTab === 'stats' && stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-value">{stats.total_wishes}</div>
                            <div className="stat-label">总祝福数</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">❤️</div>
                            <div className="stat-value">{stats.total_likes}</div>
                            <div className="stat-label">总点赞数</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-value">{stats.wishes_today}</div>
                            <div className="stat-label">今日祝福</div>
                        </div>
                        <div className="stat-card tags">
                            <div className="stat-icon">🏷️</div>
                            <div className="stat-label">按类型统计</div>
                            <div className="tag-stats">
                                {stats.by_tag && Object.entries(stats.by_tag).map(([tag, count]) => (
                                    <div key={tag} className="tag-stat">
                                        <span className="tag-name">{tag}</span>
                                        <span className="tag-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 祝福管理 */}
                {activeTab === 'wishes' && (
                    <div className="wishes-table-container">
                        <table className="wishes-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>内容</th>
                                    <th>署名</th>
                                    <th>类型</th>
                                    <th>点赞</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishes.map(wish => (
                                    <tr key={wish.id} className={wish.is_hidden ? 'hidden-row' : ''}>
                                        <td>{wish.id}</td>
                                        <td className="content-cell" title={wish.content}>
                                            {wish.content.length > 50
                                                ? wish.content.substring(0, 50) + '...'
                                                : wish.content}
                                        </td>
                                        <td>{wish.name}</td>
                                        <td>
                                            <span className={`tag tag-${wish.tag}`}>{wish.tag}</span>
                                        </td>
                                        <td>{wish.likes}</td>
                                        <td>
                                            <span className={`status ${wish.is_hidden ? 'hidden' : 'visible'}`}>
                                                {wish.is_hidden ? '已隐藏' : '显示中'}
                                            </span>
                                        </td>
                                        <td>{new Date(wish.created_at).toLocaleString('zh-CN')}</td>
                                        <td className="actions-cell">
                                            <button
                                                onClick={() => toggleWishVisibility(wish)}
                                                className={`action-btn ${wish.is_hidden ? 'show' : 'hide'}`}
                                            >
                                                {wish.is_hidden ? '显示' : '隐藏'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWish(wish.id)}
                                                className="action-btn delete"
                                            >
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {wishes.length === 0 && (
                            <div className="empty-state">暂无祝福数据</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
