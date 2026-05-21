import React, { useState, useRef, useEffect } from "react";
import { C, btn, AlaafiaLogo } from "../config.jsx";
import { getHealthGuidance } from "../services/aiService";
import { createConversation, saveMessage, getMessages, getConversations, deleteConversation } from "../services/api";

export default function ChatPage({ user, onSignOut }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConvId, setCurrentConvId] = useState(null);
  
  // Storing the list of historical threads for the sidebar
  const [conversations, setConversations] = useState([]); 
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ─── Mobile Responsiveness State ───
  const [isMobile, setIsMobile] = useState(false);

  const bottomRef = useRef(null);

  // 1. Monitor Screen Size Changes for Mobile State Adjustment
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      // Automatically close sidebar on mobile entry to save space
      if (mobileView) setSidebarOpen(false);
    };

    handleResize(); // Run on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Sync past thread list on boot-up
  useEffect(() => {
    fetchUserConversations();
  }, [user.$id]);

  // 3. Set default welcoming greeting if screen is blank
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Alaafia, ${user.name}! 👋\n\nI'm here to help you understand your health better — your symptoms, your questions, your remedies. What's going on today?`,
        },
      ]);
    }
  }, [messages.length, user.name]);

  // 4. Scroll tracking anchor
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── SIDEBAR ARCHITECTURE LOGIC ───

  const fetchUserConversations = async () => {
    setLoadingHistory(true);
    try {
      const userThreads = await getConversations(user.$id); 
      if (Array.isArray(userThreads)) {
        setConversations(userThreads);
      }
    } catch (err) {
      console.error("Failed to sync recent conversation history stacks:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadActiveConversationThread = async (conversationId) => {
    if (loading) return; 
    setLoading(true);
    setCurrentConvId(conversationId);
    
    // Auto-close sidebar after selecting a chat on mobile devices
    if (isMobile) setSidebarOpen(false);
    
    try {
      const historicalBubbles = await getMessages(conversationId);
      
      if (historicalBubbles && historicalBubbles.length > 0) {
        const formattedStream = historicalBubbles.map(doc => ({
          role: doc.role || (doc.sender === "user" ? "user" : "assistant"),
          content: doc.content || doc.text
        }));
        setMessages(formattedStream);
      } else {
        setMessages([{ role: "assistant", content: "Conversation found, but no message history was recorded in this node." }]);
      }
    } catch (err) {
      console.error("Critical error reading thread record node paths:", err);
      setMessages([{ role: "assistant", content: "⚠️ Unable to load your chat history bubbles. Please check your data network connectivity." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (e, conversationId) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this conversation history?")) return;

    try {
      await deleteConversation(conversationId);
      if (currentConvId === conversationId) {
        startNewConversation();
      }
      setConversations(prev => prev.filter(c => c.$id !== conversationId));
    } catch (err) {
      console.error("Failed to delete the selected conversation item:", err);
      alert("Could not remove conversation entry. Please check server connection rules.");
    }
  };

  const checkEmergencyTriggers = (text) => {
    const criticalKeywords = [
      "chest pain", "breathing", "heart attack", "poison", "stroke", 
      "suicide", "self-harm", "bleeding heavily", "unconscious"
    ];
    return criticalKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSend = async (forcedText = null) => {
    const textToSend = forcedText || input.trim();
    if (!textToSend || loading) return;

    const updatedHistory = [...messages, { role: "user", content: textToSend }];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    if (isMobile) setSidebarOpen(false);

    let activeId = currentConvId;

    if (checkEmergencyTriggers(textToSend)) {
      const emergencyAlertText = "🚨 **CRITICAL NOTICE:** The symptoms you described require immediate professional evaluation. Please visit the nearest Emergency Room, General Hospital, or call primary emergency services right now. Do not wait out severe symptoms.";
      setMessages(prev => [...prev, { role: "assistant", content: emergencyAlertText }]);
      setLoading(false);

      try {
        if (!activeId) {
          const conv = await createConversation(user.$id, textToSend.slice(0, 40));
          activeId = conv.$id;
          setCurrentConvId(activeId);
          fetchUserConversations(); 
        }
        await saveMessage(activeId, "user", textToSend);
        await saveMessage(activeId, "assistant", emergencyAlertText);
      } catch (dbErr) {
        console.error("Background emergency logging failed:", dbErr);
      }
      return;
    }

    try {
      if (!activeId) {
        try {
          const chatSnippet = textToSend.slice(0, 40);
          const conversationDocument = await createConversation(user.$id, chatSnippet);
          activeId = conversationDocument.$id;
          setCurrentConvId(activeId);
          fetchUserConversations(); 
        } catch (convErr) {
          console.error("Appwrite failed to create conversation document:", convErr);
          throw new Error("DB_CONV_FAIL");
        }
      }

      try {
        await saveMessage(activeId, "user", textToSend);
      } catch (msgErr) {
        console.error("Appwrite failed to save user message:", msgErr);
      }

      let aiReply = "";
      try {
        aiReply = await getHealthGuidance(updatedHistory);
      } catch (aiErr) {
        console.error("AI Routing Engine failed:", aiErr);
        throw new Error("AI_ROUTING_FAIL");
      }

      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);

      try {
        await saveMessage(activeId, "assistant", aiReply);
      } catch (aiSaveErr) {
        console.error("Appwrite failed to save assistant message payload:", aiSaveErr);
      }

    } catch (err) {
      console.error("Pipeline failure inside messaging runtime context:", err);
      let customerFriendlyError = "⚠️ System was unable to process this response right now. Please check your network connection and try again.";
      if (err.message === "DB_CONV_FAIL") {
        customerFriendlyError = "⚠️ Unable to initialize safe database record. Please verify your Appwrite collections permissions.";
      } else if (err.message === "AI_ROUTING_FAIL") {
        customerFriendlyError = "⚠️ Connected to database, but AI network returned an authentication/timeout error. Check your GROQ API key config.";
      }
      setMessages(prev => [...prev, { role: "assistant", content: customerFriendlyError }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConvId(null);
    if (isMobile) setSidebarOpen(false);
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
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Outfit', sans-serif", background: C.bg, position: "relative", overflow: "hidden" }}>
      
      {/* ─── SIDEBAR PANEL WITH MOBILE SLIDE-OVER DRAWER LOGIC ─── */}
      {sidebarOpen && (
        <div style={{ 
          width: 280, 
          background: C.primary, 
          display: "flex", 
          flexDirection: "column", 
          flexShrink: 0,
          // Mobile Overlay Layer Properties Configuration
          position: isMobile ? "absolute" : "static",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 999,
          boxShadow: isMobile ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        }}>
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlaafiaLogo size={28} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: C.white }}>
                Alaafia
              </span>
            </div>
            {/* Direct Close Button inside sidebar frame for Mobile Users */}
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)} 
                style={{ background: "none", border: "none", color: C.white, fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            )}
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

          {/* DYNAMIC SAVED CHATS LIST CONTAINER */}
          <div style={{ padding: "0 14px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "10px 0 6px 6px" }}>
              Recent Conversations
            </p>
            {loadingHistory ? (
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", padding: "0 6px" }}>Syncing lists...</div>
            ) : conversations.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", padding: "0 6px", fontStyle: "italic" }}>No entries saved yet.</div>
            ) : (
              conversations.map((conv) => {
                const isSelected = currentConvId === conv.$id;
                return (
                  <div 
                    key={conv.$id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderRadius: "8px", position: "relative",
                      background: isSelected ? "rgba(255,255,255,0.15)" : "transparent",
                    }}
                  >
                    <button
                      onClick={() => loadActiveConversationThread(conv.$id)}
                      style={{
                        flex: 1, textAlign: "left", padding: "10px 36px 10px 12px", 
                        border: "none", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s",
                        background: "transparent",
                        color: isSelected ? C.white : "rgba(255,255,255,0.7)",
                        fontWeight: isSelected ? 500 : 400,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}
                    >
                      💬 {conv.title || conv.name || `Session ${conv.$id.slice(-4)}`}
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteChat(e, conv.$id)}
                      title="Delete conversation log"
                      style={{
                        background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
                        color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", 
                        justifyContent: "center", transition: "color 0.2s", fontSize: "0.85rem"
                      }}
                      onMouseEnter={(e) => e.target.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)" }}>
            <div style={{ color: C.white, fontSize: "0.85rem", marginBottom: 8, fontWeight: 500 }}>{user.name}</div>
            <button onClick={onSignOut} style={{ background: "none", border: "none", color: C.accentLight, cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>
              Sign Out Securely
            </button>
          </div>
        </div>
      )}

      {/* Transparent Click-away Dark Tint Layer for Mobile Menu Dismissal */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 998 }}
        />
      )}

      {/* MAIN WORKSPACE LAYOUT CONTAINER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
        <header style={{ padding: isMobile ? "12px 16px" : "16px 24px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: C.primary, padding: "4px" }}>
            {sidebarOpen ? "✕" : "☰"}
          </button>
          {isMobile && (
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: C.primary }}>
              Alaafia Chat
            </span>
          )}
        </header>

        {/* MESSAGING STREAM */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "32px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: isMobile ? 10 : 16, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                <div style={{
                  width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: "50%", flexShrink: 0,
                  background: m.role === "user" ? C.accent : C.white,
                  border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
                }}>
                  {m.role === "user" ? (
                    <span style={{ color: C.white, fontSize: isMobile ? "0.8rem" : "0.9rem" }}>👤</span>
                  ) : (
                    <AlaafiaLogo size={isMobile ? 32 : 36} />
                  )}
                </div>
                <div style={{
                  background: m.role === "user" ? C.surface : C.bubble,
                  border: `1px solid ${C.border}`,
                  padding: isMobile ? "10px 14px" : "14px 18px", 
                  borderRadius: m.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  maxWidth: isMobile ? "85%" : "75%", whiteSpace: "pre-line", fontSize: isMobile ? "0.9rem" : "0.95rem", lineHeight: 1.5, color: C.text
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", color: C.muted, fontSize: "0.85rem", paddingLeft: 4 }}>
                <AlaafiaLogo size={20} /> Synchronizing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT DOCK CONTAINER */}
        <div style={{ padding: isMobile ? "12px" : "24px", background: C.white, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            
            {/* Recommendations row adjusting to overflow wrapping configurations cleanly on smartphones */}
            {messages.length <= 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSend(s)}
                    style={{
                      background: C.bg, border: `1px solid ${C.border}`, borderRadius: "20px",
                      padding: isMobile ? "6px 12px" : "8px 14px", fontSize: isMobile ? "0.78rem" : "0.82rem", color: C.text, cursor: "pointer",
                      whiteSpace: isMobile ? "nowrap" : "normal"
                    }}
                  >
                    💡 {s}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe symptoms..."
                style={{
                  flex: 1, padding: isMobile ? "12px 16px" : "14px 20px", borderRadius: "14px", border: `1.5px solid ${C.border}`,
                  outline: "none", fontSize: isMobile ? "0.9rem" : "0.95rem", fontFamily: "'Outfit', sans-serif"
                }}
              />
              <button onClick={() => handleSend()} style={btn("primary", { borderRadius: "14px", padding: isMobile ? "0 20px" : "0 28px", fontSize: isMobile ? "0.9rem" : "1rem" })} disabled={loading}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}