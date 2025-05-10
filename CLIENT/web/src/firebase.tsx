  import { initializeApp } from "firebase/app";
  import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    addDoc,
  } from "firebase/firestore";
  import { Chat, Message } from './types'; // Ensure the Chat type is imported

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
    return auth.currentUser;
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
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

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;

      console.log("Google sign-in successful:", user);

      return user;
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };


  const getUserChats = async (uid: string) => {
    const chatsRef = collection(db, "users", uid, "chats");
    const snapshot = await getDocs(chatsRef);

    const chats = await Promise.all(snapshot.docs.map(async doc => {
      const messages = await getMessagesForChat(uid, doc.id);
      return {
        id: doc.id,
        ...(doc.data() as Omit<Chat, 'id' | 'messages'>),
        messages,
      };
    }));

    return chats;
  };

  const getMessagesForChat = async (uid: string, chatId: string, limitCount = 50) => {
    const messagesRef = collection(db, "users", uid, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.text || data.content || '',
        sender: data.role === 'assistant' ? 'bot' : 'user',
        timestamp: new Date(data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000),
      } as Message;      
    });
  };


  const createChat = async (uid: string, chatData: Omit<Chat, 'id'>): Promise<Chat> => {
    try {
      console.log(`Creating chat for user ${uid} with data:`, chatData);
      
      // Validate input
      if (!uid) throw new Error("User ID is required");
      if (!chatData) throw new Error("Chat data is required");
      
      const { messages, ...chatMeta } = chatData;

      const chatRef = await addDoc(collection(db, 'users', uid, 'chats'), {
        ...chatMeta,
        timestamp: new Date().toISOString(),
      });

      console.log(`Chat document created with ID: ${chatRef.id}`);

      const messagesRef = collection(db, 'users', uid, 'chats', chatRef.id, 'messages');
      const messagePromises = messages.map(async (message) => {
        await addDoc(messagesRef, {
          text: message.content || '',
          role: message.sender === 'bot' ? 'assistant' : 'user',
          timestamp: new Date(),
        });
      });

      await Promise.all(messagePromises);
      console.log(`Added ${messages.length} messages to chat ${chatRef.id}`);

      return {
        id: chatRef.id,
        ...chatMeta,
        messages,
      };
      
    } catch (error) {
      console.error("Error in createChat:", error);
      throw error; 
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };


  export {
    signIn,
    signOutUser,
    signUp,
    getCurrentUser,
    getUserChats,
    getMessagesForChat,
    createChat,
    sendPasswordResetEmail,
    signInWithGoogle,
  };
