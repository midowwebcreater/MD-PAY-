import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let confirmationResult;

window.registerUser = async ()=>{
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const res = await createUserWithEmailAndPassword(auth,email,pass);

  await setDoc(doc(db,"users",res.user.uid),{
    email,
    balance:0,
    bonus:0
  });

  alert("Registered");
};

window.loginUser = async ()=>{
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth,email,pass);
  window.location="dashboard.html";
};

window.sendOTP = ()=>{
  window.recaptchaVerifier = new RecaptchaVerifier(auth,"recaptcha-container",{size:"invisible"});
  const phone = document.getElementById("phone").value;

  signInWithPhoneNumber(auth,phone,window.recaptchaVerifier)
    .then(result=>confirmationResult=result);
};

window.verifyOTP = async ()=>{
  const code = document.getElementById("otp").value;
  const res = await confirmationResult.confirm(code);

  await setDoc(doc(db,"users",res.user.uid),{
    phone: res.user.phoneNumber,
    balance:0,
    bonus:0
  });

  window.location="dashboard.html";
};
