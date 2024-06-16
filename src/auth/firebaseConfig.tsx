// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB60xmPWpN6CLLq4x2LYqYwd7rp9bv_4s8",
  authDomain: "projectsummary-aebf9.firebaseapp.com",
  projectId: "projectsummary-aebf9",
  storageBucket: "projectsummary-aebf9.appspot.com",
  messagingSenderId: "322846357190",
  appId: "1:322846357190:web:91d4194d27299ff81f09c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("App name for Firebase: ", app.name);  // "[DEFAULT]"
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;