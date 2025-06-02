 import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getAuth } from "firebase/auth";  // <-- import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyATr6k5e5fR5vCfJcatTWuJLho3I0WKLn4",
  authDomain: "society-report.firebaseapp.com",
  databaseURL: "https://society-report-default-rtdb.firebaseio.com",
  projectId: "society-report",
  storageBucket: "society-report.appspot.com",  
  messagingSenderId: "445474143531",
  appId: "1:445474143531:web:2306c639ac6458c81a196e",
  measurementId: "G-JJYMKQRFJM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const db = getDatabase(app);  

export { auth, db };
