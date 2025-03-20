// Fichier de configuration Firebase
import { initializeApp } from 'firebase/app';

// Configuration de base pour Firebase (peut être utilisée plus tard pour d'autres fonctionnalités)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Initialisation de l'application
const app = initializeApp(firebaseConfig);

export default app;