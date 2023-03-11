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
