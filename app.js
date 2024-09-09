// Code: JavaScript - Password Match
document.addEventListener("DOMContentLoaded", () => {
    var password1 = document.getElementById('password_1');
    var password2 = document.getElementById('password_2');
    var errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    password2.parentNode.insertBefore(errorMessage, password2.nextSibling);

    password2.addEventListener('input', function() {
        if (password1.value !== password2.value) {
            errorMessage.textContent = 'Passwords do not match!';
        }
        else {
            errorMessage.textContent = '';
        }
    });

    const images = document.getElementsByClassName("bear");
    for(const image of images){
        fetch("https://dog.ceo/api/breeds/image/random")
        .then(response => response.json())
        .then(data => {
            image.src = data.message
            image.width = 100;
            image.height = 100;
        })
    }
})