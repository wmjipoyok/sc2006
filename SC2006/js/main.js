// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
        console.log(user);
        localStorage.setItem("userId", uid);
        // console.log(user);
        // ...
    } else {
        // User is signed out
        // ...
    }
});

document.addEventListener('DOMContentLoaded', function () {
    getData();
    initMap();
    window.initMap = initMap;
}, false);


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

    const contentString = `Name: ${titleize(data["ppName"])} 
                            <div style="margin-top: 5px;"><a href="car-list.html?lat=${lat}&lng=${lng}&name=${data["ppName"]}" class="btn btn-info btn-sm">
                                <span class="text">View Car List</span></div>`;

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
    xhr.setRequestHeader("Token", "F4dtkQmtbxy8pV4Scnfc4dGc@f259vdnRHNkv49fjg5f1TRd0v8j8088ckkDJ-vmdfd7-RdE9a268VWrf9X1R6Vcdpf8bPeTfcVa");

    xhr.send();
}


