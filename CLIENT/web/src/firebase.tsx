import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } else {
    return null;
  }
};

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

const getUserChats = async (uid: string) => {
  const chatsRef = collection(db, "users", uid, "chats");
  const snapshot = await getDocs(chatsRef);
  const chats = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return chats;
};

const getMessagesForChat = async (uid: string, chatId: string, limitCount = 50) => {
  const messagesRef = collection(db, "users", uid, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return messages.reverse(); 
};

export {
  signIn,
  signOutUser,
  getCurrentUser,
  getUserChats,
  getMessagesForChat,
};
