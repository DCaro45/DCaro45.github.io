// Code: JavaScript - Password Match
document.addEventListener("DOMContentLoaded", () => {

    const images = document.getElementsByClassName("profile");
    for(const image of images){
        fetch("https://dog.ceo/api/breeds/image/random")
        .then(response => response.json())
        .then(data => {
            image.src = data.message
            image.width = 200;
            image.height = 200;
        })
    }
})