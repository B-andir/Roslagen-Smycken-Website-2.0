function toggleDarkMode(){
    const element = document.getElementById("container")
    if (element.classList.contains("darkMode")){
        element.classList.remove("darkMode");
    } else {
        element.classList.add("darkMode");
    }
}
