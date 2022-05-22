function registerBlock() {
    let registrationForm = document.getElementById("form-modal");
    let loginForm = document.getElementById('login-form');

    console.log(loginForm)

    registrationForm.style.display = 'flex';
    loginForm.style.display = "none";
}

const passIn = document.getElementById('password');
const passVar = document.getElementById('password-varify');
const passTag = document.getElementById('pass-tag');
const btnReg = document.getElementById('btn-register')
const passVarTag = document.getElementById('pass-var-tag');

passIn.addEventListener('keyup', (e) => {

    strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    console.log(strongRegex.test(passIn.value))
    if (strongRegex.test(passIn.value)) {
        passVar.removeAttribute('disabled')
        passTag.innerHTML = "";
    } else {
        if (passIn.value == "") {
            passTag.innerHTML = "";
        } else {
            passTag.innerHTML = " ** Too short minimum 8 charecters **";
            passVar.setAttribute('disabled', 'true')
        }
    }

})

// vlidation on password match
passVar.addEventListener('keyup', (e) => {
    if (passIn.value === passVar.value) {
        btnReg.removeAttribute('disabled')
        passVarTag.innerHTML = ""
    } else {
        passVarTag.innerHTML = "Password does not match"
    }
})