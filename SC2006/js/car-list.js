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

// get URL parameter "name"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');
const lat = urlParams.get('lat');
const lng = urlParams.get('lng');

document.getElementById("carparkName").innerHTML = titleize(name);

window.addEventListener('load', function () {
    getCarList();
});

function getCarList() {
    db.collection("Cars").where("Carpark", "array-contains", parseFloat(lat)).get().then(snapshot => {
        if (snapshot.docs.length > 0) {
            snapshot.docs.forEach(doc => {
                if (doc.exists && doc.data().Status == 0) {
                    let data = doc.data();
                    let userName = "-";
                    db.collection("Users").doc(data.CarOwner).get().then((docRef) => {
                        if (docRef.exists) {
                            userName = docRef.data().FirstName;
                            console.log(doc.id);
                        }
                        document.getElementById("carListContainer").innerHTML += `
                    <div class="col-xl-3 col-lg-3 col-md-6 mb-4">
                        <div class="card border-bottom-primary shadow h-100 py-2">
                            <!-- Link To Car Details-->
                            <a href="car-detail.html?carId=${doc.id}" style="text-decoration: none">
                                <div class="card-body">
                                    <div class="no-gutters align-items-center">
                                        <div class="col-auto" style="margin-bottom: 10px;">
                                            <img src="${data.Images[0]} class="col-auto"
                                                width="100%">
                                        </div>
                                        <div class="col mr-2">
                                            <div class="h4 mb-0 font-weight-bold text-gray-800">
                                            $${data.Price}/day</div>
                                            <div class="h5 mb-0 font-weight text-gray-800">
                                            ${data.Brand} ${data.Model}</div>
                                            <div class="h6 mb-0 font-weight text-gray-800">
                                            ${data.Seats} seater</div>
                                        </div>

                                        <div class="col-auto">
                                            <div class="h7 mb-0 font-weight text-gray-800">
                                            ${userName}</div>
                                            <i class="fa fa-star fa-xs"></i>
                                            <i class="fa fa-star fa-xs"></i>
                                            <i class="fa fa-star fa-xs"></i>
                                            <i class="fa fa-star fa-xs"></i>
                                            <i class="fa fa-star fa-xs"></i>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>`
                    });
                }
            })
            document.getElementById("loading").setAttribute('hidden', true);
            document.getElementById("carListContainer").removeAttribute('hidden');
        } else {
            document.getElementById("loading").setAttribute('hidden', true);
            document.getElementById("warningMsg").innerHTML = "No cars available.";
            document.getElementById("warningMsg").removeAttribute('hidden');
        }
    })
}
