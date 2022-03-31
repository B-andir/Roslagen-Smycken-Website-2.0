let isDown = false;
let isBlurred = false;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function HidePopups() {
    ToggleAccountDropdown();
    document.querySelector("#registerScreen").style.display = "none";
}

function ToggleAccountDropdown() {
    let element = document.querySelector("#accountDropdown");
    let dropdownArrow = document.querySelector(".dropdownArrow");
    let blur = document.querySelector("#backgroundBlur");

    element.style.top = isDown
        ? "-" + $("#accountDropdown").outerHeight()
        : "-1";
    dropdownArrow.style.transform = isDown ? "rotate(90deg)" : "rotate(270deg)";
    dropdownArrow.style.marginLeft = isDown ? "2px" : "-5px";
    element.style.boxShadow = isDown ? "" : "1px 1px 8px black";
    blur.style.display = isBlurred ? "none" : "block";

    isDown = !isDown;
    isBlurred = !isBlurred;
}

function ToggleRegisterPopup() {
    let element = document.querySelector("#accountDropdown");
    let register = document.querySelector("#registerScreen");

    element.style.top = "-" + $("#accountDropdown").outerHeight();
    element.style.boxShadow = "";

    register.style.display = register.style.display == "flex" ? "none" : "flex";
}

function Login() {
    let loginForm = document.getElementById("loginForm");

    if (
        loginForm.email.value.length != 0 &&
        loginForm.password.value.length != 0
    ) {
        if (
            loginForm.email.value.includes("@") &&
            loginForm.email.value.includes(".")
        ) {
            let logoElement = document.getElementById("rs-image");
            let originalImageSource = logoElement.src;
            logoElement.src = "/images/loading.gif";

            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: loginForm.email.value,
                    password: loginForm.password.value,
                    keepSignedIn: loginForm.keepLoggedIn.checked,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error != undefined) {
                        logoElement.src = originalImageSource;
                        document.getElementById("errorMessageLogin").innerHTML =
                            res.error;
                    } else {
                        sleep(500);
                        location.reload(true);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            document.getElementById("errorMessageLogin").innerHTML =
                "Invalid Email address format.";
        }
    }
}

function Register() {
    let registerForm = document.getElementById("registerForm");
    if (
        registerForm.firstName.value.length != 0 &&
        registerForm.lastName.value.length != 0 &&
        registerForm.password.value.length != 0
    ) {
        if (registerForm.password.value.length >= 8) {
            if (
                registerForm.password.value ==
                registerForm.passwordRepeated.value
            ) {
                if (registerForm.email.value.includes("@")) {
                    let logoElement = document.getElementById("rs-image");
                    let originalImageSource = logoElement.src;
                    logoElement.src = "/images/loading.gif";

                    fetch("/api/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                        body: JSON.stringify({
                            firstName: registerForm.firstName.value,
                            lastName: registerForm.lastName.value,
                            email: registerForm.email.value,
                            password: registerForm.password.value,
                        }),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            if (res.error != undefined) {
                                logoElement.src = originalImageSource;
                                document.getElementById(
                                    "errorMessageRegister"
                                ).innerHTML = res.error;
                            } else {
                                sleep(500);
                                location.reload(true);
                            }
                        });
                } else {
                    document.getElementById("errorMessageRegister").innerHTML =
                        "Invalid Email address.";
                }
            } else {
                document.getElementById("errorMessageRegister").innerHTML =
                    "Passwords do not match.";
            }
        } else {
            document.getElementById("errorMessageRegister").innerHTML =
                "Password must contain more than 8 characters.";
        }
    } else {
        document.getElementById("errorMessageRegister").innerHTML =
            "Not all fields filled";
    }
}

function Logout() {
    $.post("/api/logout", {}, (data, status) => {
        location.reload();
    });
}
