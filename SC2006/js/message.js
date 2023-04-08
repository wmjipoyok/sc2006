/**
* @module message-js
* @description This file is for rendering message alerts and request for notification permission.
Since this file needs to be implemented in most of the pages in order to receive messages, 
we make it a stand-alone javascript file which increases the code maintainability and reusability.
*/

/* This line of code is importing the Firebase Messaging module from the specified URL. It allows the
code to use the messaging functionality provided by Firebase. */
import { } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js";

/* `const messaging = firebase.messaging();` is initializing the Firebase Messaging service and
creating a messaging instance that can be used to send and receive push notifications. It allows the
code to use the messaging functionality provided by Firebase. */
const messaging = firebase.messaging();

/**
 * This function requests permission for notifications and retrieves a token for the current user.
 */
function requestPermission() {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            messaging.getToken({ vapidKey: 'BEEAHloAWmkQho70Ky3al3ZKzoTmeWrcYB7gDeX5s9RbqNO9R3wNNYA9WU8-T4N0xRvErTcMCnV02zdI5rZ6N64' })
                .then((currentToken) => {
                    console.log("currentToken: " + currentToken);
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

/* `requestPermission();` is a function that requests permission for notifications from the user. It
uses the `Notification.requestPermission()` method to prompt the user for permission to show
notifications. If the user grants permission, it retrieves a token for the current user using the
Firebase Messaging service and stores it in the local storage. */
requestPermission();

/* `messaging.onMessage()` is a method provided by Firebase Messaging that listens for incoming push
notifications. When a push notification is received, the function passed as an argument to
`messaging.onMessage()` is executed. */
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
                    <div class="small text-gray-500">${currentdate.toLocaleString("fr-ca")} ${currentdate.toLocaleTimeString('it-IT')}</div>
                    <span class="font-weight-bold">${payload.data.message}</span>
                </div>
            </a>`

        }

    }
});