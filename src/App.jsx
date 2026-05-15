import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import ChatPage from "./components/ChatPage";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "./services/api"; // Adjusted path to fit structure

export default function App() {
  // Navigation Routing States: "landing" | "auth"
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Inject Fonts & Check existing persistent sessions on initial boot
  useEffect(() => {
    // Dynamic Typography Injection
    if (!document.getElementById("alaafia-fonts")) {
      const link = document.createElement("link");
      link.id = "alaafia-fonts";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
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
      throw err; // Propagate down to Auth UI component layer to prevent view switches
    }
  };

  // 3. Real Login Async Core
  const handleLogin = async (email, password) => {
    try {
      const loggingUser = await loginUser(email, password);
      setUser(loggingUser);
    } catch (err) {
      alert("Wrong email or password");
      throw err; // Propagate down to Auth UI component layer to prevent view switches
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

  // 5. Global Initialization Loading Screen 
  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", 
        height: "100vh", background: "#FBF5EE", fontFamily: "'Outfit', sans-serif", color: "#2C1A0E"
      }}>
        <div style={{ textAlign: "center" }}>
          <h3>Checking session...</h3>
        </div>
      </div>
    );
  }

  // 6. Component Tree Router Mapping
  if (user) {
    return <ChatPage user={user} onSignOut={handleLogout} />;
  }

  if (view === "auth") {
    return (
      <AuthPage 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        onBack={() => setView("landing")} 
      />
    );
  }

  return <LandingPage onGetStarted={() => setView("auth")} />;
}