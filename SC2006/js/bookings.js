import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

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

const app = initializeApp(firebaseConfig);
const db = firebase.firestore();


$(function () {
    $("#nav-content").load("nav.html");
    $("#logout-model").load("logout-model.html");
});

window.addEventListener('load', function () {
    displayBookings();
});

function displayBookings(){
    //need to get all the bookings associated with a user using the Booking attribute
    //getting user id
    const userID = localStorage.getItem("userId");
    
    db.collection("Users").doc(userID).get().then((doc) => {
        const userData = doc.data();
        if(userData.hasOwnProperty("Booking")) {
            //getting booking array
            const bookings = userData.Booking;

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

                        if(bookingStatus == 1){
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
                        } else if (bookingStatus == 0){
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
                        } else{//can add more here
                            console.log("Unknown booking status!");
                        }
                    }); 
                });
            });
        } else {
            //case where user has no current or past bookings
            console.log("User does not have any bookings, past or present");
            document.getElementById(no-current-booking).hidden = false;
            document.getElementById(no-past-bookings).hidden = false;
        }
    })
    .catch((error) => {
        console.log("Error getting user document:", error);
    });
}

function getDaysBetweenDates(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24; // number of milliseconds in a day
    const timeDiff = Math.abs(new Date(date2) - new Date(date1)); // time difference in milliseconds
    const diffDays = Math.ceil(timeDiff / oneDay); // convert to days and round up
    return diffDays;
}