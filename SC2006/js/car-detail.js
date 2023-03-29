// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, Timestamp, query, where, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
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
    document.getElementById("editCarUrl").href = "car-form.html?request=edit&carId=" + carId;
    $(function () {
        $("#nav-content").load("nav.html");
        $("#logout-model").load("logout-model.html");
    });

    retrieveCarDetails(carId);
}, false);

//buttons
var bookBtn = document.querySelector("#bookBtn");

//book button event listener
bookBtn.addEventListener('click', function () { BookCar(carId) });


//functions 
async function retrieveCarDetails(carId) {

    //read db using car's id
    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const dataSnap = docSnap.data();

    if (!dataSnap) {
        errorHandle("No car information found.");
        return;
    }

    const ownerSnap = doc(db, "Users", docSnap.data().CarOwner);
    const ownerDocSnap = await getDoc(ownerSnap);
    const ownerDataSnap = ownerDocSnap.data();

    if (!ownerDataSnap) {
        errorHandle("Unable to reterive car owner information.");
        return;
    }

    //get individual data from db
    var brand = dataSnap.Brand;
    var model = dataSnap.Model;
    var rating = dataSnap.Rating;
    var seats = dataSnap.Seats;
    var price = dataSnap.Price;
    var description = dataSnap.Description;

    //function to display stars
    getStarRatings(rating);

    //update fields in the page
    document.getElementById("BrandModel").innerHTML = brand + " " + model;
    document.getElementById("Seats").innerHTML = seats + " seater";
    document.getElementById("Price").innerHTML = "$" + price + "/day";
    document.getElementById("Description").innerHTML = description;


    if (dataSnap.CarOwner == localStorage.getItem("userId") && dataSnap.Status == 0) {
        document.getElementById("editBtn").removeAttribute('hidden');
        document.getElementById("delete").removeAttribute('hidden');
    } else if (dataSnap.CarOwner == localStorage.getItem("userId") && dataSnap.Status == 1) {
        // TODO: Change to renter name
        document.getElementById("UserName").innerHTML = ownerDataSnap.FirstName + " " + ownerDataSnap.LastName;
        document.getElementById("userInfo").removeAttribute("hidden");
        document.getElementById("bookBtn").setAttribute("hidden", true);
        document.getElementById("Booking").removeAttribute("hidden");
        document.getElementById("pendingOwner").removeAttribute('hidden');

        // TODO: retrieve trip start and end from booking
    } else if (dataSnap.Status == 0) {
        document.getElementById("UserName").innerHTML = ownerDataSnap.FirstName + " " + ownerDataSnap.LastName;
        document.getElementById("userInfo").removeAttribute();
        document.getElementById("Booking").removeAttribute('hidden');
    }

    for (let i = 0; i < dataSnap.Images.length; i++) {
        document.getElementById("imageContainer").innerHTML += `<div class="mySlides">
        <img src="${dataSnap.Images[i]}" class="slideshow-img" alt="image"></div>`
        document.getElementById("dotContatiner").innerHTML += `<span class="dot" onclick="currentSlide(${i + 1})"></span>`
    }

    document.getElementById("imageContainer").innerHTML += `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
    <a class="next" onclick="plusSlides(1)">&#10095;</a>`

    var head = document.getElementsByTagName('HEAD')[0];
    let jsScript = document.createElement('script');
    jsScript.src = './js/slideshow.js';
    head.appendChild(jsScript);

    document.getElementById("carInfoContainer").removeAttribute('hidden');
    document.getElementById("loading").setAttribute('hidden', true);
}

function errorHandle(msg) {
    document.getElementById("errorMsg").innerHTML = msg;
    document.getElementById("errorMsg").removeAttribute('hidden');
    document.getElementById("loading").setAttribute('hidden', true);
}

function getStarRatings(rating) {

    const starsTotal = 5;
    const starPercentage = (rating / starsTotal) * 100;
    const starPercentageRounded = `${Math.round(starPercentage)}%`

    document.querySelector('.stars-inner').style.width = starPercentageRounded;
    document.querySelector('.number-rating').innerHTML = rating;

}

// function addSlideshowJS() {
//     var head = document.getElementsByTagName('HEAD')[0];
//     let jsScript = document.createElement('script');
//     jsScript.src = './js/slideshow.js';
//     head.appendChild(jsScript);
// }

function checkBooking() {
    const start = document.getElementById("StartTrip");
    const tripDateError = document.getElementById("tripDateError");
    const end = document.getElementById("EndTrip");

    if (start.value == "") {
        start.style.borderColor = "red";
        tripDateError.innerHTML = "Trip start date cannot be empty";
        tripDateError.removeAttribute("hidden");
        return false;
    } else {
        start.style.borderColor = "";
        tripDateError.setAttribute("hidden", true);
    }

    if (end.value == "") {
        end.style.borderColor = "red";
        tripDateError.innerHTML = "Trip end date cannot be empty";
        tripDateError.removeAttribute("hidden");
        return false;
    } else {
        end.style.borderColor = "";
        tripDateError.setAttribute("hidden", true);
    }

    if (start.value > end.value) {
        start.style.borderColor = "red";
        tripDateError.innerHTML = "Start date cannot occur after the end date";
        tripDateError.removeAttribute("hidden");
        return false;
    } else {
        start.style.borderColor = "";
        tripDateError.setAttribute("hidden", true);
    }
    return true;
}

async function BookCar(carId) {

    const validation = checkBooking();
    if (!validation) {
        return;
    }

    //get date and time selected by user
    const StartTrip = document.getElementById("StartTrip").value;
    const EndTrip = document.getElementById("EndTrip").value;

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);

    //get car's status
    const carStatus = docSnap.data().Status;
    const carOwner = docSnap.data().CarOwner;

    //check if car is available
    if (carStatus == 0) {

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
            sendMessage(carOwner, bookingRef.id);
            saveMessageToDb(carId, carOwner, bookingRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }

        //update car's availabilty status
        try {
            const carRef = doc(db, "Cars", carId);
            await updateDoc(carRef, {
                Status: 1
            });
            console.log("Car status updated");
        } catch (e) {
            console.error("Error updating status: ", e);
        }
    }
}

function sendMessage(carOwner, bookingId) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    var data = {
        'to': localStorage.getItem("currToken"),
        'data': {
            'senderId': localStorage.getItem("userId"),
            'receiverId': carOwner,
            'carId': carId,
            'bookingId': bookingId,
            'message': `A new booking request from ${document.getElementById("nav-name").innerHTML}.`
        }
    }

    xhr.open('POST', "https://fcm.googleapis.com/fcm/send", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader('Authorization', 'key=AAAABEaOkMI:APA91bENkRgqPANjMwEuYQWPxl9EC0-0S5FU4KfDPK_Yucd3-oZy2UsDPMdx6l5AHfL5dvWCi5wbBrV6vDxOGNUwLoCWrQtZecCJmA3R7Zf8ful8xNNNYW4cCX__4yVfSaCxSTyvIBa8');
    xhr.send(JSON.stringify(data));
}

async function saveMessageToDb(carId, carOwner, bookingId) {
    try {
        const messageRef = await addDoc(collection(db, "Messages"), {
            ReceiverId: carOwner,
            Sender: localStorage.getItem("userId"),
            CarId: carId,
            BookingId: bookingId,
            Message: `A new booking request from ${document.getElementById("nav-name").innerHTML}.`,
            DateTime: new Date().toLocaleDateString()
        });
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