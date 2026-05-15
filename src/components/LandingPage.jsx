import React from "react";
import { C, btn, AlaafiaLogo } from "../config";

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: "🌿",
      title: "Truly Culturally Aware",
      desc: "Understands Nigerian foods, local remedies, and West African health realities — designed for you, not adapted from somewhere else.",
    },
    {
      icon: "🤝",
      title: "Like a Knowledgeable Friend",
      desc: "Describe symptoms in plain Naija language. Get practical answers without jargon, without judgment, without a long waiting room.",
    },
    {
      icon: "💊",
      title: "Grounded in Your Reality",
      desc: "From what's available at your chemist to when you truly need to see a doctor — advice that fits your actual life.",
    },
  ];

  const steps = [
    { num: "01", text: "Describe how you're feeling or ask your health question in your own words" },
    { num: "02", text: "Get culturally-informed guidance that understands your food, environment, and context" },
    { num: "03", text: "Know whether to manage at home, visit a chemist, or see a doctor — clearly" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, minHeight: "100vh" }}>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px", borderBottom: `1px solid ${C.border}`,
        background: C.bg, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AlaafiaLogo size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700, color: C.primary, letterSpacing: "-0.02em" }}>
            Alaafia
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={btn("outline", { padding: "10px 22px", fontSize: "0.9rem" })} onClick={onGetStarted}>Sign In</button>
          <button style={btn("accent",  { padding: "10px 22px", fontSize: "0.9rem" })} onClick={onGetStarted}>Get Started</button>
        </div>
      </nav>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "90px 48px 70px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", background: `${C.accent}22`, color: C.accent,
          border: `1px solid ${C.accent}55`, borderRadius: 100, padding: "6px 18px",
          fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em",
          textTransform: "uppercase", marginBottom: 28,
        }}>
          Built for Nigerians 🇳🇬
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
          fontWeight: 700, color: C.primary, lineHeight: 1.1,
          marginBottom: 24, letterSpacing: "-0.02em",
        }}>
          Where Your Health{" "}
          <span style={{ color: C.accent, fontStyle: "italic" }}>Comes Home</span>
        </h1>

        <p style={{
          fontSize: "1.15rem", color: C.muted, maxWidth: 560, margin: "0 auto 40px",
          lineHeight: 1.7, fontWeight: 300,
        }}>
          Ask about your symptoms, local remedies, or medications — and get guidance that speaks your language, understands your food, and fits your life.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={btn("primary", { fontSize: "1rem", padding: "15px 36px" })} onClick={onGetStarted}>
            Start for Free →
          </button>
        </div>

        <div style={{
          marginTop: 64, background: C.white, borderRadius: 24,
          border: `1px solid ${C.border}`, padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          maxWidth: 580, marginLeft: "auto", marginRight: "auto", textAlign: "left",
        }}>
          {[
            { role: "user", text: "I've been having headaches and slight fever since yesterday. I took paracetamol but it's not helping much." },
            { role: "ai",   text: "That combination — headache plus fever not responding to paracetamol — can be a common early sign of malaria. I'd recommend getting a simple rapid test today at any local pharmacy or chemist. No need to stress yourself waiting it out. Are you noticing any body aches or cold chills alongside this?" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i === 0 ? 16 : 0, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: m.role === "ai" ? C.primary : C.accent,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
              }}>
                {m.role === "ai" ? <AlaafiaLogo size={20} white /> : "👤"}
              </div>
              <div style={{
                background: m.role === "ai" ? C.bubble : C.surface,
                borderRadius: m.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                padding: "12px 16px", fontSize: "0.88rem", color: C.text,
                lineHeight: 1.6, maxWidth: "80%",
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: C.surface, padding: "80px 48px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, textAlign: "center", marginBottom: 56 }}>
            Why Alaafia is Different
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 20, padding: 32, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, color: C.primary, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "0.93rem", fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 48px", maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, textAlign: "center", marginBottom: 56 }}>
          Simple as Talking to a Friend
        </h2>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 28, padding: "28px 0",
            borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 700, color: C.accentLight, lineHeight: 1, minWidth: 56 }}>
              {s.num}
            </span>
            <p style={{ fontSize: "1.1rem", color: C.text, lineHeight: 1.6, marginTop: 8 }}>{s.text}</p>
          </div>
        ))}
      </section>

      <section style={{ background: C.primary, padding: "72px 48px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.6rem", fontWeight: 700, color: C.white, marginBottom: 16 }}>
          Alaafia starts with understanding.
        </h2>
        <p style={{ color: `${C.white}99`, fontSize: "1rem", marginBottom: 36, fontWeight: 300 }}>
          Free to start. No medical jargon. No high entry barriers. No wahala.
        </p>
        <button style={btn("accent", { fontSize: "1.05rem", padding: "16px 40px" })} onClick={onGetStarted}>
          Start Your Journey →
        </button>
      </section>

      <footer style={{ padding: "32px 48px", textAlign: "center", color: C.muted, fontSize: "0.85rem", borderTop: `1px solid ${C.border}` }}>
        © 2026 Alaafia · Safe educational framework not intended as direct diagnosis · Made with ❤️ in Nigeria
      </footer>
    </div>
  );
}