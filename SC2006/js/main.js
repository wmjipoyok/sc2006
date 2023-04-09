/**
* @module main-js
* @description This file renders the 'Map' page. The page allows users to see a map with their current locations and car park locations indicated in different markers.
Users can easily find nearby car parks based on their current location which is located at the centre of the map.
*/

/* Importing the `initializeApp` function from the Firebase App module version 9.17.2, which is hosted
on the URL "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js". This function is used to
initialize a Firebase app with the provided configuration. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

/* `initializeApp(getFirebaseConfig());` is initializing a Firebase app with the provided
configuration. The `getFirebaseConfig()` function is defined common.js which returns an object 
containing the configuration settings for the Firebase app, such as the API key,
project ID, and messaging sender ID. */
initializeApp(getFirebaseConfig());

/* `let infoWindow, map; var prev_infowindow = false;` is declaring three variables: `infoWindow`,
`map`, and `prev_infowindow`. */
let infoWindow, map;
var prev_infowindow = false;

/* `var cv = new SVY21();` is creating a new instance of the `SVY21` class and assigning it to the
variable `cv`. This class is used to convert coordinates between the SVY21 projection system used in
Singapore and the standard latitude and longitude system. It is being used in the `getData()`
function to convert the car park coordinates from SVY21 to latitude and longitude coordinates that
can be used to add markers to the Google Map. */
var cv = new SVY21();


/* This code is using jQuery to load the contents of the "nav.html" and "logout-model.html" files into
the respective HTML elements with the IDs "nav-content" and "logout-model". The code is wrapped in a
jQuery shorthand for the document ready event, which ensures that the code is executed only after
the DOM has finished loading. */
$(function () {
    $("#nav-content").load("nav.html");
    $("#logout-model").load("logout-model.html");
});

/* This code is listening for changes in the authentication state of the Firebase app. When the
authentication state changes, the callback function is called with the `user` object as its
argument. If `user` is not null, meaning that the user is authenticated, the function retrieves the
user's unique ID (`uid`) and stores it in the browser's local storage under the key "userId". This
allows the user's ID to be accessed and used in other parts of the application. */
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        localStorage.setItem("userId", uid);
    }
});

/* This code is adding an event listener to the `window` object for the `load` event. When the `load`
event is fired, the `getData()` and `initMap()` functions are called. The `initMap()` function is
also assigned to the `window.initMap` property, which allows it to be accessed by the Google Maps
API. Finally, the `unhideContent()` function is called after a delay of 1000 milliseconds using the
`setTimeout()` function. This function removes the `hidden` attribute from the `mapContainer` and
`nav-content` elements, making them visible to the user. */
window.addEventListener('load', function () {
    getData();
    initMap();
    window.initMap = initMap;

    setTimeout(unhideContent, 1000);
}, false);

/**
 * The function unhides certain elements on a webpage.
 */
function unhideContent() {
    document.getElementById("loading").setAttribute('hidden', true);
    document.getElementById("mapContainer").removeAttribute('hidden');
    document.getElementById("nav-content").removeAttribute('hidden');
}

/**
 * The function initializes a Google Map centered on NTU or the user's current location if available,
 * and adds a marker to the map at the user's location.
 */
function initMap() {
    // The location of ntu (default value if fail to retrieve user's location)
    const ntuLocation = { lat: 1.3483, lng: 103.6831 };
    // The map, centered to sg by default
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: ntuLocation,
        zoomControl: true,
    });

    infoWindow = new google.maps.InfoWindow();

    addMarker(1.3483, 103.6831);

    // get user currect location
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

/**
 * The function adds a marker to a Google Map with a custom icon and an info window containing
 * information about a car park, including links to view the car list and add a car.
 * @param {String} lat - The latitude coordinate of the car park marker's position.
 * @param {String} lng - The longitude coordinate of the car park marker's position on the map.
 * @param {Object} data - The `data` parameter is an object that contains information about a car park, such as
 * its name (`ppName`). This information is used to populate the content of the marker's info window.
 */
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

/**
 * The function adds a marker to a Google Maps based on user's current location (latitude and longitude) and center the map to the location.
 * @param {Number} lat - The latitude of the location where the marker will be placed.
 * @param {Number} lng - The longitude coordinate of the location where the marker will be placed.
 */
//for the red marker at the center to indicate user's current location
function addMarker(lat, lng) {
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
    });
}

/**
 * The function handles errors related to geolocation services and displays appropriate messages.
 * @param {Boolean} browserHasGeolocation - A boolean value indicating whether the user's browser supports
 * geolocation or not.
 * @param {Object} infoWindow - The infoWindow parameter is an object that represents a popup window that can
 * display information on a Google Maps API map. It can be used to display messages, images, or other
 * content related to a specific location on the map. In this function, it is used to display an error
 * message when the ge
 * @param {Object} pos - pos is a variable that represents the position (latitude and longitude) of the user's
 * current location obtained through the Geolocation service. It is used to set the position of the
 * infoWindow that displays an error message if the Geolocation service fails or if the user's browser
 * doesn't support geolocation.
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

/**
 * The function retrieves car park details from the URA API (ura.gov.sg) and adds markers to a map based on the
 * coordinates provided in the API response. The API returns the car park coordinates in Singapore SVY21 format so svy21.js library is used 
 * to convert the coordinates to latitude and longitude coordinates and so that we can display the car park locations in Google Maps.
 */
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status == 200) {
            const resultJson = JSON.parse(this.responseText);
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
    xhr.setRequestHeader("Token", "n1PWhfG7wj-8-JuPf9c94f4wuygkx996442bDmMeGjuY4-NcfSfx28hM88cb3ZmdJKdfk2P85ZcdQ@NV@TSCVB4uAf6teJSwND14");

    xhr.send();
}


