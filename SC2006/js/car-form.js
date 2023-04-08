/**
* @module car-form-js
* @description This file renders the 'Add Car' and 'Edit Car' pages.
'Add Car' page allows users to upload the information of the cars they want like to rent out.
'Edit Car' page allows car owners to edit the car information they have uploaded to the system for rent.
*/

/* The below code is importing the necessary modules from Firebase to initialize a Firebase app and use
Firebase Storage. It is using ES6 module syntax to import the `initializeApp` function from the
`firebase-app.js` module and the `getStorage`, `ref`, `uploadBytes`, and `getDownloadURL` functions
from the `firebase-storage.js` module. These functions will be used to interact with Firebase
Storage to upload and download files. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

/* The below code is defining a JavaScript object called `firebaseConfig` which contains the
configuration settings for a Firebase project. These settings include the API key, authentication
domain, database URL, project ID, messaging sender ID, app ID, measurement ID, and storage bucket. */
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    databaseURL: "https://sc2006-1d9b8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sc2006-1d9b8",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ",
    storageBucket: "gs://sc2006-1d9b8.appspot.com"
};

/* The below code is initializing a Firebase app with the provided configuration object, and then
creating a Firestore database instance and a Cloud Storage instance. */
initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = getStorage();

/* The below code is written in JavaScript and it is using the URLSearchParams API to extract query
parameters from the current URL. It is getting the values of three query parameters: 'request',
'carId', and 'lat'/'lng' (latitude and longitude). The values of these parameters are then stored in
variables 'request', 'carId', and 'carparkLocation' respectively. The 'carparkLocation' variable is
an array containing the latitude and longitude values parsed as floats. */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const request = urlParams.get('request');
const carId = urlParams.get('carId');
const carparkLocation = [parseFloat(urlParams.get('lat')), parseFloat(urlParams.get('lng'))];

/* The below code is declaring and initializing several variables in JavaScript. */
const imageLimit = 5;
let imageArray = [];
let imgToUpload = [];
let imageUrlList = [];
let jsScript;
let carData;

/**
 * This function retrieves car information from a database and displays it on a webpage, with certain
 * restrictions on editing based on the user's permissions and the car's status.
 */
function getCarInfo() {
    db.collection("Cars").doc(carId).get().then((doc) => {
        if (doc.exists) {
            carData = doc.data();
            const userId = localStorage.getItem("userId");
            if (doc.data().CarOwner == userId) {
                if (doc.data().Status == 0) {
                    document.getElementById("carBrand").setAttribute('value', doc.data().Brand);
                    document.getElementById("carModel").setAttribute('value', doc.data().Model);
                    document.getElementById("carSeats").setAttribute('value', doc.data().Seats);
                    document.getElementById("carPrice").setAttribute('value', doc.data().Price);
                    document.getElementById("carDescription").innerHTML = doc.data().Description;
                    document.getElementById("carForm").removeAttribute('hidden');
                } else {
                    document.getElementById("warningMsg").innerHTML = "You only can edit when the car is not in pending or rented status.";
                    document.getElementById("warningMsg").removeAttribute('hidden');
                }
            } else {
                document.getElementById("warningMsg").innerHTML = "You do not have the permission to edit the car information";
                document.getElementById("warningMsg").removeAttribute('hidden');
            }

            for (let i = 0; i < carData.Images.length; i++) {
                document.getElementById("imageContainer").innerHTML += `<div class="mySlides">
                <img src="${carData.Images[i]}" class="slideshow-img" alt="image"></div>`
                document.getElementById("dotContatiner").innerHTML += `<span class="dot" onclick="currentSlide(${i + 1})"></span>`
            }

            document.getElementById("imageContainer").innerHTML += `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>`

            //append slideshow javasdcript after images finish loading
            addSlideshowJS();
        } else {
            document.getElementById("warningMsg").innerHTML = "Car information not found.";
            document.getElementById("warningMsg").removeAttribute('hidden');
        }

        document.getElementById("carFormContainer").removeAttribute('hidden');
        document.getElementById("loading").setAttribute('hidden', true);
    }).catch((error) => {
        console.log("Error getting document:", error);
        document.getElementById("loading").setAttribute('hidden', true);
        document.getElementById("warningMsg").innerHTML = "This page is not available at the moment.";
        document.getElementById("warningMsg").removeAttribute('hidden');
        document.getElementById("carFormContainer").removeAttribute('hidden');
    });
}

/**
 * The function unhides certain elements on a webpage.
 */
function unhideContent() {
    document.getElementById("carFormContainer").removeAttribute('hidden');
    document.getElementById("carForm").removeAttribute('hidden');
    document.getElementById("addImage").removeAttribute('hidden');
    document.getElementById("loading").setAttribute('hidden', true);
}

