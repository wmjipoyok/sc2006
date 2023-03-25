// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, addDoc, getDocs, Timestamp, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
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
const db = firebase.firestore();

// Initialize Cloud Storage
const storage = getStorage(app);
const storageRef = ref(storage);



//buttons
var bookBtn = document.querySelector("#bookBtn");

//retrieve selected car details on load
document.addEventListener('DOMContentLoaded', function () {
    retrieveCarDetails();
}, false);

//book button event listener
bookBtn.addEventListener('click', BookCar);


//functions 
async function retrieveCarDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const carId = urlParams.get('carId');
    db.collection("Cars").doc(carId).get().then((doc) => {
        if (doc.exists) {
            var carimg = doc.data().Images[0];
            var brand = doc.data().Brand;
            var model = doc.data().Model;
            var rating = doc.data().Rating;
            var seats = doc.data().Seats;
            var price = doc.data().Price;
            var description = doc.data().Description;

            getStarRatings(rating);

            document.getElementById("carimg").src = carimg;
            document.getElementById("BrandModel").innerHTML = brand + " " + model;
            //document.getElementById("Model").innerHTML = model;
            document.getElementById("Seats").innerHTML = seats + " seater";
            document.getElementById("Price").innerHTML = "$" + price + "/day";
            document.getElementById("Description").innerHTML = description;

            if (doc.data().CarOwner == localStorage.getItem("userId")) {
                document.getElementById("editBtn").removeAttribute('hidden');
            }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function getStarRatings(rating) {

    const starsTotal = 5;
    const starPercentage = (rating / starsTotal) * 100;
    const starPercentageRounded = `${Math.round(starPercentage)}%`
    console.log(starPercentageRounded)

    document.querySelector('.stars-inner').style.width = starPercentageRounded;
    document.querySelector('.number-rating').innerHTML = rating;

}

async function BookCar() {
    //get date and time selected by user
    var StartTrip = document.getElementById("StartTrip").value;
    var EndTrip = document.getElementById("EndTrip").value;

    //add into db, under "Bookings" Collection => need to change to users collection
    try {
        const docRef = await addDoc(collection(db, "Bookings"), {

            Start: StartTrip,
            End: EndTrip
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}






/*
            //writing into db
            try {
                const docRef = await addDoc(collection(db, "TestCars"), {
                    first: "Alan",
                    last: "Mathison",
                    born: 1912
            });
            console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            */

            //reading from db
/*
const querySnapshot = await getDocs(collection(db, "TestCars"));
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
});
*/