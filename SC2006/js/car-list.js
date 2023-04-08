/**
* @module car-list-js
* @description This file renders the 'Car List' page. The page allows users to view the available cars to rent based on the car park location selected. 
Users can choose a car from the list to see the car formation and decide if they want to rent the car.
*/

/* Importing the `initializeApp` function from the Firebase App module version 9.17.2, which is hosted
on the URL "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js". This function is used to
initialize a Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

/* `const firebaseConfig` is an object that contains the configuration information needed to initialize
a Firebase app. It includes the API key, authentication domain, database URL, project ID, storage
bucket, messaging sender ID, and app ID. The `storageBucket` property is included twice, which may
be a mistake. */
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

initializeApp(firebaseConfig);
const db = firebase.firestore();
const starsTotal = 5;

$(function () {
    $("#nav-content").load("nav.html");
    $("#logout-model").load("logout-model.html");
});

// get URL parameter "name"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');
const lat = urlParams.get('lat');

document.getElementById("carparkName").innerHTML = titleize(name);

window.addEventListener('load', function () {
    getCarList();
});

async function getCarList() {
    let isCarAva = false;
    await db.collection("Cars").where("Carpark", "array-contains", parseFloat(lat)).orderBy("CreateDateTime", "desc").get().then(snapshot => {
        if (snapshot.docs.length > 0) {
            snapshot.docs.forEach((doc, index) => {
                if (doc.exists && doc.data().Status == 0) {
                    isCarAva = true;
                    let data = doc.data();
                    // console.log("snapshot:" + doc.data().CreateDateTime);
                    let userName = "-";
                    db.collection("Users").doc(data.CarOwner).get().then((docRef) => {
                        if (docRef.exists) {
                            userName = docRef.data().FirstName;
                        }

                        const starPercentage = (data.Rating / starsTotal * 100);
                        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

                        document.getElementById("carListContainer").innerHTML += `
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card border-bottom-primary shadow h-100 py-2">
                                <a href="car-detail.html?carId=${doc.id}" style="text-decoration: none">
                                    <div class="card-body">
                                        <div class="col-auto" style="margin-bottom: 10px; margin-left: auto;margin-right: auto;">
                                                <img src="${data.Images[0]} class="col-auto"
                                                    style="width:100%;">
                                        </div>
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div class="h4 mb-0 font-weight-bold text-gray-800">
                                                    $${data.Price}/day
                                                </div>
                                                <div class="h5 mb-0 font-weight text-gray-800">
                                                    ${data.Brand} ${data.Model}
                                                </div>
                                            </div>

                                            <div class="col-auto">
                                                <div class="h4 mb-0 font-weight text-gray-800">
                                                    ${data.Seats} seater
                                                </div>

                                                <div class="stars-outer">
                                                    <div class="stars-inner" style="width: ${starPercentageRounded}"></div>
                                                </div>
                                                <span class="number-rating" style="color: grey">${data.Rating}</span>
                                            </div>
                                        </div>
                                        <div class="h7 mb-0 font-weight text-gray-800" style="margin-top:5px;">
                                            <img class="owner-profile rounded-circle" style="width:20px; vertical-align: text-top;"
                                                    src="img/profile.png">
                                            <span id="CarOwner">${userName}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>`
                    });
                }
            })
        }
        document.getElementById("loading").setAttribute('hidden', true);
        document.getElementById("carListContainer").removeAttribute('hidden');
        setTimeout(() => {
            noCarAvailable();
        }, 2000);
    })
}

function noCarAvailable() {
    if (document.getElementById("carListContainer").innerHTML == "") {
        document.getElementById("warningMsg").innerHTML = "No cars available.";
        document.getElementById("warningMsg").removeAttribute('hidden');
    }
}
