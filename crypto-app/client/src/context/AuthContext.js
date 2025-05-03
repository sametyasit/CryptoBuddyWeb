import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Firebase Auth State değişikliklerini dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      
      if (user) {
        // Firestore'dan kullanıcı bilgilerini al
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              email: user.email,
              username: userData.username,
              ...userData
            });
            setIsAuthenticated(true);
          } else {
            console.error('Kullanıcı belgesi bulunamadı');
          }
        } catch (err) {
          console.error('Kullanıcı verileri alınırken hata oluştu:', err);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });
    
    // Component unmount edildiğinde dinlemeyi durdur
    return () => unsubscribe();
  }, []);
  
  // Giriş işlemi
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Firebase Authentication ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Firestore'dan kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({
          id: user.uid,
          email: user.email,
          username: userData.username,
          ...userData
        });
        setIsAuthenticated(true);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Giriş hatası:', err);
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      // Firebase hata kodlarına göre özelleştirilmiş mesajlar
      switch (err.code) {
        case 'auth/invalid-credential':
          errorMessage = 'E-posta veya şifre hatalı.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Şifre hatalı.';
          break;
        default:
          errorMessage = err.message || 'Giriş yapılırken bir hata oluştu.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kayıt işlemi
  const register = async (username, email, password, additionalData = {}) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        email,
        createdAt: new Date(),
        favorites: [],
        portfolio: [],
        alerts: [],
        age: additionalData.age || null,
        gender: additionalData.gender || null,
        nationality: additionalData.nationality || null,
        phoneNumber: additionalData.phoneNumber || null,
        identificationNumber: additionalData.identificationNumber || null,
        lastUpdated: new Date()
      });
      
      setCurrentUser({
        id: user.uid,
        email,
        username,
        createdAt: new Date(),
        ...additionalData
      });
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Kayıt hatası:', err);
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      
      // Firebase hata kodlarına göre özelleştirilmiş mesajlar
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Şifre çok zayıf. En az 6 karakter kullanın.';
          break;
        default:
          errorMessage = err.message || 'Kayıt olurken bir hata oluştu.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Çıkış işlemi
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      console.error('Çıkış hatası:', err);
      setError('Çıkış yapılırken bir hata oluştu.');
    }
  };
  
  // Şifre değiştirme işlemi
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Önce mevcut şifre ile tekrar giriş yaparak kullanıcıyı doğrula
      if (auth.currentUser) {
        const credential = await signInWithEmailAndPassword(
          auth, 
          auth.currentUser.email, 
          currentPassword
        );
        
        // Şifreyi güncelle
        await updatePassword(auth.currentUser, newPassword);
        
        return { success: true };
      } else {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      let errorMessage = 'Şifre değiştirilirken bir hata oluştu.';
      
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Mevcut şifre yanlış.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Şifremi unuttum işlevi
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await sendPasswordResetEmail(auth, email);
      
      return { success: true };
    } catch (err) {
      console.error('Şifremi unuttum hatası:', err);
      let errorMessage = 'Şifre sıfırlama isteğinde bir hata oluştu.';
      
      // Firebase hata kodlarına göre özelleştirilmiş mesajlar
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi.';
          break;
        default:
          errorMessage = err.message || 'Şifre sıfırlama isteğinde bir hata oluştu.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kullanıcı profilini güncelleme işlevi
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!auth.currentUser) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { ...userData }, { merge: true });
      
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      
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