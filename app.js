// Code: JavaScript - Password Match
document.addEventListener("DOMContentLoaded", () => {

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

    const form = document.getElementById("myForm");
    const bioInput = document.getElementById("bio");
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    bioInput.parentNode.insertBefore(errorMessage, bioInput.nextSibling);

    form.addEventListener("submit", (event) => {
        if (bioInput.value.trim() === "") {
            event.preventDefault();
            errorMessage.textContent = "Don't leave me empty!";
            errorMessage.style.display = "block";
        }
        else {
            errorMessage.style.display = "none"; // Hide warning message
        }
    });
})