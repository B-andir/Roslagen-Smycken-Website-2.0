var element = document.getElementById("container");
var currentRotation = 0;

function SetDarkMode() {
    let cookie = GetCookie("darkMode");
    
    if (cookie == "false") {
        // Disable Dark Mode
        element.classList.remove("darkMode");
        currentRotation += 180;
    }

    document.querySelector("#darkmodeToggle").style.transform = 'rotate(' + currentRotation + 'deg';
}

function ToggleDarkMode() {

    document.querySelector("#darkmodeToggle").style.transition = 'transform 0.3s, box-shadow 0.2s';
    document.querySelector("#container").style.transition = 'background-color 0.3s';

    if (element.classList.contains("darkMode")) {
        // Disable Dark Mode
        element.classList.remove("darkMode");
        document.cookie = "darkMode=false; path=/";
        currentRotation += 180;
    } else {
        // Set Dark Mode
        element.classList.add("darkMode");
        document.cookie = "darkMode=true; path=/";
        currentRotation += 180;
    }

    document.querySelector("#darkmodeToggle").style.transform = 'rotate(' + currentRotation + 'deg';
}
