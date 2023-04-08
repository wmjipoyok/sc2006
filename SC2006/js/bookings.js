/**
* @module bookings-js
* @description This file renders the 'My Bookings' page. The page allows user to view his/her current booking and past bookings.
*/

/* This line of code is importing the `initializeApp` function from the Firebase App module. It is used
to initialize a Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

/* `const firebaseConfig` is an object that contains the configuration information needed to initialize
a Firebase app. It includes the API key, authentication domain, database URL, project ID, storage
bucket, messaging sender ID, app ID, and measurement ID. This object is used as an argument in the
`initializeApp()` function to initialize the Firebase app with the provided configuration. */
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    databaseURL: "https://sc2006-1d9b8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sc2006-1d9b8",
    storageBucket: "gs://sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};

/* `initializeApp(firebaseConfig);` is initializing a Firebase app with the provided configuration
object `firebaseConfig`. This function is imported from the Firebase App module and is used to
initialize a Firebase app with the provided configuration. */
initializeApp(firebaseConfig);

/* `const db = firebase.firestore();` is initializing a Firestore database instance and assigning it to
the constant variable `db`. This allows the code to interact with the Firestore database and perform
operations such as reading and writing data. */
const db = firebase.firestore();


/* This code is using jQuery to load the contents of the `nav.html` and `logout-model.html` files into
the respective elements with the IDs `nav-content` and `logout-model`. The `$(function () {...})`
syntax is shorthand for the `$(document).ready(function() {...})` syntax, which ensures that the
code inside the function is executed only after the DOM has finished loading. */
$(function () {
    $("#nav-content").load("nav.html");
    $("#logout-model").load("logout-model.html");
});

/* `window.addEventListener('load', function () { displayBookings(); });` is adding an event listener
to the `window` object that listens for the `load` event, which is fired when the entire page and
its resources (such as images and scripts) have finished loading. Once the `load` event is fired,
the `displayBookings()` function is called, which retrieves and displays the user's current and past
bookings from the Firestore database. This ensures that the `displayBookings()` function is only
called after the page has finished loading, which prevents any potential issues with accessing
elements or data that may not have loaded yet. */
window.addEventListener('load', function () {
    displayBookings();
});

/**
 * The function retrieves booking information for a user and displays it on the webpage.
 */
function displayBookings() {
    //getting user id
    const userID = localStorage.getItem("userId");

    db.collection("Users").doc(userID).get().then((doc) => {
        const userData = doc.data();
        if (userData.hasOwnProperty("Booking")) {
            //getting booking array
            const bookings = userData.Booking;

            //reverse sort to display newest bookings first
            bookings.reverse();

            //then for each booking, we will query the booking db and check the status
            bookings.forEach((bookingRef) => {
                db.collection("Bookings").doc(bookingRef).get().then((bookingDoc) => {
                    const bookingData = bookingDoc.data();

                    //checking status and other attributes
                    const bookingStatus = bookingData.Status;
                    const carID = bookingData.CarId;
                    const endDate = bookingData.End;
                    const startDate = bookingData.Start;

                    //using carID to retrieve car info
                    db.collection("Cars").doc(carID).get().then((carDoc) => {
                        const carData = carDoc.data();

                        if (bookingStatus == 1) {
                            //if the status is 1 (current booking), we display it in the current booking section with a link to the booking page
                            document.getElementById("no-current-booking").hidden = true;

                            document.getElementById("current-booking-container").innerHTML += `
                                <div >
                                    <div class="card border-bottom-primary shadow h-100 py-2">
                                        <!-- Link To Car Details-->
                                        <a href="car-detail.html?carId=${carDoc.id}" style="text-decoration: none">
                                            <div class="card-body">
                                                <div class="no-gutters align-items-center">
                                                    <div class="col-auto" style="margin-bottom: 10px;">
                                                        <img src="${carData.Images[0]} class="col-auto"
                                                            style="width:100%;">
                                                    </div>
                                                    <div class="col mr-2">
                                                        <div class="h4 mb-0 font-weight-bold text-gray-800">
                                                        $${carData.Price}/day</div>
                                                        <div class="h5 mb-0 font-weight text-gray-800">
                                                        ${carData.Brand} ${carData.Model}</div>
                                                        <div class="h6 mb-0 font-weight text-gray-800">
                                                        ${carData.Seats} seater</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>`
                        } else if (bookingStatus == 0) {
                            //if the status is 0 (completed booking), we will just display a few details in the past bookings section
                            document.getElementById("no-past-bookings").hidden = true;

                            const numOfDays = getDaysBetweenDates(endDate, startDate);
                            const totalAmount = numOfDays * carData.Price;

                            document.getElementById("pastBookingsContainer").innerHTML += `
                                <li class="past-booking-item" >
                                    <div class="past-booking-item-content">
                                        <!-- past booking content -->
                                        <div>Booking ID: ${bookingRef}</div>
                                        <div>Car: ${carData.Brand} ${carData.Model}</div>
                                        <div>Total Amount: $${totalAmount}</div>
                                    </div>
                                    <div class="past-booking-item-date">
                                        <!-- past booking date -->
                                        ${startDate} - ${endDate}
                                    </div>
                                </li>`
                        } else {//can add more here
                            console.log("Unknown booking status!");
                        }
                    });
                });
            });
        } else {
            //case where user has no current or past bookings
            console.log("User does not have any bookings, past or present");
            document.getElementById(no - current - booking).hidden = false;
            document.getElementById(no - past - bookings).hidden = false;
        }
    })
        .catch((error) => {
            console.log("Error getting user document:", error);
        });
}

/**
 * The function calculates the number of days between two given dates.
 * @param date1 - The first date in the format of a string or a Date object.
 * @param date2 - The second date for which you want to calculate the number of days between it and
 * date1.
 * @returns the number of days between two dates.
 */
function getDaysBetweenDates(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24; // number of milliseconds in a day
    const timeDiff = Math.abs(new Date(date2) - new Date(date1)); // time difference in milliseconds
    const diffDays = Math.ceil(timeDiff / oneDay); // convert to days and round up
    return diffDays;
}