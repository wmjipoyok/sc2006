/**
* @module register-js
* @description This file renders the 'Registration' page. The page allows users to register new accounts using email and password.
*/

/* Importing the `initializeApp` function from the Firebase App module, which is used to initialize a
Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

/* `const firebaseConfig` is an object that contains the configuration information needed to initialize
a Firebase app. It includes the API key, authentication domain, project ID, storage bucket,
messaging sender ID, app ID, and measurement ID. This information is used to authenticate and
connect to the Firebase services. */
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
object `firebaseConfig`. This function is imported from the Firebase App module and is used to
authenticate and connect to Firebase services. */
initializeApp(firebaseConfig);

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
        handleFieldError("registerFName", "regFnError");
        return;
    } else {
        clearFieldError("registerFName", "regFnError");
    }

    if (!lname) {
        handleFieldError("registerLName", "regLnError");
        return;
    } else {
        clearFieldError("registerLName", "regLnError");
    }

    if (!email) {
        handleFieldError("registerEmail", "regEmailError");
        return;
    } else {
        clearFieldError("registerEmail", "regEmailError");
    }

    if (!regPw) {
        handleFieldError("registerPassword", "regPwError");
        return;
    } else {
        clearFieldError("registerPassword", "regPwError");
    }

    if (!repeatPw) {
        handleFieldError("repeatPassword", "repPwError");
        return;
    } else {
        clearFieldError("repeatPassword", "repPwError");
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
                            handleFieldError("registerPassword", "regPwError", error.code);
                            handleFieldError("repeatPassword", "repPwError", error.code);
                            break;
                        case "auth/invalid-email":
                            handleFieldError("registerEmail", "regEmailError", error.code);
                            break;
                        case "auth/email-already-in-use":
                            handleFieldError("registerEmail", "regEmailError", error.code);
                            break;
                    }
                });
            // [END auth_signup_password]

        } else {
            handleFieldError("registerPassword", "regPwError", "Password not match");
            handleFieldError("repeatPassword", "repPwError", "Password not match");
        }
    }
}


/**
 * The function handles field errors by displaying an error message and changing the border color of
 * the input field to red.
 * @param {String} inputField - The ID of the input field that has an error.
 * @param {String} errorField - The ID of the HTML element where the error message will be displayed.
 * @param {String} errorMsg - The error message that will be displayed in the errorField element.
 */
function handleFieldError(inputField, errorField, errorMsg) {
    let inputF = document.getElementById(inputField);
    var ErrorF = document.getElementById(errorField);
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        ErrorF.innerHTML = eMsg;
    }

    ErrorF.removeAttribute("hidden");
    inputF.style.borderColor = "red";
}

/**
 * The function clears the error message and resets the border color of an input field.
 * @param {String} inputField - The ID of the input field that needs to be cleared of errors.
 * @param {String} errorField - The ID of the HTML element that displays the error message for the input field.
 */
function clearFieldError(inputField, errorField) {
    let inputF = document.getElementById(inputField);
    var ErrorF = document.getElementById(errorField);
    ErrorF.setAttribute("hidden", true);
    inputF.style.borderColor = "";
}
