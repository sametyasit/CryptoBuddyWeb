import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Sayfa yüklendiğinde oturum durumunu kontrol et
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Token ile kullanıcı bilgilerini getir
        const userData = await authAPI.getCurrentUser();
        
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Kimlik doğrulama hatası:', err);
        // Hatalı veya süresi dolmuş token varsa kaldır
        localStorage.removeItem('token');
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Giriş işlemi
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const data = await authAPI.login(email, password);
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', data.token);
      
      // Kullanıcı bilgilerini al
      const userData = await authAPI.getCurrentUser();
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
      return { success: false, error: err.message || 'Giriş yapılırken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kayıt işlemi
  const register = async (username, email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.register(username, email, password);
      
      // Kayıt başarılı olduktan sonra otomatik giriş yap
      const loginData = await authAPI.login(email, password);
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', loginData.token);
      
      // Kullanıcı bilgilerini al
      const userData = await authAPI.getCurrentUser();
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError(err.message || 'Kayıt olurken bir hata oluştu.');
      return { success: false, error: err.message || 'Kayıt olurken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Çıkış işlemi
  const logout = () => {
    // Token'ı localStorage'dan kaldır
    localStorage.removeItem('token');
    
    // Auth state'i sıfırla
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Ana sayfaya yönlendir
    navigate('/');
  };
  
  // Şifre değiştirme işlemi
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.changePassword(currentPassword, newPassword);
      
      return { success: true };
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setError(err.message || 'Şifre değiştirilirken bir hata oluştu.');
      return { success: false, error: err.message || 'Şifre değiştirilirken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Şifremi unuttum işlevi
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.forgotPassword(email);
      
      return { success: true };
    } catch (err) {
      console.error('Şifremi unuttum hatası:', err);
      setError(err.message || 'Şifre sıfırlama isteğinde bir hata oluştu.');
      return { success: false, error: err.message || 'Şifre sıfırlama isteğinde bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Şifre sıfırlama token kontrolü
  const verifyResetToken = async (token) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.verifyResetToken(token);
      
      return { success: true };
    } catch (err) {
      console.error('Token doğrulama hatası:', err);
      setError(err.message || 'Şifre sıfırlama linki geçersiz veya süresi dolmuş.');
      return { success: false, error: err.message || 'Şifre sıfırlama linki geçersiz veya süresi dolmuş.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Şifre sıfırlama
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.resetPassword(token, newPassword);
      
      return { success: true };
    } catch (err) {
      console.error('Şifre sıfırlama hatası:', err);
      setError(err.message || 'Şifre sıfırlarken bir hata oluştu.');
      return { success: false, error: err.message || 'Şifre sıfırlarken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // E-posta doğrulama işlevi
  const verifyEmail = async (token) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authAPI.verifyEmail(token);
      
      return { success: true };
    } catch (err) {
      console.error('E-posta doğrulama hatası:', err);
      setError(err.message || 'E-posta doğrulanırken bir hata oluştu.');
      return { success: false, error: err.message || 'E-posta doğrulanırken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kullanıcı profilini güncelleme işlevi
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const updatedUser = await authAPI.updateProfile(userData);
      
      setCurrentUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError(err.message || 'Profil güncellenirken bir hata oluştu.');
      return { success: false, error: err.message || 'Profil güncellenirken bir hata oluştu.' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    verifyEmail,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 