// src/data/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (asegúrate de que sea la correcta)
const firebaseConfig = {
  apiKey: "AIzaSyBKLyw75tkmSaBSyizcNUFsgtP37R4G1Xw",
  authDomain: "quandochega-24f2c.firebaseapp.com",
  projectId: "quandochega-24f2c",
  storageBucket: "quandochega-24f2c.firebasestorage.app",
  messagingSenderId: "886722290849",
  appId: "1:886722290849:web:ea80ff1dce008f3d5afce0",
  measurementId: "G-YPXN3PMFBB",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializar Analytics si es necesario
const analytics = getAnalytics(app);

// Inicializar Firestore
const db = getFirestore(app);

export { auth, db };
