// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js";
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
    if ((userId == payload.data.receiverId) && notiCount) {
        if (notiCount) {
            if (notiCount.style.visibility == 'hidden') {
                notiCount.style.visibility = 'visible';
            }
            notiCount.innerHTML = parseInt(notiCount.innerHTML) + 1;
            const alerts = document.getElementById('alertContainer');
            const carId = payload.data.carId;
            var currentdate = new Date();
            alerts.innerHTML += `<a class="dropdown-item d-flex align-items-center" href="car-detail.html?carId=${carId}">
                <div class="mr-3">
                    <div class="icon-circle bg-primary">
                        <i class="fas fa-file-alt text-white"></i>
                    </div>
                </div>
                <div>
                    <div class="small text-gray-500">${currentdate.toLocaleString()}</div>
                    <span class="font-weight-bold">${payload.data.message}</span>
                </div>
            </a>`

        }

    }
});