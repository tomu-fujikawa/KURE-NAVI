// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCRJVhawhydRbxuyyfm15kzjBKQjCWkTc",
  authDomain: "kure-navi-834f5.firebaseapp.com",
  projectId: "kure-navi-834f5",
  storageBucket: "kure-navi-834f5.firebasestorage.app",
  messagingSenderId: "700939490843",
  appId: "1:700939490843:web:c2c8359896325f84be8abe",
  measurementId: "G-3B409MMJK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;
