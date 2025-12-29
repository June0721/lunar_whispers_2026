/**
 * Admin API 调用封装
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// 获取存储的 token
const getAdminToken = () => localStorage.getItem('admin_token');

// 保存 token
const setAdminToken = (token) => {
    if (token) {
        localStorage.setItem('admin_token', token);
    } else {
        localStorage.removeItem('admin_token');
    }
};

// 检查是否已登录
export const isLoggedIn = () => !!getAdminToken();

// 通用请求函数
const adminRequest = async (endpoint, options = {}) => {
    const token = getAdminToken();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': token || '',
            ...options.headers,
        },
    });

    if (response.status === 401) {
        setAdminToken(null);
        throw new Error('请先登录');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: '请求失败' }));
        throw new Error(error.detail || '请求失败');
    }

    return response.json();
};

/**
 * 管理员登录
 */
export const login = async (password) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || '登录失败');
    }

    if (data.token) {
        setAdminToken(data.token);
    }

    return data;
};

/**
 * 管理员登出
 */
export const logout = async () => {
    try {
        await adminRequest('/admin/logout', { method: 'POST' });
    } finally {
        setAdminToken(null);
    }
};

/**
 * 获取统计数据
 */
export const getStats = async () => {
    return adminRequest('/admin/stats');
};

/**
 * 获取所有祝福（包括隐藏的）
 */
export const getAllWishes = async (skip = 0, limit = 100, includeHidden = true) => {
    return adminRequest(`/admin/wishes?skip=${skip}&limit=${limit}&include_hidden=${includeHidden}`);
};

/**
 * 隐藏祝福
 */
export const hideWish = async (wishId) => {
    return adminRequest(`/admin/wishes/${wishId}/hide`, { method: 'POST' });
};

/**
 * 显示祝福
 */
export const showWish = async (wishId) => {
    return adminRequest(`/admin/wishes/${wishId}/show`, { method: 'POST' });
};

/**
 * 删除祝福
 */
export const deleteWish = async (wishId) => {
    return adminRequest(`/admin/wishes/${wishId}`, { method: 'DELETE' });
};
