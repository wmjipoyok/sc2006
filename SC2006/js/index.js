/**
* @module index-js
* @description This file renders the 'Login' page. The page allows users to log in with their registered email and password.
*/

/* This line of code is importing the `initializeApp` function from the Firebase App module. It is used
to initialize a Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `const firebaseConfig` is an object that contains the configuration information needed to initialize
a Firebase app. It includes the API key, authentication domain, project ID, storage bucket,
messaging sender ID, app ID, and measurement ID. This information is used to connect the app to the
Firebase services and enable features such as authentication, database access, and storage. */
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    projectId: "sc2006-1d9b8",
    storageBucket: "sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};

/* `initializeApp(firebaseConfig);` is initializing a Firebase app with the provided configuration
object `firebaseConfig`. This is necessary to connect the app to Firebase services and enable
features such as authentication, database access, and storage. */
initializeApp(firebaseConfig);

/* This code is selecting the HTML element with the ID "loginBtn" using
`document.querySelector("#loginBtn")` and assigning it to the variable `loginBtn`. It then adds an
event listener to the `loginBtn` element that listens for a click event and calls the
`getEmailInput()` function when the button is clicked. This code is used to trigger the login
process when the user clicks the login button. */
var loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener('click', function () { getEmailInput() });

/**
 * The function checks if the email and password input fields are empty, displays error messages if
 * necessary, and attempts to sign in the user using Firebase authentication.
 */
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

/**
 * The function displays an error message for an email input field and changes its border color to red.
 * @param {String} errorMsg - errorMsg is a string parameter that represents an error message related to an
 * email input field.
 */
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

/**
 * The function displays an error message and changes the border color of a password input field.
 * @param {String} errorMsg - errorMsg is a string parameter that represents an error message to be displayed if
 * there is an issue with the password input field.
 */
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

/**
 * The function clears the error message and border color of an email input field.
 */
function clearEmailError() {
    let emailTb = document.getElementById("exampleInputEmail");
    var emailError = document.getElementById("emailError");
    emailError.setAttribute("hidden", true);
    emailTb.style.borderColor = "";
}

/**
 * The function clears the error message and border color of a password input field.
 */
function clearPasswordError() {
    let passwordTb = document.getElementById("exampleInputPassword");
    var passwordError = document.getElementById("passwordError");
    passwordError.setAttribute("hidden", true);
    passwordTb.style.borderColor = "";
}