import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "mdpay-e9abc.firebaseapp.com",
  projectId: "mdpay-e9abc",
  storageBucket: "mdpay-e9abc.appspot.com",
  messagingSenderId: "469801367306",
  appId: "1:469801367306:web:3fe5ae19ed9c50dea9ecf3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
