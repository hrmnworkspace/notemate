// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTcKgIIizTfbw-HddVF76SSsH6IeKkn3w",
  authDomain: "notemate-25cba.firebaseapp.com",
  databaseURL: "https://notemate-25cba-default-rtdb.firebaseio.com",
  projectId: "notemate-25cba",
  storageBucket: "notemate-25cba.firebasestorage.app",
  messagingSenderId: "608450565635",
  appId: "1:608450565635:web:088027c977e8bb1847e036",
  measurementId: "G-SVQ50EL1VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);