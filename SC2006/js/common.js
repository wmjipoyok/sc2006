/**
* @module common-js
* @description This file contains functions that can be shared across the whole project. 
Functions being used on multiple pages will be moved here to reduce code duplication and improve code usability.
*/

/**
 * The function titleize takes a string as input and returns a new string with the first letter of each
 * word capitalized.
 * @param {String} str - The input string that needs to be titleized (i.e., have the first letter of each word
 * capitalized).
 * @returns The function `titleize` is returning a modified version of the input string `str` where the
 * first letter of each word is capitalized and all other letters are in lowercase. The function
 * achieves this by first converting the entire string to lowercase, then using a regular expression to
 * match any non-alphanumeric characters followed by a letter, and replacing that letter with its
 * uppercase equivalent. The modified string is then returned
 */
function titleize(str) {
    return (" " + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
        return " " + chr.toUpperCase();
    });
}

/**
 * The function reformatErrorStr reformats an error message string by removing "auth/" and replacing
 * hyphens with spaces, and capitalizing the first letter.
 * @param {String} messageStr - A string that may contain an error message, possibly starting with "auth/". The
 * function reformats the string by removing "auth/" if present, replacing all hyphens with spaces, and
 * capitalizing the first letter of the resulting string.
 * @returns The function `reformatErrorStr` returns a string with the first letter capitalized and with
 * any hyphens replaced with spaces. If the original string includes the substring "auth/", it removes
 * that substring before performing the other modifications.
 */
function reformatErrorStr(messageStr) {
    if (messageStr.includes("auth/")) {
        messageStr = messageStr.substring(5);
    }
    messageStr = messageStr.replace(/-/g, " ");
    var str = messageStr.charAt(0).toUpperCase() + messageStr.slice(1);
    return str;
}

/**
 * The function is called when the user logout to clear the local storage.
 */
function logoutHandler() {
    console.log("called");
    localStorage.clear();
}

/**
 * The function is called when user cancels the logout action to hide the logout modal.
 */
function cancelLogout() {
    document.getElementById("logoutModal").setAttribute("hidden", true);
}

/**
 * The function handles the visibility of notification count and message container based on their
 * content.
 */
function handleMsgCount() {
    const notiCount = document.getElementById('notiCount');
    const alertCon = document.getElementById('alertContainer');

    if (notiCount) {
        if (notiCount.style.visibility != 'hidden') {
            notiCount.style.visibility = 'hidden';
        }
        document.getElementById('notiCount').innerHTML = 0;
    }

    if (alertCon.innerHTML == "") {
        document.getElementById('noAlert').style.visibility = 'visible';
    } else {
        document.getElementById('noAlert').style.visibility = 'hidden';
    }
}

/**
 * The function checks if the notification count is empty and hides the icon if it is.
 */
function checkAlertEmpty() {
    const notiCount = document.getElementById('notiCount');
    const alertItemIcon = document.getElementById('alertItemIcon');
    if (notiCount.innerHTML == "") {
        alertItemIcon.style.visibility = 'hidden';
    }
}

/**
 * The function handles input errors by displaying an error message and changing the border color of
 * the input field to red.
 * @param {String} inputField - The ID of the input field that has an error.
 * @param {String} errorField - The ID of the HTML element where the error message will be displayed.
 * @param {String} errorMsg - The error message to be displayed in the errorField.
 */
function handleInputError(inputField, errorField, errorMsg) {
    let inputF = document.getElementById(inputField);
    var errorF = document.getElementById(errorField);
    if (errorMsg) {
        const eMsg = reformatErrorStr(errorMsg);
        errorF.innerHTML = eMsg;
    }

    errorF.removeAttribute("hidden");
    inputF.style.borderColor = "red";
}

/**
 * The function clears input errors and resets the style of the input field.
 * @param {String} inputField - The ID of the input field that needs to be cleared of errors.
 * @param {String} errorField - The ID of the HTML element that displays the error message for the input field.
 */
function clearInputError(inputField, errorField) {
    let inputF = document.getElementById(inputField);
    var errorF = document.getElementById(errorField);
    errorF.setAttribute("hidden", true);
    inputF.style.borderColor = "";
}

/**
 * The function returns the Firebase configuration object with API keys and other details.
 * @returns a JavaScript object that contains the configuration details for a Firebase project,
 * including the API key, authentication domain, project ID, storage bucket, messaging sender ID, app
 * ID, and measurement ID.
 */
function getFirebaseConfig() {
    return {
        apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
        authDomain: "sc2006-1d9b8.firebaseapp.com",
        projectId: "sc2006-1d9b8",
        storageBucket: "sc2006-1d9b8.appspot.com",
        messagingSenderId: "18363617474",
        appId: "1:18363617474:web:de5535d545b6169e532b5b",
        measurementId: "G-NCKVJ8K4JJ"
    }
}