/* The below code is a JavaScript code that is adding an event listener to the window object for the
'load' event. When the page is loaded, it is loading the navigation and logout model HTML files
using jQuery's load() method. */
window.addEventListener('load', function () {
    $(function () {
        $("#nav-content").load("nav.html");
        $("#logout-model").load("logout-model.html");
    });

    if (request == 'edit') {
        getCarInfo();
    } else {
        document.getElementById("pageTitle").innerHTML = "Upload Car";
        setTimeout(unhideContent, 1000);

        handleImageInput();
    }

    submitForm();

}, false);

/**
 * This function handles the submission of a car form, validates the input fields, and updates the car
 * information in the database if it is an edit request, or uploads the images and adds the car
 * information to the database if it is a new car request.
 */
function submitForm() {
    let carForm = document.getElementById("carForm");
    carForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let dataVal = e.target.elements;
        const carBrand = dataVal.carBrand.value;
        const carModel = dataVal.carModel.value;
        const carSeats = parseInt(dataVal.carSeats.value);
        const carPrice = parseInt(dataVal.carPrice.value);
        const carDescription = dataVal.carDescription.value;

        // handle submit
        if (!carBrand) {
            document.getElementById("carBrand").style.borderColor = "red";
            document.getElementById("brandError").removeAttribute("hidden");
            return;
        } else {
            document.getElementById("carBrand").style.borderColor = "";
            document.getElementById("brandError").setAttribute("hidden", true);
        }

        if (!carModel) {
            document.getElementById("carModel").style.borderColor = "red";
            document.getElementById("modelError").removeAttribute("hidden");
            return;
        } else {
            document.getElementById("carModel").style.borderColor = "";
            document.getElementById("modelError").setAttribute("hidden", true);

        }

        if (!carSeats) {
            document.getElementById("carSeats").style.borderColor = "red";
            document.getElementById("seatsError").removeAttribute("hidden");
            return;
        } else {
            document.getElementById("carSeats").style.borderColor = "";
            document.getElementById("seatsError").setAttribute("hidden", true);
        }

        if (!carPrice) {
            document.getElementById("carPrice").style.borderColor = "red";
            document.getElementById("priceError").removeAttribute("hidden");
            return;
        } else {
            document.getElementById("carPrice").style.borderColor = "";
            document.getElementById("priceError").setAttribute("hidden", true);
        }

        if (!carPrice) {
            document.getElementById("carPrice").style.borderColor = "red";
            document.getElementById("priceError").removeAttribute("hidden");
            return;
        } else {
            document.getElementById("carPrice").style.borderColor = "";
            document.getElementById("priceError").setAttribute("hidden", true);
        }

        if (imgToUpload.length <= 0 && request == null) {
            document.getElementById("imageBox").style.border = "2px dotted red";
            document.getElementById("imgError").innerHTML = "Image cannot be empty";
            document.getElementById("imgError").removeAttribute("hidden");
            return;
        }

        if (request == 'edit') {
            db.collection("Cars").doc(carId).set({
                Brand: carBrand,
                Model: carModel,
                Seats: carSeats,
                Price: carPrice,
                Description: carDescription,
                Status: carData.Status,
                Images: carData.Images,
                Rating: carData.Rating,
                Carpark: carData.Carpark,
                CarOwner: carData.CarOwner,
                CreateDateTime: carData.CreateDateTime
            })
                .then(() => {
                    document.getElementById("successMsg").innerHTML = "Car information has been updated!";
                    document.getElementById("successMsg").removeAttribute('hidden');
                })
                .catch((error) => {
                    console.error("Error updating car information: ", error);
                });
        } else {
            disableInputs();
            uploadImages(imgToUpload);
        }
    });
}

/**
 * The function handles image input through both click and browse, as well as drag and drop, and
 * displays the images.
 */
function handleImageInput() {
    //for images
    let input = document.querySelector(".input-div input");

    // click & browse 
    input.addEventListener("change", () => {
        const files = input.files;
        if (files.length > 0) {
            document.getElementById("imageBox").style.border = "2px dotted grey";
            document.getElementById("imgError").setAttribute("hidden", true);
            document.getElementById("slideshowContainer").setAttribute("hidden", true);
            document.getElementById("imageLoader").removeAttribute("hidden");
            const spaceAva = imageLimit - $("#imageContainer img").length;
            let limit;
            if (spaceAva == 0 && files.length >= imageLimit) {
                limit = imageLimit;
            } else if (spaceAva == 0 && files.length < imageLimit) {
                limit = files.length;
            } else {
                limit = spaceAva < files.length ? spaceAva : files.length;
            }

            for (let i = 0; i < limit; i++) {
                if (files[i].type.match("image/jpeg") || files[i].type.match("image/jpg") || files[i].type.match("image/png") || files[i].type.match("image/gif")) {
                    imageArray.push(files[i]);
                };
            }
            displayImages();
        }
    })

    // drag & drop
    input.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById("imageBox").style.border = "2px dotted grey";
            document.getElementById("imgError").setAttribute("hidden", true);
            document.getElementById("slideshowContainer").setAttribute("hidden", true);
            document.getElementById("imageLoader").removeAttribute("hidden");
            e.preventDefault();

            let limit = files.length >= imageLimit ? imageLimit : files.length;
            for (let i = 0; i < limit; i++) {
                if (files[i].type.match("image/jpeg") || files[i].type.match("image/jpg") || files[i].type.match("image/png") || files[i].type.match("image/gif")) {
                    if (imageArray.every(image => image.name !== files[i].name)) {
                        imageArray.push(files[i]);
                    }
                };
            }
            displayImages();
        }
    })
}

