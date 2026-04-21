import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { auth, db } from "./firebase";

const ADMIN_EMAIL = "admin@mdpay.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // REGISTER
  const register = async () => {
    const res = await createUserWithEmailAndPassword(
      auth,
      "test@test.com",
      "123456"
    );

    await setDoc(doc(db, "users", res.user.uid), {
      coins: 0,
      email: res.user.email
    });

    setUser(res.user);
  };

  // LOGIN
  const login = async () => {
    const res = await signInWithEmailAndPassword(
      auth,
      "test@test.com",
      "123456"
    );
    setUser(res.user);
  };

  // LOAD COINS
  const loadCoins = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) setCoins(snap.data().coins);
  };

  useEffect(() => {
    if (user) loadCoins();
  }, [user]);

  // USER: DEPOSIT
  const deposit = async () => {
    const amt = Number(amount);
    await addDoc(collection(db, "deposits"), {
      userId: user.uid,
      amount: amt,
      status: "pending"
    });
    alert("Deposit request sent");
  };

  // USER: WITHDRAW
  const withdraw = async () => {
    const amt = Number(amount);
    await addDoc(collection(db, "withdrawals"), {
      userId: user.uid,
      amount: amt,
      status: "pending"
    });
    alert("Withdraw request sent");
  };

  // ADMIN LOAD
  const loadAdmin = async () => {
    const d = await getDocs(collection(db, "deposits"));
    setDeposits(d.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const w = await getDocs(collection(db, "withdrawals"));
    setWithdrawals(w.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) loadAdmin();
  }, [user]);

  const approveDeposit = async (d) => {
    const bonus = d.amount * 0.05;
    const total = d.amount + bonus;

    const ref = doc(db, "users", d.userId);
    const snap = await getDoc(ref);

    await updateDoc(ref, {
      coins: (snap.data().coins || 0) + total
    });

    await updateDoc(doc(db, "deposits", d.id), {
      status: "approved"
    });

    alert("Deposit approved");
  };

  const approveWithdraw = async (w) => {
    const ref = doc(db, "users", w.userId);
    const snap = await getDoc(ref);

    await updateDoc(ref, {
      coins: (snap.data().coins || 0) - w.amount
    });

    await updateDoc(doc(db, "withdrawals", w.id), {
      status: "approved"
    });

    alert("Withdraw approved");
  };

  // ADMIN PANEL
  if (user && user.email === ADMIN_EMAIL) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Panel</h2>

        <h3>Deposits</h3>
        {deposits.map(d => (
          <div key={d.id}>
            ₹{d.amount} - {d.status}
            <button onClick={() => approveDeposit(d)}>Approve</button>
          </div>
        ))}

        <h3>Withdrawals</h3>
        {withdrawals.map(w => (
          <div key={w.id}>
            ₹{w.amount} - {w.status}
            <button onClick={() => approveWithdraw(w)}>Approve</button>
          </div>
        ))}
      </div>
    );
  }

  // LOGIN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>MD PAY</h2>
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  // USER PANEL
  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>
      <h3>Balance: ₹{coins}</h3>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
      }
