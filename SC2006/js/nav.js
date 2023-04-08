const db = firebase.firestore();

//get user's ID
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

function unhideLogout() {
    document.getElementById("logoutModal").removeAttribute("hidden");
}

