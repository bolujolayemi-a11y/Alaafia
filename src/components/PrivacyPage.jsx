import React from "react";
import { C, AlaafiaLogo } from "../config.jsx";

export default function PrivacyPage({ onBack }) {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 40 }}>
          ← Back to Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <AlaafiaLogo size={36} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 700, color: C.primary, margin: 0 }}>
            Privacy Policy
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, color: C.text, lineHeight: 1.7, fontSize: "0.95rem", fontWeight: 300 }}>
          <p style={{ color: C.muted, fontSize: "0.9rem" }}>Last updated: May 2026</p>
          
          <p>
            At Alaafia, we take the confidentiality of your health inquiries seriously. This policy outlines how we handle data to maintain a safe, secure, and private environment for your educational health interactions.
          </p>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary, margin: "12px 0 0 0" }}>
            1. Information Collection and Storage
          </h3>
          <p style={{ margin: 0 }}>
            When you interact with our platform, your conversation threads and account details are processed and stored securely via encrypted backend instances. This allows you to log back into your dashboard, review past consultations, and safely manage your historical inputs.
          </p>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary, margin: "12px 0 0 0" }}>
            2. Data Usage and Core Privacy
          </h3>
          <p style={{ margin: 0 }}>
            Your explicit health inputs are utilized solely to generate contextual, relevant educational responses through our dedicated processing pipelines. We do not sell, rent, or lease your account profiles, email identifiers, or dialogue history logs to pharmaceutical companies, advertising firms, or third-party brokers.
          </p>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary, margin: "12px 0 0 0" }}>
            3. User Autonomy and Deletion
          </h3>
          <p style={{ margin: 0 }}>
            You maintain full control over your information history. You have the right to clear individual messaging bubbles or completely drop entire conversation records from your console sidebar at any moment, which purges the corresponding documents immediately from the active database nodes.
          </p>
        </div>
      </div>
    </div>
  );
}