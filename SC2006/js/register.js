/**
* @module register-js
* @description This file renders the 'Registration' page. The page allows users to register new accounts using email and password.
*/

/* Importing the `initializeApp` function from the Firebase App module, which is used to initialize a
Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `initializeApp(getFirebaseConfig());` is initializing a Firebase app with the provided
configuration. The `getFirebaseConfig()` function is defined common.js which returns an object 
containing the configuration settings for the Firebase app, such as the API key,
project ID, and messaging sender ID. */
initializeApp(getFirebaseConfig());

/* This code is selecting the HTML element with the ID "registerBtn" and assigning it to the variable
`registerBtn`. It then adds an event listener to the button so that when it is clicked, the
`signUpWithEmailPassword()` function is called. This function is responsible for handling the user
registration process. */
var registerBtn = document.querySelector("#registerBtn");
registerBtn.addEventListener('click', function () { signUpWithEmailPassword() });

/**
 * The function handles user registration with email and password, validates user input, and stores
 * user data in Firestore upon successful registration. It also handles errors that may occur during the
 * process.
 */
function signUpWithEmailPassword() {
    var fnameTb = document.getElementById("registerFName");
    var lnameTb = document.getElementById("registerLName");
    var emailTb = document.getElementById("registerEmail");
    var regPwTb = document.getElementById("registerPassword");
    var repeatPwTb = document.getElementById("repeatPassword");
    var fname = fnameTb.value;
    var lname = lnameTb.value;
    var email = emailTb.value;
    var regPw = regPwTb.value;
    var repeatPw = repeatPwTb.value;

    if (!fname) {
        handleInputError("registerFName", "regFnError");
        return;
    } else {
        clearInputError("registerFName", "regFnError");
    }

    if (!lname) {
        handleInputError("registerLName", "regLnError");
        return;
    } else {
        clearInputError("registerLName", "regLnError");
    }

    if (!email) {
        handleInputError("registerEmail", "regEmailError");
        return;
    } else {
        clearInputError("registerEmail", "regEmailError");
    }

    if (!regPw) {
        handleInputError("registerPassword", "regPwError");
        return;
    } else {
        clearInputError("registerPassword", "regPwError");
    }

    if (!repeatPw) {
        handleInputError("repeatPassword", "repPwError");
        return;
    } else {
        clearInputError("repeatPassword", "repPwError");
    }

    if (fname && lname && email && regPw && repeatPw) {
        if (regPw === repeatPw) {
            // [START auth_signup_password]
            console.log("email: " + email + ", password: " + regPw);
            firebase.auth().createUserWithEmailAndPassword(email, regPw)
                .then((userCredential) => {
                    // Signed in 
                    var user = userCredential.user;

                    //START storing user data into "Users" collection upon successful registration.. NEED to edit rules in firestore to allow auth users to update their doc
                    const db = firebase.firestore();

                    firebase.auth().onAuthStateChanged(user => {
                        if (user) {
                            // User is signed in.
                            console.log('Authenticated user:', user);
                            db.collection("Users").doc(user.uid).set({
                                //setting user details
                                Email: email,
                                FirstName: fname,
                                LastName: lname
                            })
                                .then(() => {
                                    console.log("User document created succesesfully");
                                    var regForm = document.getElementById("registerForm");
                                    var sucMsg = document.getElementById("successMsg");
                                    regForm.setAttribute("hidden", true);
                                    sucMsg.removeAttribute("hidden");
                                    console.log("You may login now");
                                })
                                .catch((error) => {
                                    console.error("Error creating user document: ", error);
                                });
                            //END storing users in DB
                        } else {
                            console.log('No authenticated user found.');
                        }
                    }); //END ACTUAL

                })
                .catch((error) => {
                    console.log(error);
                    switch (error.code) {
                        case "auth/weak-password":
                            handleInputError("registerPassword", "regPwError", error.code);
                            handleInputError("repeatPassword", "repPwError", error.code);
                            break;
                        case "auth/invalid-email":
                            handleInputError("registerEmail", "regEmailError", error.code);
                            break;
                        case "auth/email-already-in-use":
                            handleInputError("registerEmail", "regEmailError", error.code);
                            break;
                    }
                });
            // [END auth_signup_password]

        } else {
            handleInputError("registerPassword", "regPwError", "Password not match");
            handleInputError("repeatPassword", "repPwError", "Password not match");
        }
    }
}
