// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase yapılandırma bilgileri
// NOT: Gerçek projede bu değerleri .env dosyasından almalısınız
// şu an geliştirme aşamasında olduğumuz için doğrudan buraya ekliyoruz
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Firebase konsolundan alınacak
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // örn: my-project-id.firebaseapp.com
  projectId: "YOUR_PROJECT_ID", // örn: my-project-id
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // örn: my-project-id.appspot.com
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // örn: 123456789012
  appId: "YOUR_APP_ID", // örn: 1:123456789012:web:abc123def456
  measurementId: "YOUR_MEASUREMENT_ID" // örn: G-ABC123DEF456
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Authentication ve Firestore servislerini al
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore }; 