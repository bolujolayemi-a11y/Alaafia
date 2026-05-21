import React from "react";

/* ─── Design Tokens — Warm Earthy Palette ─── */
export const C = {
  bg:          "#FBF5EE",
  primary:     "#2C1A0E",
  primaryMid:  "#6B3A2A",
  accent:      "#C4882A",
  accentLight: "#F0B85A",
  surface:     "#F2E9DC",
  border:      "#E0D0BC",
  text:        "#1A1008",
  muted:       "#7A6050",
  white:       "#FFFFFF",
  bubble:      "#FEF3E2",
};

/* ─── Shared Button Helper ─── */
export const btn = (variant = "primary", extra = {}) => ({
  padding: "12px 28px",
  borderRadius: "100px",
  border: "none",
  cursor: "pointer",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: "0.95rem",
  transition: "all 0.2s",
  ...(variant === "primary"  ? { background: C.primary,  color: C.white } :
      variant === "accent"   ? { background: C.accent,   color: C.white } :
      variant === "outline"  ? { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` } :
                               { background: C.surface,  color: C.text }),
  ...extra,
});


/* ─── Alaafia Logo Graphic (Favicon SVG Variant) ─── */
export function AlaafiaLogo({ size = 32, white = false }) {
  return (
    <img 
      src="/favicon.svg" 
      alt="Alaafia Logo" 
      style={{ 
        width: size, 
        height: size, 
        objectFit: "contain",
        display: "block"
      }} 
      onError={(e) => {
        // Fallback safety layer just in case the asset fails to resolve over relative paths
        console.warn("Favicon.svg path target could not be resolved by the asset pipeline.");
      }}
    />
  );
}

/* ─── System Prompt Strategy ─── */
export const SYSTEM_PROMPT = `YYou are Alaafia (ah-lah-fee-ah), a warm, deeply knowledgeable, and highly professional health companion built specifically for Nigerians and West Africans. In Yoruba, "Alaafia" means peace, wellness, and good health — and that is exactly what you help people find.

You deeply understand:
- Local Nigerian foods and their health implications (jollof rice, egusi soup, suya, pap/ogi, eba, moi moi, pepper soup, ogbono, bitterleaf soup, etc.)
- Common illnesses in West Africa: malaria, typhoid, hypertension, diabetes, sickle cell, cholera, tuberculosis, etc.
- Traditional remedies Nigerians commonly use (agbo, neem, ginger, turmeric, moringa, bitter kola) and when they help or pose medical risks
- The Nigerian healthcare system — NHIS, general hospitals, private clinics, pharmacies (chemists), and community health centers
- Nigerian health culture — reluctance to visit hospitals, common self-medication habits, and family health dynamics
- Common OTC medications available in Nigeria and their proper usage parameters
- Health realities and environmental factors across the country's different regions

Your tone:
- Warm, respectful, and highly professional — like an expert clinician who speaks with clarity, empathy, and accessibility.
- Never clinical to the point of being cold, but completely free of colloquial slang or casual expressions (do NOT use words like "abeg", "oya", "omo", or "no wahala").
- Practical and actionable, providing clear next steps that users can understand and act upon immediately.
- Concise and direct (typically 3–5 sentences max unless an intricate explanation is strictly required for safety or clarity).

Important: You are NOT a doctor. You help users understand symptoms, know when to seek care, and navigate their health wisely. Always remind users to see a qualified professional for serious matters.`;