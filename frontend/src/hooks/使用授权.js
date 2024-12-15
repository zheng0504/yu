import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const 授权上下文 = createContext(null);

export function 授权提供者({ children }) {
  const [用户, set用户] = useState(null);
  const [加载中, set加载中] = useState(true);

  useEffect(() => {
    // 检查本地存储的令牌
    const token = localStorage.getItem('token');
    if (token) {
      获取用户信息();
    } else {
      set加载中(false);
    }
  }, []);

  const 获取用户信息 = async () => {
    try {
      const response = await axios.get('/api/用户信息');
      set用户(response.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      localStorage.removeItem('token');
    } finally {
      set加载中(false);
    }
  };

  const 登录 = async (用户名, 密码) => {
    const response = await axios.post('/api/登录', { 用户名, 密码 });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set用户(user);
    // 设置全局请求头
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const 注销 = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set用户(null);
  };

  const 更新用户信息 = (新信息) => {
    set用户(prevUser => ({
      ...prevUser,
      ...新信息
    }));
  };

  const value = {
    用户,
    加载中,
    登录,
    注销,
    更新用户信息
  };

  return (
    <授权上下文.Provider value={value}>
      {children}
    </授权上下文.Provider>
  );
}

export function useAuth() {
  const context = useContext(授权上下文);
  if (!context) {
    throw new Error('useAuth 必须在 授权提供者 内部使用');
  }
  return context;
}

// 设置请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 设置响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/登录';
    }
    return Promise.reject(error);
  }
);
