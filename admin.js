import { db } from "./firebase.js";
import {
  collection,onSnapshot,updateDoc,doc,increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onSnapshot(collection(db,"orders"),snap=>{
  let html="";
  snap.forEach(d=>{
    const data=d.data();
    html+=`
    <p>₹${data.amount} - ${data.status}
    <button onclick="approve('${d.id}','${data.userId}',${data.amount},${data.reward}')">Approve</button></p>`;
  });
  document.getElementById("orders").innerHTML=html;
});

window.approve=async(id,userId,amt,reward)=>{
  await updateDoc(doc(db,"orders",id),{status:"approved"});

  await updateDoc(doc(db,"users",userId),{
    balance:increment(amt),
    bonus:increment(reward)
  });
};
