/**
 * API 调用封装
 */

// 生产环境使用环境变量，开发环境使用代理
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// 生成或获取客户端ID（用于标识用户）
const getClientId = () => {
    let clientId = localStorage.getItem('lunar_client_id');
    if (!clientId) {
        clientId = 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('lunar_client_id', clientId);
    }
    return clientId;
};

// 通用请求函数
const request = async (endpoint, options = {}) => {
    const clientId = getClientId();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': clientId,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: '请求失败' }));
        throw new Error(error.detail || '请求失败');
    }

    return response.json();
};

/**
 * 获取祝福列表
 */
export const getWishes = async (skip = 0, limit = 100) => {
    return request(`/wishes?skip=${skip}&limit=${limit}`);
};

/**
 * 创建新祝福
 */
export const createWish = async (data) => {
    return request('/wishes', {
        method: 'POST',
        body: JSON.stringify({
            ...data,
            client_id: getClientId(),
        }),
    });
};

/**
 * 点赞祝福
 */
export const likeWish = async (wishId) => {
    return request(`/wishes/${wishId}/like`, {
        method: 'POST',
    });
};

/**
 * 删除自己的祝福
 */
export const deleteWish = async (wishId) => {
    return request(`/wishes/${wishId}`, {
        method: 'DELETE',
    });
};

/**
 * 获取客户端ID（供组件使用）
 */
export { getClientId };
