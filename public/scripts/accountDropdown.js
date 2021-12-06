let isDown = false;

function HidePopups() {
    document.querySelector("#registerScreen").style.display = 'none';
    document.querySelector("#backgroundBlur").style.display = 'none';
}

function ToggleAccountDropdown() {
    let element = document.querySelector("#accountDropdown");

    element.style.top = isDown ? ('-' + $("#accountDropdown").outerHeight()) : '-1';
    element.style.boxShadow = isDown ? '' : '1px 1px 8px black';

    if (isDown) {
        HidePopups();
    }

    isDown = !isDown;
}

function TogglePopup(target) {
    document.querySelector("#registerScreen").style.display = 'none';
    let loginScreen = document.querySelector(target).style;
    let blurBackground = document.querySelector("#backgroundBlur").style;
    loginScreen.display = loginScreen.display == 'flex' ? 'none' : 'flex';
    blurBackground.display = loginScreen.display == 'none' ? 'none' : 'block';
}

function Login() {
    let loginForm = document.getElementById("loginForm");

    if (loginForm.email.value.length != 0 && loginForm.password.value.length != 0) {
        if (loginForm.email.value.includes('@')) {
            let logoElement = document.getElementById("rs-logo");
            let originalImageSource = logoElement.src;
            logoElement.src = "/images/loading.gif";
            $.post("/api/login", {
                email: loginForm.email.value,
                password: loginForm.password.value,
                keepSignedIn: loginForm.keepLoggedIn.checked
            }, (data, status) => {
                logoElement.src = originalImageSource;
                if (data.error != undefined) {
                    document.getElementById("errorMessageLogin").innerHTML = data.error;
                } else {
                    // location.reload();
                }
            });
        } else {
            document.getElementById("errorMessageLogin").innerHTML = "Invalid Email address."
        }
    }
}

function Register() {
    let registerForm = document.getElementById("registerForm");
    if (registerForm.firstName.value.length != 0 && registerForm.lastName.value.length != 0 && registerForm.password.value.length != 0) {
        if (registerForm.password.value == registerForm.passwordRepeated.value) {
            if (registerForm.email.value.includes('@')) {
                console.log("Success. POST to server");

                $.post("/api/register", {
                    firstName: registerForm.firstName.value,
                    lastName: registerForm.lastName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value
                }, (data, status) => {
                    if (data.error != undefined) {
                        document.getElementById("errorMessageRegister").innerHTML = data.error;
                    } else {
                        location.reload();
                    }
                });
            } else {
                document.getElementById("errorMessageRegister").innerHTML = "Invalid Email address."
            }
        } else {
            document.getElementById("errorMessageRegister").innerHTML = "Passwords do not match."
        }
    } else {
        console.log("Not all fields filled");
    }
}
