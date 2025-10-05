// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add your own Firebase configuration from the Firebase console.
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project.
// 3. Go to Project Settings > General tab.
// 4. In the "Your apps" card, select the Web app icon (</>).
// 5. Register your app and copy the firebaseConfig object here.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
