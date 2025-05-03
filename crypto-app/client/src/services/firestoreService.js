import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

// Kullanıcı profili oluşturma
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Kullanıcı profili getirme
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Kullanıcının favori kripto paralarını kaydetme
export const saveFavoriteCoin = async (userId, coinId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      if (!favorites.includes(coinId)) {
        await updateDoc(userRef, {
          favorites: [...favorites, coinId]
        });
      }
      
      return true;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

// Kullanıcının favori kripto parasını kaldırma
export const removeFavoriteCoin = async (userId, coinId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      await updateDoc(userRef, {
        favorites: favorites.filter(id => id !== coinId)
      });
      
      return true;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

// Kullanıcı portföy işlemi ekleme
export const addPortfolioTransaction = async (userId, transaction) => {
  try {
    const transactionRef = doc(collection(firestore, `users/${userId}/transactions`));
    await setDoc(transactionRef, {
      ...transaction,
      timestamp: new Date(),
      id: transactionRef.id
    });
    return transactionRef.id;
  } catch (error) {
    throw error;
  }
};

// Kullanıcı portföy işlemlerini getirme
export const getPortfolioTransactions = async (userId) => {
  try {
    const transactionsRef = collection(firestore, `users/${userId}/transactions`);
    const querySnapshot = await getDocs(transactionsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}; 