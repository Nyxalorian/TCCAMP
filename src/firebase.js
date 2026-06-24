import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdIu1RE64VLwQ5WqqcDfrWc9tZrEfF0Mc",
  authDomain: "pharmalife-81306.web.app",
  projectId: "pharmalife-81306",
  storageBucket: "pharmalife-81306.firebasestorage.app",
  messagingSenderId: "1059789863146",
  appId: "1:1059789863146:web:11b4ab6c8771e019dd3f93",
  measurementId: "G-XLK1NEMCY0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();