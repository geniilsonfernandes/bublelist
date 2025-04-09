// lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGH7Qlp53xrKgaB2E7V2t3xiHmrkPV_RI",
  authDomain: "buble-61ae8.firebaseapp.com",
  projectId: "buble-61ae8",
  storageBucket: "buble-61ae8.firebasestorage.app",
  messagingSenderId: "456732132245",
  appId: "1:456732132245:web:fda36755fc699f1be5ac9c",
  measurementId: "G-DEZJEW9QNN",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Configura o Firestore para garantir offline
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export { db };
