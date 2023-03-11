//convert to title case 
function titleize(str) {
    return (" " + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
        return " " + chr.toUpperCase();
    });
}

function reformatErrorStr(messageStr) {
    messageStr = messageStr.substring(5);
    messageStr = messageStr.replace(/-/g, " ");
    messageStr = titleize(messageStr);
    return messageStr;
}
