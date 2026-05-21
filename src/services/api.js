import { account, databases, ID } from "../appwrite";
import { Query } from "appwrite";

const DB_ID = "6a077e5a0026b4d09df6";
const CONV_ID = "conversations";
const MSG_ID = "6a0780ca002716371ac8";

// ─── AUTHENTICATION LAYER ─────────────────────────────────

export const registerUser = async (name, email, password) => {
  try {
    await account.create(ID.unique(), email, password, name);
    return await loginUser(email, password);
  } catch (error) {
    console.error("Appwrite Core Registration Pipeline Error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    await account.createEmailPasswordSession(email, password);
    return await account.get(); // Returns the authenticated user object metadata
  } catch (error) {
    console.error("Appwrite Core Authentication Pipeline Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Appwrite Session Termination Pipeline Error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null; // Silent fallback: returns null safely to App.jsx route switches if token is unassigned
  }
};

// ─── CONVERSATIONS ARCHITECTURE ─────────────────────────

export const getConversations = async (userId) => {
  try {
    const res = await databases.listDocuments(DB_ID, CONV_ID, [
      Query.equal("user_id", userId),
      Query.orderDesc("$createdAt"), // Keeps most recent conversation items on top of user viewports
    ]);
    return res.documents;
  } catch (error) {
    console.error("Appwrite Error loading user-specific threads list:", error);
    throw error;
  }
};

export const createConversation = async (userId, title = "New Conversation") => {
  try {
    return await databases.createDocument(DB_ID, CONV_ID, ID.unique(), {
      user_id: userId,
      title,
    });
  } catch (error) {
    console.error("Appwrite Error instantiating new conversation node:", error);
    throw error;
  }
};

export const deleteConversation = async (convId) => {
  try {
    return await databases.deleteDocument(DB_ID, CONV_ID, convId);
  } catch (error) {
    console.error("Appwrite Error removing structured thread instance document:", error);
    throw error;
  }
};

// ─── MESSAGES ARCHITECTURE ──────────────────────────────

export const getMessages = async (convId) => {
  try {
    const res = await databases.listDocuments(DB_ID, MSG_ID, [
      Query.equal("conversation_id", convId),
      Query.orderAsc("$createdAt"), // Chronological alignment layout order for dialogue bubbles stream
    ]);
    return res.documents;
  } catch (error) {
    console.error("Appwrite Error retrieving history tokens inside explicit room context:", error);
    throw error;
  }
};

export const saveMessage = async (convId, role, content) => {
  try {
    return await databases.createDocument(DB_ID, MSG_ID, ID.unique(), {
      conversation_id: convId,
      role,
      content,
    });
  } catch (error) {
    console.error("Appwrite Error creating immutable bubble record node:", error);
    throw error;
  }
};