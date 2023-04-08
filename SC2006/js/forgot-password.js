import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    projectId: "sc2006-1d9b8",
    storageBucket: "sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

var resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener('click', function () { resetPassword() });

function resetPassword() {
    const email = document.getElementById("resetEmailInput").value;
    if (email) {
        clearEmailError();
        // [START auth_send_password_reset]
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                document.getElementById("resetPwForm").setAttribute("hidden", true);
                document.getElementById("resetDone").removeAttribute("hidden");
                console.log("success");
            })
            .catch((error) => {
                // console.log(error.code);
                switch (error.code) {
                    case "auth/invalid-email":
                        getEmailError(error.code);
                        break;
                    case "auth/user-not-found":
                        getEmailError(error.code);
                        break;
                }
            });
        // [END auth_send_password_reset]
    } else {
        getEmailError();
    }
}

function getEmailError(errorMsg) {
    let emailTb = document.getElementById("resetEmailInput");
    var emailError = document.getElementById("resetEmailError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        emailError.innerHTML = eMsg;
    }

    emailError.removeAttribute("hidden");
    emailTb.style.borderColor = "red";
}

function clearEmailError() {
    let emailTb = document.getElementById("resetEmailInput");
    var emailError = document.getElementById("resetEmailError");
    emailError.setAttribute("hidden", true);
    emailTb.style.borderColor = "";
}