// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyDe9iqGEiEYRRTAjacJ5cS7V8TBNzXVn8M",
  authDomain: "cryptobuddy-96401.firebaseapp.com",
  databaseURL: "https://cryptobuddy-96401-default-rtdb.firebaseio.com",
  projectId: "cryptobuddy-96401",
  storageBucket: "cryptobuddy-96401.firebasestorage.app",
  messagingSenderId: "130424959201",
  appId: "1:130424959201:web:3bb57b690f8fdfb75587a0",
  measurementId: "G-XTV3DXK36B"
};

// Debug - Bu değerleri konsola yazdırarak kontrol ediyoruz
console.log("Firebase Config:", firebaseConfig);

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Authentication ve Firestore servislerini al
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore }; 