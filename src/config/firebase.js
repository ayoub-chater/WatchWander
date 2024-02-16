import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth , signInWithEmailAndPassword , signOut } from "firebase/auth" ;
import { getFirestore } from "firebase/firestore";


// const firebaseConfig = {
//   apiKey: "AIzaSyCrUAOfTrVQUTMyXEVSjb-l5wS3e8VISt0",
//   authDomain: "react-efm-ismagi.firebaseapp.com",
//   projectId: "react-efm-ismagi",
//   storageBucket: "react-efm-ismagi.appspot.com",
//   messagingSenderId: "237171207442",
//   appId: "1:237171207442:web:79f30cc4359eeab86897cb",
//   measurementId: "G-45DZQPK7JX"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD9MgMtGQNyHZUjtSEbg5fKxFWKOv-SnAY",
  authDomain: "react-efm-ismagi-7159f.firebaseapp.com",
  projectId: "react-efm-ismagi-7159f",
  storageBucket: "react-efm-ismagi-7159f.appspot.com",
  messagingSenderId: "767166860308",
  appId: "1:767166860308:web:2ea53e71173327c9136b01",
  measurementId: "G-B2FKV201T4"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth( app ) ;
export const logIn = signInWithEmailAndPassword ;
export const signUp = createUserWithEmailAndPassword ;
export const logOut = signOut ;
export const db = getFirestore(app) ;
export default app ;