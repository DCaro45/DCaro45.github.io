let header = document.querySelector("header");
let scrollBtn = document.querySelector(".scroll-button a");

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    header.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    header.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
}

// Code: JavaScript - Password Match
document.addEventListener("DOMContentLoaded", () => {

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