/**
 * The function uploads multiple images and returns a promise that resolves with an array of image
 * URLs.
 * @param {File} images - The `images` parameter is an array of image files that are to be uploaded.
 * @returns the result of the `Promise.all()` method, which is a promise that resolves to an array of
 * the results of the input promises. However, since the `Promise.all()` method is being used with the
 * `await` keyword, the function will not return until all the promises in the `imagePromises` array
 * have resolved or rejected. Once all the promises have resolved.
 */
async function uploadImages(images) {
    const imagePromises = Array.from(images, (image) => uploadImage(image));

    const imageRes = await Promise.all(imagePromises).then((data) => {
        imageUrlList = data;
        createCarListing();
    });
    return imageRes;
}

/**
 * The function uploads an image to Firebase storage and returns its download URL.
 * @param {File} image - The image parameter is a file object that represents the image file to be uploaded to
 * the Firebase storage. It contains information such as the file name, size, and type.
 * @returns a URL that points to the uploaded image in the Firebase storage.
 */
async function uploadImage(image) {
    const storageRef = ref(storage, `/CarImages/${image.name}`);
    const response = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(response.ref);
    return url;
}

/**
 * This function creates a new car listing in a database with information provided by the user.
 */
async function createCarListing() {
    const carBrand = document.getElementById("carBrand").value;
    const carModel = document.getElementById("carModel").value;
    const carSeats = parseInt(document.getElementById("carSeats").value);
    const carPrice = parseInt(document.getElementById("carPrice").value);
    const carDescription = document.getElementById("carDescription").value;
    const carImages = imageUrlList;
    const userId = localStorage.getItem("userId");
    const currentDateTime = new Date();
    const createDateTime = currentDateTime.toLocaleDateString("fr-ca") + " " + currentDateTime.toLocaleTimeString('it-IT');

    await db.collection("Cars").add({
        Brand: carBrand,
        Model: carModel,
        Seats: carSeats,
        Price: carPrice,
        Description: carDescription,
        Status: 0,
        Images: carImages,
        Rating: 0,
        Carpark: carparkLocation,
        CarOwner: userId,
        CreateDateTime: createDateTime
    })
        .then(() => {
            document.getElementById("successMsg").innerHTML = "Car listing has been uploaded!";
            document.getElementById("successMsg").removeAttribute('hidden');
            document.getElementById("saveLoading").setAttribute('hidden', true);
        })
        .catch((error) => {
            console.error("Error updating car information: ", error);
        });
}

/**
 * The function disables all input fields in a form and shows a loading icon.
 */
function disableInputs() {
    $("#carForm :input").prop("disabled", true);
    document.getElementById("saveLoading").style.visibility = "visible";
}

/**
 * The function displays images in a slideshow format and removes them if the image limit is reached.
 */
function displayImages() {
    if ($("#imageContainer img").length >= imageLimit) {
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("dotContatiner").innerHTML = "";
        imgToUpload = [];
        jsScript.remove();
    }

    if (imageArray.length > 0) {
        imageArray.forEach((image, index) => {
            imgToUpload.push(image);
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("imageContainer").innerHTML += `<div class="mySlides">
            <img src="${e.target.result}" class="slideshow-img" alt="image"></div>`
                document.getElementById("dotContatiner").innerHTML += `<span class="dot" onclick="currentSlide(${index + 1})"></span>`
            };
            reader.readAsDataURL(image);
        });
        document.getElementById("imageContainer").innerHTML += `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
        <a class="next" onclick="plusSlides(1)">&#10095;</a>`

        var len = $('script[src="./js/slideshow.js"]').length;

        if (len != 0) {
            jsScript.remove();
        }

        setTimeout(addSlideshowJS, 2000);
        imageArray = [];
    } else {
        document.getElementById("imgError").innerHTML = "Image in wrong format.";
        document.getElementById("imgError").removeAttribute("hidden");
        document.getElementById("imageLoader").setAttribute("hidden", true);
    }
}

/**
 * This function adds a JavaScript file for a slideshow and hides an image loader while revealing a
 * slideshow container.
 */
function addSlideshowJS() {
    var head = document.getElementsByTagName('HEAD')[0];
    jsScript = document.createElement('script');
    jsScript.src = './js/slideshow.js';
    head.appendChild(jsScript);
    document.getElementById("imageLoader").setAttribute("hidden", true);
    document.getElementById("slideshowContainer").removeAttribute("hidden");
}
