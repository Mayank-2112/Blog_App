// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-61d8f.firebaseapp.com",
  projectId: "blog-app-61d8f",
  storageBucket: "blog-app-61d8f.appspot.com",
  messagingSenderId: "929817073988",
  appId: "1:929817073988:web:c1fbb2cfa6ff92384cdf11",
  measurementId: "G-B5PM8YJHV9"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);