import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyC7V4N_2f41yEfbnyGNfWprvasiyraqMPI",
    authDomain: "new-project-f6bde.firebaseapp.com",
    databaseURL: "https://new-project-f6bde-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "new-project-f6bde",
    storageBucket: "new-project-f6bde.appspot.com",
    messagingSenderId: "214308653942",
    appId: "1:214308653942:web:2a80f994e08e01d9e20857",
    measurementId: "G-2DCGRCTQDV"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);

export default firebaseConfig