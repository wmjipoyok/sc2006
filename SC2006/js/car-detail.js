// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, Timestamp, query, where, arrayUnion, arrayRemove, deleteDoc, deleteField  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
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
//var bookBtn = document.querySelector("#bookBtn");
var acceptBtn = document.querySelector("#acceptBtn");
var rejectBtn = document.querySelector("#rejectBtn");
var cancelBtn = document.querySelector("#cancelBtn");
var completeBtn = document.querySelector("#completeBtn");

//book button event listener
bookBtn.addEventListener('click', function () { BookCar(carId) });
acceptBtn.addEventListener('click', function () { acceptCar(carId) });
rejectBtn.addEventListener('click', function () {  rejectCar(carId) });
cancelBtn.addEventListener('click', function () {  cancelCar(carId) });
completeBtn.addEventListener('click', function () {  completeCar(carId) });

//functions 
async function retrieveCarDetails(carId){

    //read db using car's id
    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const carData = docSnap.data();

    if (!carData) {
        errorHandle("No car information found.");
        return;
    }

    //read db using owner's id
    const ownerSnap = doc(db, "Users", docSnap.data().CarOwner);
    const ownerDocSnap = await getDoc(ownerSnap);
    const ownerCarData = ownerDocSnap.data();

    if (!ownerCarData) {
        errorHandle("Unable to reterive car owner's information.");
        return;
    }

    //get individual car data from db
    var brand = carData.Brand;
    var model = carData.Model;
    var rating = carData.Rating;
    var seats = carData.Seats;
    var price = carData.Price;
    var description = carData.Description;

    //function to display rating stars
    getStarRatings(rating);

    //update fields in the car details page
    document.getElementById("BrandModel").innerHTML = brand + " " + model;
    document.getElementById("Seats").innerHTML = seats + " seater";
    document.getElementById("Price").innerHTML = "$" + price + "/day";
    document.getElementById("Description").innerHTML = description;

    //if car owner views his own car's details, and car is available(0) status
    if ((carData.CarOwner == localStorage.getItem("userId")) && carData.Status == 0) 
    {
        //show edit details and delete listing buttons
        console.log("car owner views his own car's details, and car is available(0) status");
        document.getElementById("editBtn").removeAttribute('hidden');
        document.getElementById("delete").removeAttribute('hidden');

    } 

    //if car owner views his own car's details, and car is pending(1) status
    if (carData.CarOwner == localStorage.getItem("userId") && carData.Status == 1)
    {
        const pendingBookingID = ownerCarData.PendingBookingOwner[0];
        const pendingSnap = doc(db, "Bookings", pendingBookingID);
        const pendingDocSnap = await getDoc(pendingSnap);
        const pendingBookingData = pendingDocSnap.data();
        const pendingRenter = pendingBookingData.UserId;

        const renterRef = doc(db, "Users", pendingRenter)
        const renterSnap = await getDoc(renterRef);
        const renterData = renterSnap.data();

        //Display renter's info and booking info for car owner to see
        document.getElementById("UserName").innerHTML = renterData.FirstName + " " + renterData.LastName;
        document.getElementById("userInfo").removeAttribute("hidden");

        //show accept and reject buttons
        document.getElementById("pendingOwner").removeAttribute('hidden');  

    } 

    //if car owner views his own car's details, and car is unavailable(2) status
    if (carData.CarOwner == localStorage.getItem("userId") && carData.Status == 2)
    {
        const pendingBookingID = ownerCarData.PendingBookingOwner[0];
        const pendingSnap = doc(db, "Bookings", pendingBookingID);
        const pendingDocSnap = await getDoc(pendingSnap);
        const pendingBookingData = pendingDocSnap.data();
        const pendingRenter = pendingBookingData.UserId;
        const pendingStart = pendingBookingData.Start;

        const renterRef = doc(db, "Users", pendingRenter)
        const renterSnap = await getDoc(renterRef);
        const renterData = renterSnap.data();

        //Display renter's info and booking info for car owner to see
        document.getElementById("UserName").innerHTML = renterData.FirstName + " " + renterData.LastName;
        document.getElementById("userInfo").removeAttribute("hidden");

        document.getElementById("Accepted").innerHTML = "Accepted";
        document.getElementById("Accepted").removeAttribute("hidden");
        document.getElementById("pendingStatus").removeAttribute('hidden');

        const d = new Date().toLocaleDateString('fr-ca');
        if( d < pendingStart){
            document.getElementById("cancelBooking").removeAttribute('hidden');
        }
        

    } 

    //if renter view a car from listing, display owner's details
    if ((carData.CarOwner != localStorage.getItem("userId")) && carData.Status == 0) 
    {
        //display car owner in user info
        document.getElementById("UserName").innerHTML = ownerCarData.FirstName + " " + ownerCarData.LastName;
        document.getElementById("userInfo").removeAttribute('hidden');

        //show date picker and booking button
        document.getElementById("Booking").removeAttribute('hidden');
    }

    //if renter view a car after booking request, pending
    if ((carData.CarOwner != localStorage.getItem("userId")) && carData.Status == 1) 
    {
        //display pending status when renter views after booking
        document.getElementById("Pending").innerHTML = "Pending";
        document.getElementById("Pending").removeAttribute('hidden');
        document.getElementById("pendingStatus").removeAttribute('hidden');
        
    }

    //if renter view a car after booking request, accepted
    if ((carData.CarOwner != localStorage.getItem("userId")) && carData.Status == 2) 
    {

        const pendingBookingID = ownerCarData.PendingBookingOwner[0];
        const pendingSnap = doc(db, "Bookings", pendingBookingID);
        const pendingDocSnap = await getDoc(pendingSnap);
        const pendingBookingData = pendingDocSnap.data();
        const pendingStart = pendingBookingData.Start;
        //const pendingEnd = pendingBookingData.End;

        //display accepted status when renter views after booking
        document.getElementById("Accepted").innerHTML = "Accepted";
        document.getElementById("Accepted").removeAttribute("hidden");
        document.getElementById("pendingStatus").removeAttribute('hidden');

        //if(today's date >= start date)
        const d = new Date().toLocaleDateString('fr-ca');
        if( d >= pendingStart){
            document.getElementById("completeBooking").removeAttribute('hidden');
        }
        else{
            document.getElementById("cancelBooking").removeAttribute('hidden');
        }  

    }


    for (let i = 0; i < carData.Images.length; i++) {
        document.getElementById("imageContainer").innerHTML += `<div class="mySlides">
        <img src="${carData.Images[i]}" class="slideshow-img" alt="image"></div>`
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

    //check valid booking
    const validation = checkBooking();
    if (!validation) {
        return;
    }

    //get date and time selected by user
    const StartTrip = document.getElementById("StartTrip").value;
    const EndTrip = document.getElementById("EndTrip").value;

    //read "Cars" db with selected car's ID
    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);

    //get car's status and owner
    const carStatus = docSnap.data().Status;
    const carOwner = docSnap.data().CarOwner;

    //check if car is available status
    if (carStatus == 0) {

        //update Booking in db and the BookingId into individual users db
        try {
            const bookingRef = await addDoc(collection(db, "Bookings"), {

                UserId: localStorage.getItem("userId"),
                CarOwner: carOwner,
                CarId: carId,
                Start: StartTrip,
                End: EndTrip,
                Status: 1,                  //booking not completed, change to 0 once renter completes
                OwnerAccepted: false,       //owner has not accepted the booking, change to true once accepted, dont't change if owner rejects
                Delete: false               //delete the booking record if this field is true, it will change to true when owner rejects a booking

            });
            console.log("Booking written in 'Bookings' with ID: ", bookingRef.id);

            const userRef = doc(db, "Users", localStorage.getItem("userId"));
            await updateDoc(userRef, {
                Booking: arrayUnion(bookingRef.id)
            });
            console.log("Booking stored in 'Users' with ID: ", userRef.id);

            const ownerRef = doc(db, "Users", carOwner);
            await updateDoc(ownerRef, {
                PendingBookingOwner: arrayUnion(bookingRef.id)
            });
            console.log("Booking stored in 'Owner' with userID: ", ownerRef.id);


            //send message to car's owner and store message in "Messages" db
            sendMessage(carOwner, bookingRef.id);
            saveMessageToDb(carId, carOwner, bookingRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }

        //update car's availabilty status to pending
        try {
            const carRef = doc(db, "Cars", carId);
            await updateDoc(carRef, {
                Status: 1       //upated car's status to pending(1)
            });
            console.log("Car status updated to pending");

        } catch (e) {
            console.error("Error updating status to pending: ", e);
        }
    }

    //pop-up alert, once user clicks 'Ok', go to booking page to view booking
    alert("Booking Successful! Wait for owner to accept.");
    window.location.href = "bookings.html";

}

async function acceptCar(carId) {

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const carData = docSnap.data();
    const carOwner = carData.CarOwner;

    const ownerRef = doc(db, "Users", carOwner)
    const ownerSnap = await getDoc(ownerRef);
    const ownerData = ownerSnap.data();
    const bookingQuerySnapshot  = ownerData.PendingBookingOwner[0];

    //update car's availabilty status to unavailable 
    try {
        const carRef = doc(db, "Cars", carId);
        await updateDoc(carRef, {
            Status: 2       //upated car's status to unavailable(2)
        });
        console.log("Car status updated to unavailable");

        const bookingRef = doc(db, "Bookings", bookingQuerySnapshot);
        await updateDoc(bookingRef, {
            OwnerAccepted: true,       //owner has accepted the booking
        });
        console.log("Booking accepted by owner");

    } catch (e) {
        console.error("Error updating status to rejected status: ", e);
    }

    alert("Booking request accepted!");
    window.location.href = "profile.html";

}

async function rejectCar(carId) {

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const carData = docSnap.data();
    const carOwner = carData.CarOwner;

    const ownerRef = doc(db, "Users", carOwner)
    const ownerSnap = await getDoc(ownerRef);
    const ownerData = ownerSnap.data();
    const bookingQuerySnapshot  = ownerData.PendingBookingOwner[0]; 

    //update car's availabilty status to available and booking delete status to true
    try {
        const carRef = doc(db, "Cars", carId);
        await updateDoc(carRef, {
            Status: 0       //upated car's status to available(0)
        });
        console.log("Car status updated to available");

        const bookingRef = doc(db, "Bookings", bookingQuerySnapshot);
        await updateDoc(bookingRef, {
            Delete: true               //delete the booking record if this field is true, it will change to true when owner rejects a booking
        });
        console.log("Booking 'Delete' field updated to true");

        await updateDoc(ownerRef, {
            PendingBookingOwner: deleteField()
        });
        console.log("PendingBookingOwner field in owner deleted");

        
        const bookingREF = await getDoc(bookingRef);
        const bookingData = bookingREF.data();
        const renterRef = bookingData.UserId;
        const renterReference = doc(db, "Users", renterRef);
        await updateDoc(renterReference, {
            Booking: arrayRemove(bookingRef.id)
        });
        console.log("Booking field in renter deleted:", bookingRef.id);
    
        await deleteDoc(doc(db, "Bookings", bookingQuerySnapshot));
        console.log("Entire booking document has been deleted successfully.");

    } catch (e) {
        console.error("Error updating status to rejected status: ", e);
    }

    alert("Booking request rejected!");
    window.location.href = "profile.html";
}


async function cancelCar(carId){

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const carData = docSnap.data();
    const carOwner = carData.CarOwner;

    const ownerRef = doc(db, "Users", carOwner)
    const ownerSnap = await getDoc(ownerRef);
    const ownerData = ownerSnap.data();
    const bookingQuerySnapshot  = ownerData.PendingBookingOwner[0]; 

    //update car's availabilty status to available and booking delete status to true
    try {
        const carRef = doc(db, "Cars", carId);
        await updateDoc(carRef, {
            Status: 0       //upated car's status to available(0)
        });
        console.log("Car status updated to available");

        const bookingRef = doc(db, "Bookings", bookingQuerySnapshot);
        await updateDoc(bookingRef, {
            Delete: true               //delete the booking record if this field is true, it will change to true when owner rejects a booking
        });
        console.log("Booking 'Delete' field updated to true");

        await updateDoc(ownerRef, {
            PendingBookingOwner: deleteField()
        });
        console.log("PendingBookingOwner field in owner deleted");

        
        const bookingREF = await getDoc(bookingRef);
        const bookingData = bookingREF.data();
        const renterRef = bookingData.UserId;
        const renterReference = doc(db, "Users", renterRef);
        await updateDoc(renterReference, {
            Booking: arrayRemove(bookingRef.id)
        });
        console.log("Booking field in renter deleted");
    
        await deleteDoc(doc(db, "Bookings", bookingQuerySnapshot));
        console.log("Entire booking document has been deleted successfully.");

    } catch (e) {
        console.error("Error updating status to rejected status: ", e);
    }

    alert("Booking cancelled!");
    window.location.href = "bookings.html";

}

async function completeCar(carId){

    const docRef = doc(db, "Cars", carId)
    const docSnap = await getDoc(docRef);
    const carData = docSnap.data();
    const carOwner = carData.CarOwner;

    const ownerRef = doc(db, "Users", carOwner)
    const ownerSnap = await getDoc(ownerRef);
    const ownerData = ownerSnap.data();
    const bookingQuerySnapshot  = ownerData.PendingBookingOwner[0];

    //update car's availabilty status to available 
    try {
        const carRef = doc(db, "Cars", carId);
        await updateDoc(carRef, {
            Status: 0       //upated car's status to available(2)
        });
        console.log("Car status updated to available");

        const bookingRef = doc(db, "Bookings", bookingQuerySnapshot);
        await updateDoc(bookingRef, {
            Status: 0       
        });
        console.log("Booking updated status in 'Bookings' with ID: ", bookingRef.id);

        await updateDoc(ownerRef, {
            PendingBookingOwner: deleteField()
        });
        console.log("PendingBookingOwner field in owner deleted");

    } catch (e) {
        console.error("Error updating status to completed status: ", e);
    }

    alert("Rental completed!");
    window.location.href = "bookings.html";

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