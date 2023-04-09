/**
* @module index-js
* @description This file renders the 'Login' page. The page allows users to log in with their registered email and password.
*/

/* This line of code is importing the `initializeApp` function from the Firebase App module. It is used
to initialize a Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `initializeApp(getFirebaseConfig());` is initializing a Firebase app with the provided
configuration. The `getFirebaseConfig()` function is defined common.js which returns an object 
containing the configuration settings for the Firebase app, such as the API key,
project ID, and messaging sender ID. */
initializeApp(getFirebaseConfig());

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
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    if (!email) {
        handleInputError("emailInput", "emailError");
    } else {
        clearInputError("emailInput", "emailError");
    }

    if (!password) {
        handleInputError("passwordInput", "passwordError");
    } else {
        clearInputError("passwordInput", "passwordError");
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
                        handleInputError("emailInput", "emailError", error.code);
                        break;
                    case "auth/user-not-found":
                        handleInputError("emailInput", "emailError", error.code);
                        break;
                    case "auth/wrong-password":
                        handleInputError("passwordInput", "passwordError", error.code);
                        break;
                }
            });
    }
}
