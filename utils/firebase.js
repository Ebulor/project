// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_TSopuE6ISEy3yQszr1d4sadYfk-e1yA",
  authDomain: "bsc-project-f4b07.firebaseapp.com",
  projectId: "bsc-project-f4b07",
  storageBucket: "bsc-project-f4b07.appspot.com",
  messagingSenderId: "460775615116",
  appId: "1:460775615116:web:513adb5f4833fd11dc69a9",
  measurementId: "G-1MH4YBJFCJ",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);

//console.log(firebaseConfig)
