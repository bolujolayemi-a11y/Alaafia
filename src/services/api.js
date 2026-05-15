import { account, databases, ID } from "../appwrite";
import { Query } from "appwrite";

const DB_ID = "6a077e5a0026b4d09df6";
const CONV_ID = "conversations";
const MSG_ID = "6a0780ca002716371ac8";

// ─── AUTH ─────────────────────────────────

export const registerUser = async (name, email, password) => {
  await account.create(ID.unique(), email, password, name);
  return loginUser(email, password);
};

export const loginUser = async (email, password) => {
  await account.createEmailPasswordSession(email, password);
  return account.get(); // returns the logged-in user
};

export const logoutUser = async () => {
  await account.deleteSession("current");
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null; // not logged in
  }
};

// ─── CONVERSATIONS ─────────────────────────

export const getConversations = async (userId) => {
  const res = await databases.listDocuments(DB_ID, CONV_ID, [
    Query.equal("user_id", userId),
    Query.orderDesc("$createdAt"),
  ]);
  return res.documents;
};

export const createConversation = async (userId, title = "New Conversation") => {
  return databases.createDocument(DB_ID, CONV_ID, ID.unique(), {
    user_id: userId,
    title,
  });
};

export const deleteConversation = async (convId) => {
  return databases.deleteDocument(DB_ID, CONV_ID, convId);
};

// ─── MESSAGES ──────────────────────────────

export const getMessages = async (convId) => {
  const res = await databases.listDocuments(DB_ID, MSG_ID, [
    Query.equal("conversation_id", convId),
    Query.orderAsc("$createdAt"),
  ]);
  return res.documents;
};

export const saveMessage = async (convId, role, content) => {
  return databases.createDocument(DB_ID, MSG_ID, ID.unique(), {
    conversation_id: convId,
    role,
    content,
  });
};