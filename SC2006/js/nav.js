/**
* @module nav-js
* @description This file renders the navigation bar that appears at the top of most of the pages.
Since navigation bar needs to be implemented in most of the pages, 
we make it a stand-alone file which increases the code maintainability and reusability.
*/

/* `const db = firebase.firestore();` is initializing a Firestore database instance and assigning it to
the constant variable `db`. This allows the code to interact with the Firestore database using the
`db` variable. */
const db = firebase.firestore();

/* This code is using Firebase Authentication to check if a user is signed in or signed out. If the
user is signed in, it retrieves the user's document from the "Users" collection in Firestore using
the user's unique ID, and then updates the DOM with the user's first name. It also retrieves any
messages that were sent to the user from the "Messages" collection in Firestore, and displays them
in a dropdown menu on the page. If the user is signed out, it logs the current user as null. The
`onAuthStateChanged` method is used to listen for changes in the user's authentication state, and
the code inside the method is executed whenever the user's authentication state changes. */
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        const userID = user.uid;

        //get user's doc from "Users" collection
        db.collection("Users").doc(userID).get().then((doc) => {
            if (doc.exists) {
                //retrieve user data from doc
                const userData = doc.data();
                const firstName = userData.FirstName;

                //update DOM with retrieved data
                document.getElementById("nav-name").innerHTML = firstName;
            } else {
                console.log("No such document!", doc);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        db.collection("Messages").where("ReceiverId", "==", userID).orderBy("DateTime", "desc").get()
            .then((msgSnapshot) => {
                const msgDocs = msgSnapshot.docs; //need js array since the snapshot does not have a index for forEach 
                msgDocs.forEach((doc, index) => {
                    const alerts = document.getElementById('alertContainer');
                    alerts.innerHTML += `<a class="dropdown-item d-flex align-items-center" href="car-detail.html?carId=${doc.data().CarId}">
                            <div class="mr-3">
                                <div class="icon-circle bg-primary">
                                    <i class="fas fa-envelope text-white"></i>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">${doc.data().DateTime}</div>
                                <span class="font-weight-bold">${doc.data().Message}</span>
                            </div>
                        </a>`
                });
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
    else {
        // User is signed out.
        console.log(firebase.auth().currentUser);
    }
})

/**
 * The function unhideLogout removes the "hidden" attribute from an HTML element with the ID
 * "logoutModal".
 */
function unhideLogout() {
    document.getElementById("logoutModal").removeAttribute("hidden");
}

