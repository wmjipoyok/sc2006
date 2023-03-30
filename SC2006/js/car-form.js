import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyD4zU0-igHFj_TDWXuTZ9BMwbtr8Z_kHkM",
    authDomain: "fir-c9c47.firebaseapp.com",
    databaseURL: "https://fir-c9c47.firebaseio.com",
    projectId: "fir-c9c47",
    storageBucket: "fir-c9c47.appspot.com",
    messagingSenderId: "732611892783",
    appId: "1:732611892783:web:518baf14f8076858af18da",
    storageBucket: "gs://fir-c9c47.appspot.com"
};


const app = initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = getStorage();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const request = urlParams.get('request');
const carId = urlParams.get('carId');
const carparkLocation = [parseFloat(urlParams.get('lat')), parseFloat(urlParams.get('lng'))]
const imageLimit = 5;
let imageArray = [];
let imgToUpload = [];
let imageUrlList = [];
let jsScript;
let carData;


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

function unhideContent() {
    document.getElementById("carFormContainer").removeAttribute('hidden');
    document.getElementById("carForm").removeAttribute('hidden');
    document.getElementById("addImage").removeAttribute('hidden');
    document.getElementById("loading").setAttribute('hidden', true);
}

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
                    imageArray.push(files[i]);
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
                    if (!files[i].type.match("image/jpeg") || files[i].type.match("image/jpg") || files[i].type.match("image/png")) continue;
                    if (imageArray.every(image => image.name !== files[i].name)) {
                        imageArray.push(files[i]);
                    }
                }
                displayImages();
            }
        })
    }

    let carForm = document.getElementById("carForm");
    carForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let dataVal = e.target.elements;
        const carBrand = dataVal.carBrand.value;
        const carModel = dataVal.carModel.value;
        const carSeats = parseInt(dataVal.carSeats.value);
        const carPrice = parseInt(dataVal.carPrice.value);
        const carDescription = dataVal.carDescription.value;
        // console.log(imgToUpload);
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
                CarOwner: carData.CarOwner
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
}, false);

async function uploadImages(images) {
    const imagePromises = Array.from(images, (image) => uploadImage(image));

    const imageRes = await Promise.all(imagePromises).then((data) => {
        imageUrlList = data;
        // console.log(imageUrlList);
        createCarListing();
    });
    return imageRes;
}

async function uploadImage(image) {
    const storageRef = ref(storage, `/CarImages/${image.name}`);
    const response = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(response.ref);
    return url;
}

async function createCarListing() {
    const carBrand = document.getElementById("carBrand").value;
    const carModel = document.getElementById("carModel").value;
    const carSeats = parseInt(document.getElementById("carSeats").value);
    const carPrice = parseInt(document.getElementById("carPrice").value);
    const carDescription = document.getElementById("carDescription").value;
    const carImages = imageUrlList;
    const userId = localStorage.getItem("userId");

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
        CarOwner: userId
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

function disableInputs() {
    $("#carForm :input").prop("disabled", true);
    document.getElementById("saveLoading").style.visibility = "visible";
}

function displayImages() {
    if ($("#imageContainer img").length >= imageLimit) {
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("dotContatiner").innerHTML = "";
        imgToUpload = [];
        jsScript.remove();
    }

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
}

function addSlideshowJS() {
    var head = document.getElementsByTagName('HEAD')[0];
    jsScript = document.createElement('script');
    jsScript.src = './js/slideshow.js';
    head.appendChild(jsScript);
    document.getElementById("imageLoader").setAttribute("hidden", true);
    document.getElementById("slideshowContainer").removeAttribute("hidden");
}
