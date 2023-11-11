import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAD8hpzJioVCIwVvwN73yP6A6jrPlQ4hfI",
  authDomain: "instagram-clone-82bc8.firebaseapp.com",
  databaseURL: "https://instagram-clone-82bc8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "instagram-clone-82bc8",
  storageBucket: "instagram-clone-82bc8.appspot.com",
  messagingSenderId: "219763007534",
  appId: "1:219763007534:web:275d2af674b02cca9a7fbf",
  measurementId: "G-TEBEYDEKF4",
};

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
export {firebase, storage};
