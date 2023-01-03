import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCty0PCojgNDGzJ7-3We5_wpvRPfy5d5Cg",
    authDomain: "encuestasapp-f1167.firebaseapp.com",
    projectId: "encuestasapp-f1167",
    storageBucket: "encuestasapp-f1167.appspot.com",
    messagingSenderId: "597347574642",
    appId: "1:597347574642:web:3b3583a148e678725bf3eb",
    measurementId: "G-6XSJYSET6R"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth, db, storage }