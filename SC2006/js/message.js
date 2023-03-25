// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js";
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
}

const app = initializeApp(firebaseConfig);
const messaging = firebase.messaging();

function requestPermission() {
    // console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            // console.log('Notification permission granted.');
            messaging.getToken({ vapidKey: 'BIKm-OqsfzgKZhCH9oczK00Gq8gHLwLzvSKlrD3H1A0FuNKZW3x-D9xPoRbNbpnRTbVW5XL7c9AJVODdoV_pLAI' })
                .then((currentToken) => {
                    if (currentToken) {
                        localStorage.setItem("currToken", currentToken);
                    } else {
                        console.log("cannot get notification token");
                    }
                })
                .catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
        } else {
            console.log("do not have permission");
        }
    })
}

requestPermission();

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    const userId = localStorage.getItem("userId");
    const notiCount = document.getElementById('notiCount');
    if ((userId == payload.data.ownerId) && notiCount) {
        if (notiCount) {
            if (notiCount.style.visibility == 'hidden') {
                notiCount.style.visibility = 'visible';
            }
            notiCount.innerHTML = parseInt(notiCount.innerHTML) + 1;
            const alerts = document.getElementById('alertContainer');
            const carId = '123';
            const username = 'user123';
            var currentdate = new Date();
            alerts.innerHTML += `<a class="dropdown-item d-flex align-items-center" href="car-detail.html?carId=${carId}">
            <div class="mr-3">
                <div class="icon-circle bg-primary">
                    <i class="fas fa-file-alt text-white"></i>
                </div>
            </div>
            <div>
                <div class="small text-gray-500">${currentdate.toLocaleString()}</div>
                <span class="font-weight-bold">A new booking request from ${username}!</span>
            </div>
        </a>`

        }

    }
});