/**
* @module profile-js
* @description This file renders the 'Profile' page. The page allows users to view their account information, 
including first name, last name, email, ratings and cars uploaded for rent.
*/

/* This line of code is importing the `initializeApp` function from the Firebase App SDK version
9.17.1. This function is used to initialize a Firebase app with the provided configuration object. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `initializeApp(getFirebaseConfig());` is initializing a Firebase app with the provided
configuration. The `getFirebaseConfig()` function is defined common.js which returns an object 
containing the configuration settings for the Firebase app, such as the API key,
project ID, and messaging sender ID. */
initializeApp(getFirebaseConfig());

/* This code is adding an event listener to the window object that waits for the page to fully load
before executing a function. The function uses jQuery to load the contents of two HTML files,
"nav.html" and "logout-model.html", into the respective elements with the IDs "nav-content" and
"logout-model" in the current page's HTML. This allows the navigation bar and logout modal to be
reused across multiple pages without duplicating code. */
window.addEventListener('load', function () {
    $(function () {
        $("#nav-content").load("nav.html");
        $("#logout-model").load("logout-model.html");
    });
}, false);


/* `const db = firebase.firestore();` is initializing a Firestore database instance and assigning it to
the constant variable `db`. This allows the code to interact with the Firestore database and perform
operations such as reading and writing data. */
const db = firebase.firestore();

/* The `firebase.auth().onAuthStateChanged()` function is a listener that is triggered whenever the
authentication state of the user changes. It takes a callback function as an argument that is
executed whenever the authentication state changes. */
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        const userID = user.uid;
        //console.log("UID: ", userID); DEBUG

        //get user's doc from "Users" collection
        db.collection("Users").doc(userID).get().then((doc) => {
            if (doc.exists) {
                //retrieve user data from doc
                const userData = doc.data();
                const firstName = userData.FirstName;
                const lastName = userData.LastName;
                const email = userData.Email;
                const rating = userData.Rating;

                //update DOM with retrieved data
                document.getElementById("user-fname").innerHTML = firstName;
                document.getElementById("user-lname").innerHTML = lastName;
                document.getElementById("user-email").innerHTML = email;

                getRatings(rating);
                getUploadedCars();
            } else {
                console.log("No such document!", doc);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    else {
        // User is signed out.
        console.log(firebase.auth().currentUser);
    }
})

/**
 * The function calculates and sets the percentage width of a star rating system based on a given
 * rating.
 * @param {Number} rating - The rating parameter is a number that represents the rating value to be displayed.
 * It is used to calculate the percentage of stars to be filled and to display the number rating.
 */
function getRatings(rating) {
    //Total Stars
    const starsTotal = 5;

    const starPercentage = (rating / starsTotal * 100);

    //Round to nearest 10
    const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

    //Set width of stars-inner to percentage
    document.querySelector('.stars-inner').style.width = starPercentageRounded;

    //Add number rating
    if (rating != undefined) {
        document.querySelector('.number-rating').innerHTML = rating;
    }
}

/**
 * This function retrieves and displays the cars that a user owns in their profile page.
 */
function getUploadedCars() {
    //to pull and display the car's that a user owns in his profile page
    const userID = localStorage.getItem("userId");
    const carsRef = db.collection("Cars");

    carsRef.where("CarOwner", "==", userID).orderBy("CreateDateTime", "desc").get()
        .then((carSnapshot) => {
            const carDocs = carSnapshot.docs; //need js array since the snapshot does not have a index for forEach

            //checking if array is empty.. if it is, we display message that user has not uploaded any car
            if (carDocs.length == 0) {
                console.log("User has not uploaded any cars!");
                document.getElementById("no-user-cars").removeAttribute("hidden");
            }

            carDocs.forEach((doc, index) => {
                //iterate through results and display car details
                const carData = doc.data();
                const carRef = doc.id;

                //retrieve car data
                const carNum = index + 1;
                const carBrandModel = carData.Brand + ' ' + carData.Model;
                const carImage = carData.Images[0]; //just the cover image
                const carPrice = carData.Price;
                const carRating = carData.Rating;
                const carSeats = carData.Seats;

                //unhiding the card
                const cardID = `profile-car-${carNum}`;
                document.getElementById(cardID).removeAttribute("hidden");

                //all element IDs
                const carBrandModelID = `profile-car-${carNum}-name`;
                const carImageID = `profile-car-${carNum}-img`;
                const carPriceID = `profile-car-${carNum}-price`;
                const carRatingID = `.stars-inner-car-${carNum}`;
                const carSeatsID = `profile-car-${carNum}-seats`;
                const carLinkID = `profile-car-${carNum}-link`;

                //inserting data into the cards
                document.getElementById(carBrandModelID).innerHTML = carBrandModel;
                document.getElementById(carImageID).src = carImage;
                document.getElementById(carPriceID).innerHTML = `$${carPrice}/day`;
                document.getElementById(carSeatsID).innerHTML = `${carSeats} seater`;
                document.getElementById(carLinkID).href = `car-detail.html?carId=${carRef}`;

                //inserting Rating into the card
                const starsTotal = 5;
                const starPercentage = (carRating / starsTotal * 100);
                const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
                document.querySelector(carRatingID).style.width = starPercentageRounded;
            });
            document.getElementById("loading").setAttribute("hidden", true);
            document.getElementById("profileContainer").removeAttribute("hidden");
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
            document.getElementById("loading").setAttribute("hidden", true);
        });
}