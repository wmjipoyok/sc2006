// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, addDoc, getDocs, Timestamp, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4zU0-igHFj_TDWXuTZ9BMwbtr8Z_kHkM",
    authDomain: "fir-c9c47.firebaseapp.com",
    databaseURL: "https://fir-c9c47.firebaseio.com",
    projectId: "fir-c9c47",
    storageBucket: "fir-c9c47.appspot.com",
    messagingSenderId: "732611892783",
    appId: "1:732611892783:web:518baf14f8076858af18da",
    storageBucket: "gs://fir-c9c47.appspot.com"
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


//window.onload = retrieveCarDetails();

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
            var make = doc.data().Brand;
            var model = doc.data().Model
            document.getElementById("Make").innerHTML = make;
            document.getElementById("Model").innerHTML = model;

            console.log(doc.data().CarOwner);
            console.log(localStorage.getItem("userId"));

            if (doc.data().CarOwner == localStorage.getItem("userId")) {
                document.getElementById("editBtn").removeAttribute('hidden');
            }
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
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

    const querySnapshot = await getDocs(collection(db, "Cars"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);

    })
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