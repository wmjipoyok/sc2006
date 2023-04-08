import { } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js";

const messaging = firebase.messaging();

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
                    <div class="small text-gray-500">${currentdate.toLocaleString("fr-ca")} ${currentdate.toLocaleTimeString('it-IT')}</div>
                    <span class="font-weight-bold">${payload.data.message}</span>
                </div>
            </a>`

        }

    }
});