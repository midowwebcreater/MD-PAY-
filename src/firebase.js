import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAegviHYDQHr2hLSGvCq3PsoRpcDPGwDtM",
  authDomain: "md-pay.firebaseapp.com",
  projectId: "md-pay",
  storageBucket: "md-pay.firebasestorage.app",
  messagingSenderId: "791808520166",
  appId: "1:791808520166:web:e9b5bfa06ff546581c7027"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
