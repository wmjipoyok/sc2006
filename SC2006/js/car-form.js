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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const request = urlParams.get('request');
const carId = urlParams.get('carId');
let carData;


function getCarInfo() {
    db.collection("Cars").doc(carId).get().then((doc) => {
        if (doc.exists) {
            carData = doc.data();
            const userId = localStorage.getItem("userId");
            if (doc.data().CarOwner == userId) {
                if (doc.data().Status == 0) {
                    document.getElementById("carBrand").setAttribute('value', doc.data().Brand);
                    document.getElementById("carModel").setAttribute('value', doc.data().Model);
                    document.getElementById("carSeats").setAttribute('value', doc.data().Seats);
                    document.getElementById("carPrice").setAttribute('value', doc.data().Price);
                    document.getElementById("carDescription").innerHTML = doc.data().Description;
                    document.getElementById("carForm").removeAttribute('hidden');

                    console.log(carData.Images.length);
                } else {
                    document.getElementById("warningMsg").innerHTML = "You only can edit when the car is not in pending or rented status.";
                    document.getElementById("warningMsg").removeAttribute('hidden');
                }
            } else {
                document.getElementById("warningMsg").innerHTML = "You do not have the permission to edit the car information";
                document.getElementById("warningMsg").removeAttribute('hidden');
            }

            for (let i = 0; i < carData.Images.length; i++) {
                document.getElementById("imageContainer").innerHTML += `<div class="mySlides">
                <img src="${carData.Images[i]}" style="width:100%"></div>`
                document.getElementById("dotContatiner").innerHTML += `<span class="dot" onclick="currentSlide(${i + 1})"></span>`
            }

            document.getElementById("imageContainer").innerHTML += `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>`

            //append slideshow javasdcript after images finish loading
            var head = document.getElementsByTagName('HEAD')[0];
            var script = document.createElement('script');
            script.src = './js/slideshow.js';
            head.appendChild(script);
        }
        document.getElementById("carFormContainer").removeAttribute('hidden');
        document.getElementById("loading").setAttribute('hidden', true);
    }).catch((error) => {
        console.log("Error getting document:", error);
        document.getElementById("loading").setAttribute('hidden', true);
        document.getElementById("warningMsg").innerHTML = "This page is not available at the moment.";
        document.getElementById("warningMsg").removeAttribute('hidden');
        document.getElementById("carFormContainer").removeAttribute('hidden');
    });
}

window.addEventListener('load', function () {
    $(function () {
        $("#nav-content").load("nav.html");
        $("#logout-model").load("logout-model.html");
    });

    if (request == 'edit') {
        getCarInfo();
    }

    let carForm = document.getElementById("carForm");
    carForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // handle submit

        const carBrand = e.target.elements.carBrand.value;
        const carModel = e.target.elements.carModel.value;
        const carSeats = parseInt(e.target.elements.carSeats.value);
        const carPrice = parseInt(e.target.elements.carPrice.value);
        const carDescription = e.target.elements.carDescription.value;

        console.log(carData);

        db.collection("Cars").doc(carId).set({
            Brand: carBrand,
            Model: carModel,
            Seats: carSeats,
            Price: carPrice,
            Description: carDescription,
            Status: carData.Status,
            Images: carData.Images,
            Rating: carData.Rating,
            Carpark: carData.Carpark,
            CarOwner: carData.CarOwner
        })
            .then(() => {
                document.getElementById("successMsg").removeAttribute('hidden');
                console.log("Car information has been updated!");
            })
            .catch((error) => {
                console.error("Error updating car information: ", error);
            });
    });
}, false);



