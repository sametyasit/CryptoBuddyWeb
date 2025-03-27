import axios from 'axios';

// API temel URL'si
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// İstek interceptor'ı - her istekte token ekler (varsa)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cevap interceptor'ı - yetkilendirme hatalarını yönetir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Yetkilendirme hatası durumunda token'ı temizle
      localStorage.removeItem('token');
      
      // Eğer sayfayı yenilemeye gerek duyarsan:
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Authentication API
export const authAPI = {
  // Kayıt ol
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Giriş yap
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Kullanıcı bilgilerini getir
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifre değiştir
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifremi unuttum
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifre sıfırlama
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // E-posta doğrula
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Profili güncelle
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
};

// Kripto Para API
export const coinAPI = {
  // Tüm kripto paraları getir
  getCoins: async (params = {}) => {
    try {
      const { page = 1, limit = 100, search = null } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await api.get(`/coins?${queryParams.toString()}`);
      return response.data.coins;
    } catch (error) {
      throw error;
    }
  },
  
  // Kripto para detaylarını getir
  getCoinDetails: async (coinId) => {
    try {
      const response = await api.get(`/coins/${coinId}`);
      return response.data.coin;
    } catch (error) {
      throw error;
    }
  },
  
  // Kripto para fiyat geçmişini getir
  getCoinHistory: async (coinId, period = '24h') => {
    try {
      const response = await api.get(`/coins/${coinId}/history?period=${period}`);
      return response.data.history;
    } catch (error) {
      throw error;
    }
  },
  
  // Global piyasa verilerini getir
  getGlobalStats: async () => {
    try {
      const response = await api.get('/coins/global-stats');
      return response.data.stats;
    } catch (error) {
      throw error;
    }
  },
  
  // En çok kazandıran ve kaybettiren kripto paraları getir
  getGainersLosers: async () => {
    try {
      const response = await api.get('/coins/gainers-losers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Trend kripto paraları getir
  getTrendingCoins: async () => {
    try {
      const response = await api.get('/coins/trending');
      return response.data.trending;
    } catch (error) {
      throw error;
    }
  }
};

// Portföy API
export const portfolioAPI = {
  // Kullanıcı portföyünü getir
  getPortfolio: async () => {
    try {
      const response = await api.get('/portfolio');
      return response.data.portfolio;
    } catch (error) {
      throw error;
    }
  },
  
  // Portföye kripto para ekle/güncelle
  updateCoin: async (data) => {
    try {
      const response = await api.post('/portfolio/update', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Portföyden kripto para sil
  removeCoin: async (coinId) => {
    try {
      const response = await api.delete(`/portfolio/${coinId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Portföy istatistiklerini getir
  getPortfolioStats: async () => {
    try {
      const response = await api.get('/portfolio/stats');
      return response.data.stats;
    } catch (error) {
      throw error;
    }
  },
  
  // İşlem geçmişini getir
  getTransactionHistory: async (params = {}) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await api.get(`/portfolio/history?page=${page}&limit=${limit}`);
      return response.data.transactions;
    } catch (error) {
      throw error;
    }
  }
};

// Haber API
export const newsAPI = {
  // Kripto para haberlerini getir
  getNews: async (params = {}) => {
    try {
      const { page = 1, limit = 10, category = null } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      if (category) {
        queryParams.append('category', category);
      }
      
      const response = await api.get(`/news?${queryParams.toString()}`);
      return response.data.news;
    } catch (error) {
      throw error;
    }
  },
  
  // Haber kategorilerini getir
  getCategories: async () => {
    try {
      const response = await api.get('/news/categories');
      return response.data.categories;
    } catch (error) {
      throw error;
    }
  },
  
  // Belirli bir haberin detaylarını getir
  getNewsDetails: async (newsId) => {
    try {
      const response = await api.get(`/news/${newsId}`);
      return response.data.article;
    } catch (error) {
      throw error;
    }
  }
};

// Favori API
export const favoriteAPI = {
  // Favori kripto paraları getir
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data.favorites;
    } catch (error) {
      throw error;
    }
  },
  
  // Favori ekle
  addFavorite: async (coinId) => {
    try {
      const response = await api.post('/favorites', { coinId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Favori sil
  removeFavorite: async (coinId) => {
    try {
      const response = await api.delete(`/favorites/${coinId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// İhbar/Alarm API
export const alertAPI = {
  // Alarmları getir
  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data.alerts;
    } catch (error) {
      throw error;
    }
  },
  
  // Alarm oluştur/güncelle
  createAlert: async (data) => {
    try {
      const response = await api.post('/alerts', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Alarm sil
  deleteAlert: async (alertId) => {
    try {
      const response = await api.delete(`/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Alarm güncelle
  updateAlertStatus: async (alertId, status) => {
    try {
      const response = await api.patch(`/alerts/${alertId}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default { authAPI, coinAPI, portfolioAPI, newsAPI, favoriteAPI, alertAPI }; 