
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEIvsUqhH5xLrhy4ofxq-xBoZ9H1B_Dzs",
  authDomain: "pantry-tracker-7fd83.firebaseapp.com",
  projectId: "pantry-tracker-7fd83",
  storageBucket: "pantry-tracker-7fd83.appspot.com",
  messagingSenderId: "759392023069",
  appId: "1:759392023069:web:40cb1eaad81ee3f57fb134",
  measurementId: "G-P3WCXMHNFY",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;