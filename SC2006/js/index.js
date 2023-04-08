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
initializeApp(firebaseConfig);

var loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener('click', function () { getEmailInput() });

function getEmailInput() {
    let email = document.getElementById("exampleInputEmail").value;
    let password = document.getElementById("exampleInputPassword").value;
    if (!email) {
        getEmailError();
    } else {
        clearEmailError();
    }

    if (!password) {
        getPasswordError();
    } else {
        clearPasswordError();
    }

    if (email && password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                window.location.href = "main.html";
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-email":
                        getEmailError(error.code);
                        break;
                    case "auth/user-not-found":
                        getEmailError(error.code);
                        break;
                    case "auth/wrong-password":
                        getPasswordError(error.code);
                        break;
                }
            });
    }
}

function getEmailError(errorMsg) {
    let emailTb = document.getElementById("exampleInputEmail");
    var emailError = document.getElementById("emailError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        emailError.innerHTML = eMsg;
    }

    emailError.removeAttribute("hidden");
    emailTb.style.borderColor = "red";
}

function getPasswordError(errorMsg) {
    let passwordTb = document.getElementById("exampleInputPassword");
    var passwordError = document.getElementById("passwordError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        passwordError.innerHTML = eMsg;
    }

    passwordError.removeAttribute("hidden");
    passwordTb.style.borderColor = "red";
}

function clearEmailError() {
    let emailTb = document.getElementById("exampleInputEmail");
    var emailError = document.getElementById("emailError");
    emailError.setAttribute("hidden", true);
    emailTb.style.borderColor = "";
}

function clearPasswordError() {
    let passwordTb = document.getElementById("exampleInputPassword");
    var passwordError = document.getElementById("passwordError");
    passwordError.setAttribute("hidden", true);
    passwordTb.style.borderColor = "";
}