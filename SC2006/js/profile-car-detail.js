// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, arrayRemove, Timestamp, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    databaseURL: "https://sc2006-1d9b8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sc2006-1d9b8",
    storageBucket: "sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Cloud Storage
const storage = getStorage(app);
const storageRef = ref(storage);



//get carID from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const carId = urlParams.get('carId');



//retrieve selected car details on load
window.addEventListener('load', function () {
    retrieveCarDetails(carId);
}, false);

//buttons
//var bookBtn = document.querySelector("#bookBtn");
var delBtn = document.getElementById("deleteCarBtn");

//book button event listener
//bookBtn.addEventListener('click', function() { BookCar(carId) });
delBtn.addEventListener('click', function() { confirmDelete(carId)});


//functions 
function confirmDelete(carId) {
    var result = confirm("Are you sure you want to delete this car?");
    if (result) {
        //user clicked ok.. delete car....

        //getting user id
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in.
                const userID = user.uid;
                
                const userRef = doc(db, "Users", userID);
                updateDoc(userRef, {
                    CarsOwned: arrayRemove(carId) //FOR NOW NOT DELETING THE CAR OBJECT... just deleting from the user object so it wont appear in profile anymore
                }).then(() => {
                    // redirect to profile page
                    window.location.href = "profile.html";
                }).catch((error) => {
                    console.error("Error removing car from array: ", error);
                });
                console.log("Car Deleted");
            }
        });
      
    } else {
        //user clicked cancel.. do nothing
    }
}
  

async function retrieveCarDetails(carId) {
    
    //read db using car's id
    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);

    //get individual data from db
    var carimg = docSnap.data().Images[0];
    var brand = docSnap.data().Brand;
    var model = docSnap.data().Model;
    var rating = docSnap.data().Rating;
    var seats = docSnap.data().Seats;
    var price = docSnap.data().Price;
    var description = docSnap.data().Description;

    //function to display stars
    getStarRatings(rating);

    //update fields in the page
    document.getElementById("carimg").src = carimg;
    document.getElementById("BrandModel").innerHTML = brand + " " + model;
    document.getElementById("Seats").innerHTML = seats + " seater";
    document.getElementById("Price").innerHTML = "$" + price + "/day";
    document.getElementById("Description").innerHTML = description;

    if (docSnap.data().CarOwner == localStorage.getItem("userId")) {
        document.getElementById("editBtn").removeAttribute('hidden');
    }

    document.getElementById("loading").setAttribute('hidden', true);
}
            

function getStarRatings(rating) {

    const starsTotal = 5;
    const starPercentage = (rating / starsTotal) * 100;
    const starPercentageRounded = `${Math.round(starPercentage)}%`

    document.querySelector('.stars-inner').style.width = starPercentageRounded;
    document.querySelector('.number-rating').innerHTML = rating;

}