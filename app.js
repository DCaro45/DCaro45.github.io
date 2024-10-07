// event listener for the form
document.addEventListener("DOMContentLoaded", () => {
    // Code: JavaScript - Password Match
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

    let navbar = document.querySelector(".navbar");
    // Show/hide sticky navigation and scroll button based on scroll position
    window.onscroll = function () {
      if (document.documentElement.scrollTop > 20) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    }
})
