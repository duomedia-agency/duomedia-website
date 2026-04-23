// ============ FIREBASE CONFIG ============
const firebaseConfig = {
    apiKey: "AIzaSyDbCNWdTKrHRT7XGJxOOy20Be9GEVo3v9k",
    authDomain: "duomedia-website.firebaseapp.com",
    projectId: "duomedia-website",
    storageBucket: "duomedia-website.firebasestorage.app",
    messagingSenderId: "1082009699937",
    appId: "1:1082009699937:web:5b8bd192390fa1521c8c20",
    measurementId: "G-JFJEDR2ZMM"
};

// Initialize Firebase (compat SDK — used via CDN scripts in index.html)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
