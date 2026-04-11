import { useState } from "react";
import { db } from "./database";

const C = {
  saffron: "#FF6B00", gold: "#F5C842", navy: "#0A1628",
  navyL: "#112240", green: "#00C48C", red: "#FF4757", white: "#fff"
};

export default function Register({ onRegister, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    studentName: "", studentLastName: "",
    fatherName: "", fatherLastName: "",
    motherName: "", motherLastName: "",
    phone: "", password: "", confirmPassword: "",
    pin: "", class: "10", stream: "PCM",
    city: "", school: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const nextStep = () => {
    if (step === 1) {
      if (!form.studentName || !form.studentLastName) return setError("Please enter student name");
      if (!form.fatherName || !form.fatherLastName) return setError("Please enter father name");
      if (!form.motherName || !form.motherLastName) return setError("Please enter mother name");
    }
    if (step === 2) {
      if (!form.phone || form.phone.length < 10) return setError("Please enter valid phone number");
      if (!form.password || form.password.length < 6) return setError("Password must be at least 6 characters");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match");
      if (!form.pin || form.pin.length !== 4) return setError("PIN must be 4 digits");
    }
    setError("");
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    const result = db.register({ ...form, createdAt: new Date().toISOString() });
    if (result.success) {
      onRegister({ ...form });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const inp = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
    padding: "12px 14px", color: C.white, fontSize: 14,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12
  };

  return (
    <div style={{ minHeight: "100vh", background: linear-gradient(135deg, , #0f1f3d), display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Outfit', system-ui", color: C.white }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>??</div>
          <div style={{ fontSize: 32, fontWeight: 900, background: linear-gradient(135deg, , ), WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GurukulAI</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>India's First AI Private Tuition</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? C.saffron : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>

          {step === 1 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>???????? Family Details</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Your teacher will address everyone by name</div>
              <div style={{ fontSize: 11, color: C.saffron, fontWeight: 700, marginBottom: 8 }}>STUDENT</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inp, flex: 1 }} placeholder="First Name" value={form.studentName} onChange={e => update("studentName", e.target.value)} />
                <input style={{ ...inp, flex: 1 }} placeholder="Last Name" value={form.studentLastName} onChange={e => update("studentLastName", e.target.value)} />
              </div>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, marginBottom: 8 }}>FATHER</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inp, flex: 1 }} placeholder="First Name" value={form.fatherName} onChange={e => update("fatherName", e.target.value)} />
                <input style={{ ...inp, flex: 1 }} placeholder="Last Name" value={form.fatherLastName} onChange={e => update("fatherLastName", e.target.value)} />
              </div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 8 }}>MOTHER</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inp, flex: 1 }} placeholder="First Name" value={form.motherName} onChange={e => update("motherName", e.target.value)} />
                <input style={{ ...inp, flex: 1 }} placeholder="Last Name" value={form.motherLastName} onChange={e => update("motherLastName", e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>?? Account Setup</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>PIN is used by parents to unlock screen</div>
              <input style={inp} placeholder="Phone Number" type="tel" maxLength={10} value={form.phone} onChange={e => update("phone", e.target.value)} />
              <input style={inp} placeholder="Password (min 6 characters)" type="password" value={form.password} onChange={e => update("password", e.target.value)} />
              <input style={inp} placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} />
              <div style={{ fontSize: 11, color: C.saffron, fontWeight: 700, marginBottom: 8 }}>4-DIGIT PARENT PIN (to unlock screen)</div>
              <input style={inp} placeholder="e.g. 1234" type="password" maxLength={4} value={form.pin} onChange={e => update("pin", e.target.value.replace(/\D/g, ""))} />
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>?? Study Details</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>We personalise your curriculum</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>SELECT CLASS</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["10", "12"].map(c => (
                  <button key={c} onClick={() => update("class", c)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: 1px solid , background: form.class === c ? ${C.saffron}20 : "transparent", color: form.class === c ? C.saffron : "rgba(255,255,255,0.5)", fontWeight: 700, cursor: "pointer" }}>Class {c}</button>
                ))}
              </div>
              {form.class === "12" && (
                <>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>SELECT STREAM</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    {["PCM", "PCB"].map(s => (
                      <button key={s} onClick={() => update("stream", s)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: 1px solid , background: form.stream === s ? ${C.gold}20 : "transparent", color: form.stream === s ? C.gold : "rgba(255,255,255,0.5)", fontWeight: 700, cursor: "pointer" }}>{s}</button>
                    ))}
                  </div>
                </>
              )}
              <input style={inp} placeholder="City" value={form.city} onChange={e => update("city", e.target.value)} />
              <input style={inp} placeholder="School Name" value={form.school} onChange={e => update("school", e.target.value)} />
            </>
          )}

          {error && <div style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 12 }}>{error}</div>}

          <button
            onClick={step < 3 ? nextStep : handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: linear-gradient(135deg, , #FF8C3A), color: C.white, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8 }}>
            {loading ? "Creating account..." : step < 3 ? "Next ?" : "?? Start Learning"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <span onClick={onLogin} style={{ color: C.saffron, cursor: "pointer", fontWeight: 600 }}>Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
}
