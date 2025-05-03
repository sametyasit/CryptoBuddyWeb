import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  login as firebaseLogin, 
  register as firebaseRegister, 
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
  signInWithGoogle as firebaseGoogleSignIn,
  updateUserProfile
} from '../services/authService';
import { createUserProfile, getUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Firebase auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        // Kullanıcı oturum açmış durumda
        setUser(currentUser);
        
        try {
          // Kullanıcı profilini Firestore'dan al
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        // Kullanıcı oturum açmamış
        setUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup fonksiyonu
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const user = await firebaseLogin(email, password);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const user = await firebaseGoogleSignIn();
      // Google ile ilk kez giriş yapıyorsa profil oluştur
      const profile = await getUserProfile(user.uid);
      if (!profile) {
        await createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          favorites: []
        });
      }
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      const user = await firebaseRegister(email, password);
      
      // Kullanıcı adını güncelle
      await updateUserProfile(username);
      
      // Firestore'da kullanıcı profili oluştur
      await createUserProfile(user.uid, {
        email,
        displayName: username,
        photoURL: '',
        favorites: []
      });
      
      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await firebaseResetPassword(email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Yükleniyor...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext; 