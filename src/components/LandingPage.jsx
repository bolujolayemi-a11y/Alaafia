import React from "react";
import { C, btn, AlaafiaLogo } from "../config.jsx";

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: "🌿",
      title: "Culturally Informed Guidance",
      desc: "Deeply understands local nutrition, traditional remedies, and regional health realities across Nigeria — built for your specific context.",
    },
    {
      icon: "🤝",
      title: "Accessible and Empathetic",
      desc: "Describe your symptoms in plain, natural language. Receive practical, clear insights without clinical jargon, judgment, or long wait times.",
    },
    {
      icon: "💊",
      title: "Grounded in Practical Realities",
      desc: "From understanding options at your local pharmacy to identifying when you truly need to see a doctor — guidance tailored to your daily life.",
    },
  ];

  const steps = [
    { num: "01", text: "Describe how you are feeling or ask your health question in your own natural words." },
    { num: "02", text: "Receive professional, culturally-aware insights that consider your diet, environment, and lifestyle." },
    { num: "03", text: "Gain clear direction on whether to manage wellness at home, consult a local pharmacist, or visit a clinic." },
  ];

  const mockups = [
    {
      title: "Malaria & Fever Screening",
      userText: "I have had a headache and slight fever since yesterday. Paracetamol isn't fully working.",
      aiText: "A headache and fever that do not respond completely to paracetamol are common early presentations of malaria in our environment. I highly advise taking a simple blood or rapid diagnostic test (RDT) at a nearby pharmacy today."
    },
    {
      title: "Nutrition & Lifestyle Context",
      userText: "Is it fine if I eat instant noodles almost every night for dinner?",
      aiText: "While convenient, instant noodles are typically very high in sodium and lack vital protein and fiber. For better long-term wellness, consider cracking an egg into it and mixing in fresh fluted pumpkin leaves (ugu) or carrots to improve the nutritional profile."
    },
    {
      title: "Chronic Care Guidance",
      userText: "My uncle's blood pressure is 150/95. Should we give him herbal tea or agbo?",
      aiText: "A blood pressure reading of 150/95 indicates Stage 2 Hypertension. Please avoid giving unknown concentrations of agbo, as it can strain the kidneys. He should be evaluated by a medical professional at a clinic for formal management."
    }
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, minHeight: "100vh" }}>
      {/* Navigation Header */}
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
          {/* 👍 Maps direct to historical Sign In screen layout tab */}
          <button style={btn("outline", { padding: "10px 22px", fontSize: "0.9rem" })} onClick={() => onGetStarted("login")}>Sign In</button>
          {/* 👍 Maps direct to New Account screen layout tab */}
          <button style={btn("accent",  { padding: "10px 22px", fontSize: "0.9rem" })} onClick={() => onGetStarted("signup")}>Get Started</button>
        </div>
      </nav>

      {/* Hero Presentation Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 24px 70px", textAlign: "center" }}>
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
          Ask about symptoms, local wellness habits, or general medical descriptions — and receive clear guidance that respects your environment and fits your life.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
          {/* 👍 Maps direct to New Account creation tab */}
          <button style={btn("primary", { fontSize: "1rem", padding: "15px 36px" })} onClick={() => onGetStarted("signup")}>
            Start for Free →
          </button>
        </div>

        {/* 3 Render Mockups Columns Side-by-Side Grid Layer */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "stretch",
          textAlign: "left"
        }}>
          {mockups.map((mock, idx) => (
            <div 
              key={idx} 
              style={{
                background: C.white, 
                borderRadius: 24,
                border: `1px solid ${C.border}`, 
                padding: "24px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {mock.title}
              </div>

              {/* User Bubble */}
              <div style={{ display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", color: C.white }}>👤</span>
                </div>
                <div style={{ background: C.surface, borderRadius: "14px 4px 14px 14px", padding: "10px 14px", fontSize: "0.82rem", color: C.text, lineHeight: 1.5, maxWidth: "85%" }}>
                  {mock.userText}
                </div>
              </div>

              {/* AI Bubble */}
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.white, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  <AlaafiaLogo size={30} />
                </div>
                <div style={{ background: C.bubble, borderRadius: "4px 14px 14px 14px", padding: "10px 14px", fontSize: "0.82rem", color: C.text, lineHeight: 1.5, maxWidth: "85%" }}>
                  {mock.aiText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Values Grid */}
      <section style={{ background: C.surface, padding: "80px 48px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, textAlign: "center", marginBottom: 56 }}>
            Designed Around Your Health Realities
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

      {/* Onboarding Functional Steps */}
      <section style={{ padding: "80px 48px", maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, textAlign: "center", marginBottom: 56 }}>
          Simple, Direct, and Reliable
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

      {/* Action Closure Banner */}
      <section style={{ background: C.primary, padding: "72px 48px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.6rem", fontWeight: 700, color: C.white, marginBottom: 16 }}>
          Alaafia starts with understanding.
        </h2>
        <p style={{ color: `${C.white}99`, fontSize: "1rem", marginBottom: 36, fontWeight: 300 }}>
          Free to access. No complex medical barriers. Reliable educational support.
        </p>
        <button style={btn("accent", { fontSize: "1.05rem", padding: "16px 40px" })} onClick={() => onGetStarted("signup")}>
          Start Your Journey →
        </button>
      </section>

      {/* footer block : */}
      <footer style={{ padding: "40px 48px", textAlign: "center", color: C.muted, fontSize: "0.85rem", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "24px", marginBottom: "4px" }}>
          <button onClick={() => onGetStarted("about")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>About Us</button>
          <button onClick={() => onGetStarted("privacy")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>Privacy Policy</button>
        </div>
        <div>
          © 2026 Alaafia · Safe educational framework not intended as direct diagnosis · Built with ❤️ in Nigeria 
        </div>
      </footer>
    </div>
  );
}