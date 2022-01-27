let isDown = false;
let isBlurred = false;

function HidePopups() {
    ToggleAccountDropdown();
    document.querySelector("#registerScreen").style.display = 'none';
}

function ToggleAccountDropdown() {
    let element = document.querySelector("#accountDropdown");
    let blur = document.querySelector("#backgroundBlur");

    element.style.top = isDown ? ('-' + $("#accountDropdown").outerHeight()) : '-1';
    element.style.boxShadow = isDown ? '' : '1px 1px 8px black';
    blur.style.display = isBlurred ? 'none' : 'block';

    isDown = !isDown;
    isBlurred = !isBlurred;
}

function ToggleRegisterPopup() {
    let element = document.querySelector("#accountDropdown");
    let register =  document.querySelector("#registerScreen");

    element.style.top = ('-' + $("#accountDropdown").outerHeight());
    element.style.boxShadow = '';

    register.style.display = register.style.display == 'flex' ? 'none' : 'flex';
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
                    location.reload();
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

function Logout() {
    $.post("/api/logout", {}, (data, status) => {
        location.reload();
    });
}
