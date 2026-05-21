import React, { useState } from "react";
import { C, btn, AlaafiaLogo } from "../config.jsx";

// 👍 Added initialMode prop (defaults to "signup" if none is passed)
export default function AuthPage({ onLogin, onRegister, onBack, initialMode = "signup" }) {
  // 👍 The state initializes with whatever flag was passed from Landing Page
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      {/* Back Navigation Trigger */}
      <button onClick={onBack} disabled={submitting} style={{
        position: "absolute", top: 24, left: 32, background: "none", border: "none",
        cursor: submitting ? "not-allowed" : "pointer", color: C.muted, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6,
      }}>← Go Back</button>

      {/* Brand Header Wrapper */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "12px", 
        marginBottom: "36px" 
      }}>
        <AlaafiaLogo size={36} />
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: "2.2rem", 
          fontWeight: 700, 
          color: C.primary, 
          margin: 0 
        }}>
          Alaafia
        </h1>
      </div>

      {/* Authentication Container Panel */}
      <div style={{
        background: C.white, borderRadius: 24, padding: "40px 44px",
        width: "100%", maxWidth: 420, border: `1px solid ${C.border}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}>
        {/* Toggle Switch Tabs */}
        <div style={{ display: "flex", background: C.surface, borderRadius: 12, padding: 4, marginBottom: 32 }}>
          {["signup", "login"].map(m => (
            <button key={m} type="button" onClick={() => !submitting && setMode(m)} style={{
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

        {/* Form Inputs Container */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Full Name</label>
              <input 
                style={inputStyle} 
                disabled={submitting} 
                placeholder="e.g. Tunde Balogun" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Email Address</label>
            <input 
              style={inputStyle} 
              type="email" 
              disabled={submitting} 
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              autoComplete="username"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input 
                style={{ ...inputStyle, paddingRight: "46px" }} 
                type={showPassword ? "text" : "password"} 
                disabled={submitting} 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: C.muted,
                  fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "4px", outline: "none"
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>
          
          {error && <p style={{ color: "#b5341e", fontSize: "0.85rem", margin: 0 }}>⚠️ {error}</p>}
          
          <button 
            type="submit"
            style={btn("primary", { 
              width: "100%", marginTop: 8, padding: "14px", borderRadius: 12, 
              opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" 
            })} 
            disabled={submitting}
          >
            {submitting ? "Processing..." : mode === "signup" ? "Create Account →" : "Access Console →"}
          </button>
        </form>
      </div>
    </div>
  );
}