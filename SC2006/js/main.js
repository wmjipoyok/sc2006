// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClbXP8Ka7huRW2YkQEUGpT9Of6_bAIWCw",
    authDomain: "sc2006-1d9b8.firebaseapp.com",
    databaseURL: "https://sc2006-1d9b8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sc2006-1d9b8",
    storageBucket: "sc2006-1d9b8.appspot.com",
    messagingSenderId: "18363617474",
    appId: "1:18363617474:web:de5535d545b6169e532b5b",
    measurementId: "G-NCKVJ8K4JJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and add the map
let infoWindow, marker, map;
var cv = new SVY21();
var prev_infowindow = false;

$(function () {
    $("#nav-content").load("nav.html");
    $("#logout-model").load("logout-model.html");
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        localStorage.setItem("userId", uid);
        // ...
    } else {
        // User is signed out
        // ...
    }
});

window.addEventListener('load', function () {
    getData();
    initMap();
    window.initMap = initMap;

    setTimeout(unhideContent, 1000);
}, false);

function unhideContent() {
    document.getElementById("loading").setAttribute('hidden', true);
    document.getElementById("mapContainer").removeAttribute('hidden');
    document.getElementById("nav-content").removeAttribute('hidden');
}

function initMap() {
    // The location of sg (default value if fail to retrieve user's location)
    // const sg = { lat: 1.3318066965765096, lng: 103.71498878810786 };
    const sg = { lat: 1.3483, lng: 103.6831 }; // ntu location
    // The map, centered to sg by default
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15, //was 19
        center: sg,
        zoomControl: true,
    });

    infoWindow = new google.maps.InfoWindow();

    addMarker(1.3483, 103.6831);

    //get user currect location
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const pos = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //             };

    //             //set user's locaton to the map center & add the red market to the map
    //             map.setCenter(pos);
    //             addMarker(position.coords.latitude, position.coords.longitude);
    //         },
    //         () => {
    //             handleLocationError(true, infoWindow, map.getCenter());
    //         }
    //     );
    // } else {
    //     // Browser doesn't support Geolocation
    //     handleLocationError(false, infoWindow, map.getCenter());
    // }
}

function addCarparkMarker(lat, lng, data) {
    const iconImg = {
        url: "../img/carpark-marker.png",
        scaledSize: new google.maps.Size(50, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    }

    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        icon: iconImg,
    });

    const contentString = `<p>Name: ${titleize(data["ppName"])} </p>
                            <span style="margin-right: 5px;"><a href="car-list.html?lat=${lat}&lng=${lng}&name=${data["ppName"]}" class="btn btn-info btn-sm">
                                <span class="text">View Car List</span></a></span>
                                <span style="margin-top: 5px;"><a href="car-form.html?lat=${lat}&lng=${lng}" class="btn btn-info btn-sm">
                                <span class="text">Add Car</span></a></span>`;

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "car park",
    });

    marker.addListener("click", () => {
        if (prev_infowindow) {
            prev_infowindow.close();
        }
        prev_infowindow = infowindow;
        infowindow.open({
            anchor: marker,
            map,
        });
    });
}

//for center red marker
function addMarker(lat, lng) {
    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function getData() {
    // if u wanna access the api, search "Run" in your laptop and run the code below:
    // "chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security"
    // then go to http://localhost:5000

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status == 200) {
            const resultJson = JSON.parse(this.responseText);
            // console.log(resultJson);
            var coordinate;
            var preCoor;
            for (var i in resultJson.Result) {
                if (resultJson.Result[i].geometries[0]) {
                    coordinate = resultJson.Result[i].geometries[0].coordinates;
                    if (coordinate) {
                        if (preCoor == coordinate) {
                            continue;
                        } else {
                            preCoor = coordinate;
                        }

                        var strArr = coordinate.split(",")
                        var latlng = cv.computeLatLon(strArr[1], strArr[0]);
                        addCarparkMarker(latlng.lat, latlng.lon, resultJson.Result[i]);
                    }
                }
            }
        }
    });

    xhr.open("GET", "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details");
    xhr.setRequestHeader("AccessKey", "d42d13f1-6cfa-489b-9940-508afe48dcf8");
    xhr.setRequestHeader("Token", "-52he-b9f47NE4ahfrd-Qe4b99CR0YpMgAA4P1zvfK5ta94dJbec4C9dKt7039a434gd-d446ecUb4a3r88726f1dmvmcur4SDG8");

    xhr.send();
}


