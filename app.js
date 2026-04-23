import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,onSnapshot,addDoc,collection,query,where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth,user=>{
  if(user){

    onSnapshot(doc(db,"users",user.uid),snap=>{
      const d=snap.data();
      document.getElementById("balance").innerText="₹"+d.balance;
      document.getElementById("bonus").innerText="Bonus ₹"+d.bonus;
    });

    const q=query(collection(db,"orders"),where("userId","==",user.uid));
    onSnapshot(q,snap=>{
      let html="";
      snap.forEach(doc=>{
        const d=doc.data();
        html+=`<p>₹${d.amount} - ${d.status}</p>`;
      });
      document.getElementById("history").innerHTML=html;
    });
  }
});

window.buy=async(type)=>{
  const amt=Number(document.getElementById("amount").value);
  const percent = type==="bank"?10:7;

  await addDoc(collection(db,"orders"),{
    userId:auth.currentUser.uid,
    amount:amt,
    reward:amt*percent/100,
    status:"pending"
  });
};

window.withdraw=async ()=>{
  const amt=Number(document.getElementById("wamount").value);

  await addDoc(collection(db,"withdrawals"),{
    userId:auth.currentUser.uid,
    amount:amt,
    status:"pending"
  });
};
