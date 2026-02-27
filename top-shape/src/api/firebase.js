import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYlscn3Ol-GsUDm6CTnNa_d0jOAdv12EE",
  authDomain: "top-shape-38085.firebaseapp.com",
  projectId: "top-shape-38085",
  storageBucket: "top-shape-38085.firebasestorage.app",
  messagingSenderId: "1072437196001",
  appId: "1:1072437196001:web:4fef7acf772ed8c6abf3a0",
  measurementId: "G-08HR7VJX7M"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para usar nos seus ecrãs (SignIn e Register)
export const auth = getAuth(app);
export const db = getFirestore(app);