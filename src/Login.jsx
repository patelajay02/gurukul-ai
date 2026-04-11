import { useState } from "react";
import { db, createDemoUser } from "./database";

const C = {
  saffron: "#FF6B00", gold: "#F5C842", navy: "#0A1628",
  navyL: "#112240", green: "#00C48C", red: "#FF4757", white: "#fff"
};

export default function Login({ onLogin, onRegister }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!phone || !password) return setError("Please enter phone and password");
    setLoading(true);
    const result = db.login(phone, password);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDemo = () => {
    createDemoUser();
    const result = db.login("9999999999", "demo123");
    if (result.success) onLogin(result.user);
  };

  const inp = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
    padding: "12px 14px", color: C.white, fontSize: 14,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12
  };

  return (
    <div style={{ minHeight: "100vh", background: linear-gradient(135deg, , #0f1f3d), display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Outfit', system-ui", color: C.white }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>??</div>
          <div style={{ fontSize: 32, fontWeight: 900, background: linear-gradient(135deg, , ), WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GurukulAI</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Welcome back! Your teacher is waiting.</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Sign In</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Enter your registered phone number</div>

          <input style={inp} placeholder="Phone Number" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          <input style={inp} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />

          {error && (
            <div style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: linear-gradient(135deg, , #FF8C3A), color: C.white, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 12 }}>
            {loading ? "Signing in..." : "Sign In ?"}
          </button>

          <button onClick={handleDemo} style={{ width: "100%", padding: "14px", borderRadius: 12, border: 1px solid rgba(255,255,255,0.15), background: "rgba(255,255,255,0.05)", color: C.white, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>
            ?? Try Demo (No signup needed)
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            New to GurukulAI?{" "}
            <span onClick={onRegister} style={{ color: C.saffron, cursor: "pointer", fontWeight: 600 }}>Create Account</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          Demo: Phone 9999999999 • Password demo123 • PIN 1234
        </div>
      </div>
    </div>
  );
}
