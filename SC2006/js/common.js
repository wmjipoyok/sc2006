//convert to title case 
function titleize(str) {
    return (" " + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
        return " " + chr.toUpperCase();
    });
}

function reformatErrorStr(messageStr) {
    if (messageStr.includes("auth/")) {
        messageStr = messageStr.substring(5);
    }
    messageStr = messageStr.replace(/-/g, " ");
    var str = messageStr.charAt(0).toUpperCase() + messageStr.slice(1);
    return str;
}

function logoutHandler() {
    console.log("called");
    localStorage.clear();
    localStorage.getItem("currToken");
    localStorage.getItem("userId");
}

function handleAlertCount() {
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

function checkAlertEmpty() {
    const notiCount = document.getElementById('notiCount');
    const alertItemIcon = document.getElementById('alertItemIcon');
    if (notiCount.innerHTML == "") {
        alertItemIcon.style.visibility = 'hidden';
    }
}
