import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  doc, setDoc, getDoc, addDoc, collection, getDocs
} from "firebase/firestore";
import { auth, db } from "./firebase";

const ADMIN = "admin@mdpay.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState("");
  const [deposits, setDeposits] = useState([]);

  // ---------- AUTH ----------
  const register = async () => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), { coins: 0, email });
    setUser(res.user);
  };

  const login = async () => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    setUser(res.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ---------- DATA ----------
  const loadBalance = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) setCoins(snap.data().coins);
  };

  const deposit = async () => {
    if (Number(amount) < 200) return alert("Min ₹200");
    await addDoc(collection(db, "deposits"), {
      userId: user.uid,
      amount: Number(amount),
      status: "pending",
      createdAt: Date.now()
    });
    setAmount("");
    alert("Deposit request sent");
  };

  const loadAdmin = async () => {
    const snap = await getDocs(collection(db, "deposits"));
    setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (user) loadBalance();
  }, [user]);

  useEffect(() => {
    if (user?.email === ADMIN) loadAdmin();
  }, [user]);

  // ---------- STYLES ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "radial-gradient(1200px 600px at 10% -10%, #1f2a44 0%, #0b1220 40%), #0b1220",
      color: "#e5e7eb",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      padding: 16
    },
    container: { maxWidth: 480, margin: "0 auto" },
    card: {
      background: "linear-gradient(180deg, rgba(30,41,59,.9), rgba(15,23,42,.9))",
      border: "1px solid rgba(148,163,184,.15)",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 20px 40px rgba(0,0,0,.35)",
      backdropFilter: "blur(6px)",
      marginTop: 12,
      transition: "transform .15s ease, box-shadow .15s ease"
    },
    cardHover: { transform: "translateY(-2px)", boxShadow: "0 24px 48px rgba(0,0,0,.45)" },
    input: {
      width: "100%",
      padding: 12,
      borderRadius: 10,
      border: "1px solid #1f2a44",
      background: "#0b1220",
      color: "#e5e7eb",
      marginTop: 10
    },
    btn: (bg) => ({
      width: "100%",
      padding: 12,
      marginTop: 10,
      borderRadius: 10,
      border: 0,
      background: bg,
      color: "#052e16",
      fontWeight: 700,
      cursor: "pointer",
      transition: "transform .05s ease, filter .1s ease"
    }),
    btnAlt: {
      background: "#0b1220",
      color: "#cbd5f5",
      border: "1px solid #1f2a44"
    },
    row: { display: "flex", gap: 10 },
    h1: { margin: "4px 0 10px", fontSize: 28 },
    h2: { margin: 0 },
    badge: (ok) => ({
      padding: "4px 8px",
      borderRadius: 999,
      fontSize: 12,
      background: ok ? "#064e3b" : "#1f2937",
      color: ok ? "#bbf7d0" : "#fde68a"
    }),
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #1f2a44"
    }
  };

  // ---------- ADMIN ----------
  if (user && user.email === ADMIN) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h2>Admin Dashboard</h2>
            <div style={{ opacity: .8, fontSize: 13 }}>Deposits</div>

            {deposits.map(d => (
              <div key={d.id} style={styles.listItem}>
                <div>
                  ₹{d.amount}
                  <div style={{ fontSize: 12, opacity: .7 }}>
                    {new Date(d.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>
                <span style={styles.badge(d.status === "approved")}>
                  {d.status}
                </span>
              </div>
            ))}

            <button style={{ ...styles.btn("#ef4444") }} onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- AUTH ----------
  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h2>MD PAY</h2>
            <div style={{ opacity: .7, fontSize: 13 }}>Secure Wallet</div>

            <input style={styles.input} placeholder="Email"
              onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password"
              onChange={e => setPass(e.target.value)} />

            <button style={styles.btn("#22c55e")} onClick={login}>Login</button>
            <button style={{ ...styles.btn("#0b1220"), ...styles.btnAlt }} onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- USER ----------
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ opacity: .7, fontSize: 13 }}>Wallet Balance</div>
              <div style={styles.h1}>₹{coins}</div>
            </div>
            <button style={{ ...styles.btn("#0b1220"), ...styles.btnAlt, width: "auto", padding: "8px 12px" }}
              onClick={logout}>Logout</button>
          </div>

          <input style={styles.input} placeholder="Enter Amount (min ₹200)"
            value={amount} onChange={e => setAmount(e.target.value)} />

          <div style={styles.row}>
            <button style={styles.btn("#22c55e")} onClick={deposit}>Deposit</button>
            <button style={{ ...styles.btn("#0b1220"), ...styles.btnAlt }} onClick={() => alert("Withdraw flow next step")}>
              Withdraw
            </button>
          </div>
        </div>

      </div>
    </div>
  );
    }
