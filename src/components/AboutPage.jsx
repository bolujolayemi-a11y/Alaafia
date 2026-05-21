import React from "react";
import { C, btn, AlaafiaLogo } from "../config.jsx";

export default function AboutPage({ onBack }) {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 40 }}>
          ← Back to Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <AlaafiaLogo size={36} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, margin: 0 }}>
            About Alaafia
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, color: C.text, lineHeight: 1.7, fontSize: "1rem", fontWeight: 300 }}>
          <p>
            <strong>Alaafia</strong> is an AI-powered health information companion designed specifically to address public health challenges and lifestyle realities within Nigeria and the wider West African region.
          </p>
          <p>
            Traditional health platforms often lack local context, failing to account for everyday regional dietary habits, widespread self-medication practices, or local pharmacy operations. Alaafia bridges this gap by offering immediate, highly accessible, and culturally-informed clarity on general health queries.
          </p>
          <p>
            By translating complex medical jargon into clear, straightforward language, we empower individuals to understand their physical well-being, safely evaluate everyday choices, and navigate local healthcare delivery systems with confidence.
          </p>
          
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginTop: 16 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary, margin: "0 0 12px 0" }}>
              Our Framework Scope
            </h3>
            <p style={{ margin: 0, fontSize: "0.92rem", color: C.muted }}>
              Alaafia operates strictly as an educational resource. We do not provide clinical diagnoses, prescribe pharmacological treatments, or replace the vital, expert care of qualified medical professionals. Our mission is to guide users toward safer health literacy and timely professional intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}