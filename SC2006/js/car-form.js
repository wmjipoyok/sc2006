import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
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
const imageLimit = 5;
let imageArray = [];
let imgToUpload = [];
let imageURL = [];
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
        }
        document.getElementById("warningMsg").innerHTML = "Car information not found.";
        document.getElementById("warningMsg").removeAttribute('hidden');
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
        console.log(imgToUpload);
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

        if (imgToUpload.length <= 0) {
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
                    document.getElementById("successMsg").removeAttribute('hidden');
                })
                .catch((error) => {
                    console.error("Error updating car information: ", error);
                });
        } else {
            uploadImage(imgToUpload[0]);
            console.log(imageURL);
        }
    });
}, false);

function uploadImage(img) {
    const imagesRef = ref(storage, 'CarImages/' + img.name);
    const metadata = {
        contentType: img.type
    }

    const uploadTask = uploadBytesResumable(imagesRef, img, metadata);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imageURL.push(downloadURL);
                console.log(downloadURL);
            });
        }
    );

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
