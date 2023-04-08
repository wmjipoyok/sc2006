// Import the functions you need from the SDKs you need
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

var registerBtn = document.querySelector("#registerBtn");
registerBtn.addEventListener('click', function () { signUpWithEmailPassword() });

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
        getFNameError();
        return;
    } else {
        clearFNameError();
    }

    if (!lname) {
        getLNameError();
        return;
    } else {
        clearLNameError();
    }

    if (!email) {
        getEmailError();
        return;
    } else {
        clearEmailError();
    }

    if (!regPw) {
        getPasswordError();
        return;
    } else {
        clearPasswordError();
    }

    if (!repeatPw) {
        getRepPwError();
        return;
    } else {
        clearRepPasswordError();
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
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error);
                    switch (error.code) {
                        case "auth/weak-password":
                            getPasswordError(error.code);
                            getRepPwError(error.code);
                            break;
                        case "auth/invalid-email":
                            getEmailError(error.code);
                            break;
                        case "auth/email-already-in-use":
                            getEmailError(error.code);
                            break;
                    }
                });
            // [END auth_signup_password]


        } else {
            getPasswordError("Password not match");
            getRepPwError("Password not match");
        }
    }
}

function getFNameError(errorMsg) { //FIRST NAME
    let fnameTb = document.getElementById("registerFName");
    var fnameError = document.getElementById("regFnError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        fnameError.innerHTML = eMsg;
    }

    fnameError.removeAttribute("hidden");
    fnameTb.style.borderColor = "red";
}

function getLNameError(errorMsg) { //LAST NAME
    let lnameTb = document.getElementById("registerLName");
    var lnameError = document.getElementById("regLnError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        emailError.innerHTML = eMsg;
    }

    lnameError.removeAttribute("hidden");
    lnameTb.style.borderColor = "red";
}

function getEmailError(errorMsg) {
    let emailTb = document.getElementById("registerEmail");
    var emailError = document.getElementById("regEmailError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        emailError.innerHTML = eMsg;
    }

    emailError.removeAttribute("hidden");
    emailTb.style.borderColor = "red";
}

function getPasswordError(errorMsg) {
    let passwordTb = document.getElementById("registerPassword");
    var pwErrorTb = document.getElementById("regPwError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        pwErrorTb.innerHTML = eMsg;
    }

    pwErrorTb.removeAttribute("hidden");
    passwordTb.style.borderColor = "red";
}

function getRepPwError(errorMsg) {
    let repPwTb = document.getElementById("repeatPassword");
    var repPwError = document.getElementById("repPwError");
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        repPwError.innerHTML = eMsg;
    }

    repPwError.removeAttribute("hidden");
    repPwTb.style.borderColor = "red";
}

function clearFNameError() { //FIRST NAME
    let fnameTb = document.getElementById("registerFName");
    var fnameError = document.getElementById("regFnError");
    fnameError.setAttribute("hidden", true);
    fnameTb.style.borderColor = "";
}

function clearLNameError() { //LAST NAME
    let lnameTb = document.getElementById("registerLName");
    var lnameError = document.getElementById("regLnError");
    lnameError.setAttribute("hidden", true);
    lnameTb.style.borderColor = "";
}

function clearEmailError() {
    let emailTb = document.getElementById("registerEmail");
    var emailError = document.getElementById("regEmailError");
    emailError.setAttribute("hidden", true);
    emailTb.style.borderColor = "";
}

function clearPasswordError() {
    let passwordTb = document.getElementById("registerPassword");
    var passwordError = document.getElementById("regPwError");
    passwordError.setAttribute("hidden", true);
    passwordTb.style.borderColor = "";
}

function clearRepPasswordError() {
    let repPwTb = document.getElementById("repeatPassword");
    var repPwError = document.getElementById("repPwError");
    repPwError.setAttribute("hidden", true);
    repPwTb.style.borderColor = "";
}
