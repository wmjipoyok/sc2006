
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

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

initializeApp(firebaseConfig);

window.addEventListener('load', function () {
    $(function () {
        $("#nav-content").load("nav.html");
        $("#logout-model").load("logout-model.html");
    });
}, false);


const db = firebase.firestore();

//get user's ID
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

                //Run getRatings when DOM loads
                //document.addEventListener('DOMContentLoaded', getRatings);
                getRatings(rating);
                //console.log("past call"); //DEBUG
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

//getRatings func
function getRatings(rating) {
    //console.log("enetered func"); //DEBUG
    //Total Stars
    const starsTotal = 5;

    const starPercentage = (rating / starsTotal * 100);

    //Round to nearest 10
    const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

    //Set width of stars-inner to percentage
    document.querySelector('.stars-inner').style.width = starPercentageRounded;

    //Add number rating
    //console.log(rating); //DEBUG
    if (rating != undefined) {
        document.querySelector('.number-rating').innerHTML = rating;
    }
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