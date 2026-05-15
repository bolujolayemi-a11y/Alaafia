import React, { useState } from "react";
import { C, btn, AlaafiaLogo } from "../config";

export default function AuthPage({ onLogin, onRegister, onBack }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    
    // Client Validation Guards
    if (!email || !password) return setError("Please fill in all fields.");
    if (mode === "signup" && !name) return setError("Please enter your name.");
    
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      // Errors are caught and parsed inside App.jsx handlers
      setError(err.message || "Authentication process aborted.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    border: `1.5px solid ${C.border}`, background: C.white,
    fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem",
    color: C.text, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px",
    }}>
      <button onClick={onBack} disabled={submitting} style={{
        position: "absolute", top: 24, left: 32, background: "none", border: "none",
        cursor: submitting ? "not-allowed" : "pointer", color: C.muted, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6,
      }}>← Go Back</button>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <AlaafiaLogo size={44} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: C.primary, marginTop: 10 }}>
          Alaafia
        </div>
      </div>

      <div style={{
        background: C.white, borderRadius: 24, padding: "40px 44px",
        width: "100%", maxWidth: 420, border: `1px solid ${C.border}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}>
        {/* Toggle Switch Tabs */}
        <div style={{ display: "flex", background: C.surface, borderRadius: 12, padding: 4, marginBottom: 32 }}>
          {["signup", "login"].map(m => (
            <button key={m} onClick={() => !submitting && setMode(m)} style={{
              flex: 1, padding: "10px", borderRadius: 9, border: "none", 
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s",
              background: mode === m ? C.white : "transparent",
              color: mode === m ? C.primary : C.muted,
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {m === "signup" ? "New Account" : "Sign In"}
            </button>
          ))}
        </div>

        {/* Input Interactive Collection Field Layers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Full Name</label>
              <input style={inputStyle} disabled={submitting} placeholder="e.g. Tunde Balogun" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Email Address</label>
            <input style={inputStyle} type="email" disabled={submitting} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Password</label>
            <input style={inputStyle} type="password" disabled={submitting} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          {error && <p style={{ color: "#b5341e", fontSize: "0.85rem", margin: 0 }}>⚠️ {error}</p>}
          
          <button 
            style={btn("primary", { 
              width: "100%", marginTop: 8, padding: "14px", borderRadius: 12, 
              opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" 
            })} 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Processing..." : mode === "signup" ? "Create Account →" : "Access Console →"}
          </button>
        </div>
      </div>
    </div>
  );
}