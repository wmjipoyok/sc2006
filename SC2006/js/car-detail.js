// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, Timestamp, query, where, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
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
var bookBtn = document.querySelector("#bookBtn");

//book button event listener
bookBtn.addEventListener('click', function() { BookCar(carId) });


//functions 
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

async function BookCar(carId) {

    //get date and time selected by user
    const StartTrip = document.getElementById("StartTrip").value;
    const EndTrip = document.getElementById("EndTrip").value;

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);

    //get car's status
    const carStatus = docSnap.data().Status;

    //check if car is available
    if(carStatus == 0){

        //update Booking in db and the BookingId into individual users
        try {
            const bookingRef = await addDoc(collection(db, "Bookings"), {
                
                UserId: localStorage.getItem("userId"),
                CarId: carId,
                Start: StartTrip,
                End: EndTrip

            });
            console.log("Booking written with ID: ", bookingRef.id);

            const userRef = doc(db, "Users", localStorage.getItem("userId"));
            await updateDoc(userRef, {
                Booking: arrayUnion(bookingRef.id)
            });
            console.log("Booking stored in Users with ID: ");

        } catch (e) {
            console.error("Error adding document: ", e);
        }
        
        //update car's availabilty status to pending
        try {
            const carRef = doc(db, "Cars", carId);
            await updateDoc(carRef, {
                Status: 1
        });
        console.log("Car status updated");
        } catch (e) {
            console.error("Error updating status: ", e);
        }

        alert("Booking Success!");
        window.location.href = "profile.html";
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
           

            //reading from db

            const querySnapshot = await getDocs(collection(db, "TestCars"));
            querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            });


            //update db

            import { doc, updateDoc } from "firebase/firestore";

            const washingtonRef = doc(db, "cities", "DC");

            // Set the "capital" field of the city 'DC'
            await updateDoc(washingtonRef, {
                capital: true
            });
*/