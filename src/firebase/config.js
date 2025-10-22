// Configuration Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAyd2oTV57S9IMEpnj7KQl5NU776XLr3_M",
  authDomain: "hub-outils-xeilom.firebaseapp.com",
  projectId: "hub-outils-xeilom",
  storageBucket: "hub-outils-xeilom.firebasestorage.app",
  messagingSenderId: "502282848995",
  appId: "1:502282848995:web:bc57f99883cfc811de93d6",
  measurementId: "G-5YX2TCP8ME",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firebase Auth
export const auth = getAuth(app);

export default app;
