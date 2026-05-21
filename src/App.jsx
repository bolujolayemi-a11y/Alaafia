import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage";     
import PrivacyPage from "./components/PrivacyPage"; 
import { AlaafiaLogo } from "./config.jsx"; // 👍 Imported logo asset to support the inline loading presentation
import { registerUser, loginUser, logoutUser, getCurrentUser } from "./services/api";

export default function App() {
  // Navigation Routing States: "landing" | "auth" | "about" | "privacy"
  const [view, setView] = useState("landing");
  // Sub-route state manager to pass direct focus down to specific tabs inside AuthPage
  const [authMode, setAuthMode] = useState("signup"); 
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Inject Fonts, Keyframes & Check existing persistent sessions on initial boot
  useEffect(() => {
    // Dynamic Typography & Core Brand Animation Keyframes Injection
    if (!document.getElementById("alaafia-fonts")) {
      const link = document.createElement("link");
      link.id = "alaafia-fonts";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // Injecting a clean CSS pulsing keyframe for the initialization splash mark
      const styleSheet = document.createElement("style");
      styleSheet.innerText = `
        @keyframes alaafiaPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.04); }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Checking Active User State via your API SDK
    getCurrentUser()
      .then((authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
        }
      })
      .catch((err) => console.error("Session verification failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Real Registration Async Core
  const handleRegister = async (name, email, password) => {
    try {
      const newUser = await registerUser(name, email, password);
      setUser(newUser);
    } catch (err) {
      alert(err.message || "An error occurred during registration.");
      throw err; 
    }
  };

  // 3. Real Login Async Core
  const handleLogin = async (email, password) => {
    try {
      const loggingUser = await loginUser(email, password);
      setUser(loggingUser);
    } catch (err) {
      alert("Wrong email or password");
      throw err; 
    }
  };

  // 4. Real Logout Async Core
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout encounter error context:", err);
    } finally {
      setUser(null);
      setView("landing");
    }
  };

  // ─── CONNECT TRAFFIC ROUTER ───
  const handleGetStartedRouting = (targetMode) => {
    if (targetMode === "about" || targetMode === "privacy") {
      setView(targetMode);
    } else {
      setAuthMode(targetMode); 
      setView("auth"); 
    }
  };

  // 5. 👍 Premium Global Initialization Loading Screen with integrated side logo
  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", 
        height: "100vh", background: "#FBF5EE", fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          animation: "alaafiaPulse 2s infinite ease-in-out",
          userSelect: "none"
        }}>
          <AlaafiaLogo size={32} />
          <h3 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: "1.6rem", 
            fontWeight: 700, 
            color: "#2C1A0E",
            letterSpacing: "-0.01em",
            margin: 0
          }}>
            Alaafia
          </h3>
        </div>
      </div>
    );
  }

  // 6. Component Tree Router Mapping
  if (user) {
    return <ChatPage user={user} onSignOut={handleLogout} />;
  }

  if (view === "about") {
    return <AboutPage onBack={() => setView("landing")} />;
  }

  if (view === "privacy") {
    return <PrivacyPage onBack={() => setView("landing")} />;
  }

  if (view === "auth") {
    return (
      <AuthPage 
        initialMode={authMode} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        onBack={() => setView("landing")} 
      />
    );
  }

  return <LandingPage onGetStarted={handleGetStartedRouting} />;
}