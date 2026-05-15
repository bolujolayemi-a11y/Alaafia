import React, { useState, useRef, useEffect } from "react";
import { C, btn, AlaafiaLogo } from "../config";
import { getHealthGuidance } from "../services/aiService";
import { createConversation, saveMessage, getMessages } from "../services/api"; // Path adjusted for project conventions

export default function ChatPage({ user, onSignOut }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Track the active persistent conversation ID document from your Appwrite instance
  const [currentConvId, setCurrentConvId] = useState(null);
  
  const bottomRef = useRef(null);

  // 1. Initial Greeting on mounting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Alaafia, ${user.name}! 👋\n\nI'm here to help you understand your health better — your symptoms, your questions, your remedies. What's going on today?`,
        },
      ]);
    }
  }, [user.name]);

  // 2. Continuous Scroll Anchor Tracking
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hardcoded Pre-flight Emergency Triaging Guardrails Layer
  const checkEmergencyTriggers = (text) => {
    const criticalKeywords = [
      "chest pain", "breathing", "heart attack", "poison", "stroke", 
      "suicide", "self-harm", "bleeding heavily", "unconscious"
    ];
    return criticalKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  // 3. Complete Data Pipeline Message Transmission Flow
  const handleSend = async (forcedText = null) => {
    const textToSend = forcedText || input.trim();
    if (!textToSend || loading) return;

    // Fast local state update for snappy performance
    const updatedHistory = [...messages, { role: "user", content: textToSend }];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    let activeId = currentConvId;

    try {
      // Step A: Setup remote persistence layer lazily if starting a new topic
      if (!activeId) {
        // Safe string slice down for cleanly indexed title fields (e.g. Appwrite schema attributes)
        const chatSnippet = textToSend.slice(0, 40);
        const conversationDocument = await createConversation(user.$id, chatSnippet);
        activeId = conversationDocument.$id;
        setCurrentConvId(activeId);
      }

      // Step B: Save user message record to database asynchronously
      await saveMessage(activeId, "user", textToSend);

      // Step C: Trigger Critical Triage Safety Checks
      if (checkEmergencyTriggers(textToSend)) {
        const structuralAlertText = "🚨 **CRITICAL NOTICE:** The symptoms you described require immediate professional evaluation. Please visit the nearest Emergency Room, General Hospital, or call primary emergency services right now. Do not wait out severe symptoms.";
        
        await saveMessage(activeId, "assistant", structuralAlertText);
        setMessages(prev => [...prev, { role: "assistant", content: structuralAlertText }]);
        setLoading(false);
        return;
      }

      // Step D: Send entire history context array downstream to our Groq/OpenRouter broker
      const aiReply = await getHealthGuidance(updatedHistory);

      // Step E: Save successful diagnostic guidance payload returns
      await saveMessage(activeId, "assistant", aiReply);
      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);

    } catch (err) {
      console.error("Pipeline failure inside messaging runtime context:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ System was unable to fully commit or process this response to database nodes. Please check connection logs." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset & Instantiation Controller Trigger
  const startNewConversation = () => {
    setCurrentConvId(null);
    setMessages([
      {
        role: "assistant",
        content: `Let's start fresh, ${user.name}. What symptom or health topic are we exploring? 🌿`
      }
    ]);
  };

  const suggestions = [
    "I have a headache and slight fever",
    "Is agbo safe to drink regularly?",
    "How do I manage high blood pressure?",
    "What should I do if my malaria test is positive?",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Outfit', sans-serif", background: C.bg }}>
      
      {/* Sidebar Navigation Panel Frame */}
      {sidebarOpen && (
        <div style={{ width: 280, background: C.primary, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlaafiaLogo size={28} white />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: C.white }}>
                Alaafia
              </span>
            </div>
          </div>

          <div style={{ padding: "14px" }}>
            <button 
              onClick={startNewConversation} 
              style={{
                width: "100%", padding: "11px", borderRadius: 10, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)",
                color: C.white, fontFamily: "'Outfit', sans-serif", fontSize: "0.88rem", fontWeight: 500,
              }}
            >
              + Clear & New Chat
            </button>
          </div>

          <div style={{ padding: "12px 16px", flex: 1, overflowY: "auto" }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Quick Health Foundations
            </p>
            {["Malaria Control", "Hypertension Management", "Typhoid Facts", "Nigerian Nutrition", "OTC Safety Guide"].map(t => (
              <button 
                key={t} 
                onClick={() => handleSend(`Tell me what I need to know about ${t} in Nigeria.`)} 
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "10px 12px",
                  background: "transparent", border: "none", color: "rgba(255,255,255,0.75)",
                  fontSize: "0.88rem", cursor: "pointer", borderRadius: "6px"
                }}
              >
                📖 {t}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)" }}>
            <div style={{ color: C.white, fontSize: "0.85rem", marginBottom: 8, fontWeight: 500 }}>{user.name}</div>
            <button onClick={onSignOut} style={{ background: "none", border: "none", color: C.accentLight, cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>
              Sign Out Securely
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Stream Area Layout */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <header style={{ padding: "16px 24px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: C.primary }}>
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div style={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500 }}>
            {currentConvId ? `Active DB Instance: ${currentConvId}` : "New Document Thread Pending Init"}
          </div>
        </header>

        {/* Dynamic Bubble Render Stream Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 16, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: m.role === "user" ? C.accent : C.primary,
                  display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: "0.9rem"
                }}>
                  {m.role === "user" ? "👤" : <AlaafiaLogo size={20} white />}
                </div>
                <div style={{
                  background: m.role === "user" ? C.surface : C.bubble,
                  border: `1px solid ${C.border}`,
                  padding: "14px 18px", borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  maxWidth: "75%", whiteSpace: "pre-line", fontSize: "0.95rem", lineHeight: 1.6, color: C.text
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 16, alignItems: "center", color: C.muted, fontSize: "0.88rem" }}>
                <AlaafiaLogo size={20} /> Appending to Database & Querying AI Node Cluster...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Dock Interface Field Collection */}
        <div style={{ padding: "24px", background: C.white, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {messages.length <= 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSend(s)}
                    style={{
                      background: C.bg, border: `1px solid ${C.border}`, borderRadius: "20px",
                      padding: "8px 14px", fontSize: "0.82rem", color: C.text, cursor: "pointer",
                    }}
                  >
                    💡 {s}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe symptoms or ask local wellness realities..."
                style={{
                  flex: 1, padding: "14px 20px", borderRadius: "14px", border: `1.5px solid ${C.border}`,
                  outline: "none", fontSize: "0.95rem", fontFamily: "'Outfit', sans-serif"
                }}
              />
              <button onClick={() => handleSend()} style={btn("primary", { borderRadius: "14px", padding: "0 28px" })} disabled={loading}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}