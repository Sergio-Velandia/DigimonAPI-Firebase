// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // <--- 1. Importar getAuth
import { getFirestore } from "firebase/firestore"; // <--- 2. Importar getFirestore

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAknMdT3vwpFmNLfesrIXy12rJ3V0uz8X4",
    authDomain: "digimonapi-cd359.firebaseapp.com",
    projectId: "digimonapi-cd359",
    storageBucket: "digimonapi-cd359.firebasestorage.app",
    messagingSenderId: "939818441504",
    appId: "1:939818441504:web:59da655cfe608e99c7d545",
    measurementId: "G-Y9FYN6EY5X"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. Inicializar y Exportar (Named Exports)
export const auth = getAuth(app);         // <--- Inicializar y Exportar auth
export const db = getFirestore(app);      // <--- Inicializar y Exportar db