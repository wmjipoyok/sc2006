/**
* @module forgot-password-js
* @description This file renders the 'Forgot Password' page and ensures users submit a valid user email that exists in the system to reset passwords.
A reset password email will be sent to users and users can follow the instructions to reset their password. 
*/

/* This line of code is importing the `initializeApp` function from the Firebase App module. It is used
to initialize a Firebase app instance with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `const firebaseConfig` is an object that contains the configuration information required to
initialize a Firebase app instance. It includes the API key, authentication domain, project ID,
storage bucket, messaging sender ID, app ID, and measurement ID. This information is used to
authenticate and connect to the Firebase services. */
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    projectId: "sc2006-1d9b8",
    storageBucket: "sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};

/* `initializeApp(firebaseConfig);` is initializing a Firebase app instance with the provided
configuration object `firebaseConfig`. This configuration object contains the necessary information
to authenticate and connect to Firebase services such as the API key, authentication domain, project
ID, storage bucket, messaging sender ID, app ID, and measurement ID. */
initializeApp(firebaseConfig);

/* This code is selecting the HTML element with the ID "resetBtn" and assigning it to the variable
`resetBtn`. It then adds an event listener to the `resetBtn` element that listens for a "click"
event and calls the `resetPassword()` function when the button is clicked. */
var resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener('click', function () { resetPassword() });

/**
 * This function sends a password reset email to a user's email address and handles errors related to
 * invalid or non-existent email addresses.
 */
function resetPassword() {
    const email = document.getElementById("resetEmailInput").value;
    if (email) {
        clearInputError("resetEmailInput", "resetEmailError");
        // [START auth_send_password_reset]
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                document.getElementById("resetPwForm").setAttribute("hidden", true);
                document.getElementById("resetDone").removeAttribute("hidden");
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-email":
                        handleInputError("resetEmailInput", "resetEmailError", error.code);
                        break;
                    case "auth/user-not-found":
                        handleInputError("resetEmailInput", "resetEmailError", error.code);
                        break;
                }
            });
        // [END auth_send_password_reset]
    } else {
        handleInputError("resetEmailInput", "resetEmailError");
    }
}
