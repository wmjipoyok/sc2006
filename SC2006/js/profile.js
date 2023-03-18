import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



// Initialize Firebase
const firebaseConfig = {
   apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
       authDomain: "sc2006-1d9b8.firebaseapp.com",
       projectId: "sc2006-1d9b8",
       storageBucket: "sc2006-1d9b8.appspot.com",
       messagingSenderId: "18363617474",
       appId: "1:18363617474:web:de5535d545b6169e532b5b",
       measurementId: "G-NCKVJ8K4JJ"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


//get user's ID
const userID = firebase.auth().currentUser.uid;


//get user's doc from "Users" collection
db.collection("Users").doc(userID).get().then((doc) => {
   if (doc.exists) {
       //retrieve user data from doc
       const userData = doc.data();
       const firstName = userData.FirstName;
       const lastName = userData.LastName;
       const email = userData.Email;


       //update DOM with retrieved data
       document.getElementById("user-fname").innerHTML = firstName;
       document.getElementById("user-lname").innerHTML = lastName;
       document.getElementById("user-email").innerHTML = email;
   } else {
       console.log("No such document!");
   }
}).catch((error) => {
   console.log("Error getting document:", error);
});
