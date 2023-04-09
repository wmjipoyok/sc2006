/**
* @module forgot-password-js
* @description This file renders the 'Forgot Password' page and ensures users submit a valid user email that exists in the system to reset passwords.
A reset password email will be sent to users and users can follow the instructions to reset their password. 
*/

/* This line of code is importing the `initializeApp` function from the Firebase App module. It is used
to initialize a Firebase app instance with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `initializeApp(getFirebaseConfig());` is initializing a Firebase app with the provided
configuration. The `getFirebaseConfig()` function is defined common.js which returns an object 
containing the configuration settings for the Firebase app, such as the API key,
project ID, and messaging sender ID. */
initializeApp(getFirebaseConfig());

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
