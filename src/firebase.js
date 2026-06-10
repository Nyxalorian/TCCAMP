// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdIu1RE64VLwQ5WqqcDfrWc9tZrEfF0Mc",
  authDomain: "pharmalife-81306.firebaseapp.com",
  projectId: "pharmalife-81306",
  storageBucket: "pharmalife-81306.firebasestorage.app",
  messagingSenderId: "1059789863146",
  appId: "1:1059789863146:web:11b4ab6c8771e019dd3f93",
  measurementId: "G-XLK1NEMCY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);