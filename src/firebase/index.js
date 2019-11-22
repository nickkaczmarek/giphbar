// Firebase App (the core Firebase SDK) is always required
// and must be listed first
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIeMxSEAoe0we6yuW2EKq0u5p354_C-Kg",
  authDomain: "giphbar.firebaseapp.com",
  databaseURL: "https://giphbar.firebaseio.com",
  projectId: "giphbar",
  storageBucket: "giphbar.appspot.com",
  messagingSenderId: "219019117526",
  appId: "1:219019117526:web:0c4bc62e91832f8113da77",
  measurementId: "G-DC1PV2JW2C",
};

const userCollection = "users";

const initFirebase = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
};

const createUser = userDTO => {
  const db = firebase.firestore();
  db.collection(userCollection)
    .doc(userDTO.user.email)
    .set(userDTO)
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
};

const updateGifsForUser = ({ userEmail, gifs, gif_Ids }) => {
  const db = firebase.firestore();
  db.collection(userCollection)
    .doc(userEmail)
    .update({ gifs, gif_Ids })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};

const getGifsForUser = async userEmail => {
  const db = firebase.firestore();
  const usersRef = db.collection(userCollection);
  try {
    let userFromFirebase = await usersRef.doc(userEmail).get();
    return userFromFirebase.data();
  } catch (error) {
    console.error("Error retrieving document", error);
  }
};

const deleteGif = async (userDTO, gif) => {
  const db = firebase.firestore();
  let gifs = userDTO.gifs.filter(g => g.id !== gif.id);
  let gif_Ids = gifs.map(g => g.id);
  const usersRef = db.collection(userCollection);

  try {
    await usersRef.doc(userDTO.user.email).update({ gifs, gif_Ids });
    console.log("Document successfully updated!");
    let userFromFirebase = await usersRef.doc(userDTO.user.email).get();
    return userFromFirebase;
  } catch (error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
  }
};

export default firebase;
export {
  initFirebase,
  createUser,
  getGifsForUser,
  updateGifsForUser,
  deleteGif,
};
