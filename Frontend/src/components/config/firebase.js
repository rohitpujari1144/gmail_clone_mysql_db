import { initializeApp } from "firebase/app";
import {  getAuth  } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyDwmq137axrRWupwaW9px1Sk1SDTSLKrM0",
    authDomain: "clone-25ae7.firebaseapp.com",
    projectId: "clone-25ae7",
    storageBucket: "clone-25ae7.appspot.com",
    messagingSenderId: "1028441764671",
    appId: "1:1028441764671:web:615527abec3e2387ec198a",
    measurementId: "G-X4B1H2BZGC"
  };

  const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)