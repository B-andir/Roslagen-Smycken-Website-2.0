let logoOriginalImageSource;

function GetCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i < ca.length; i++){
        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function loading(startLoading) {
    let logoElement = document.getElementById("rs-image");

    if (startLoading) {
        logoOriginalImageSource = logoElement.src;
        logoElement.src = "/images/loading.gif";
    } else {
        logoElement.src = logoOriginalImageSource;
    }
}
