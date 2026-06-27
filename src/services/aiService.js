import { SYSTEM_PROMPT } from "../config.jsx"; // Assuming config.jsx change from before

// Vite requires the VITE_ prefix to securely expose keys to your frontend client
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Main AI Query Broker
 * Tries Groq (Primary, Ultra Fast) -> Falls back to OpenRouter (Secondary)
 */
export async function getHealthGuidance(chatHistory) {
  // Helpful developer check if your keys aren't loading properly
  if (!GROQ_API_KEY) {
    console.error("Vite Key Check: VITE_GROQ_API_KEY is undefined. Did you create your local .env file?");
  }

  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory.map(m => ({ role: m.role, content: m.content }))
  ];

  try {
    // 1. Try Groq Cloud First (Instant Model)
    return await callGroq(formattedMessages);
  } catch (groqError) {
    console.warn("Groq failed or timed out. Redirecting traffic to OpenRouter fallback layer...", groqError);
    
    try {
      // 2. Fallback to OpenRouter Layer
      return await callOpenRouter(formattedMessages);
    } catch (openRouterError) {
      console.error("All available AI network layers are currently unreachable.", openRouterError);
      // Changed to AI_ROUTING_FAIL so ChatPage can give an accurate error message
      throw new Error("AI_ROUTING_FAIL");
    }
  }
}

async function callGroq(messages) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: messages,
      temperature: 0.5,
      max_tokens: 800
    })
  });

  if (!response.ok) throw new Error(`Groq returned error status: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenRouter(messages) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://alaafia-xi.netlify.app",
      "X-Title": "Alaafia"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: messages,
      temperature: 0.6
    })
  });

  if (!response.ok) throw new Error(`OpenRouter returned error status: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}