// Side Navigation Menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
let mediaIcons = document.querySelector(".media-icons");
let mediaIconsParent = mediaIcons.parentElement;

// Sticky Navigation Menu
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

// Open side navigation
menuBtn.onclick = function () {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  nav.classList.remove("sticky");
  document.querySelector(".menu").appendChild(mediaIcons); // move media-icons into menu
}

// Close side navigation
cancelBtn.onclick = function () {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
  }
  mediaIconsParent.appendChild(mediaIcons); // restore media-icons to original parent
}

// Close side navigation when a menu link is clicked
let navLinks = document.querySelectorAll(".menu li a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
  });
});

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    if (navBar.classList.contains("active")) {
        nav.classList.remove("sticky");
        scrollBtn.style.display = "none";
    }
    else {
      nav.classList.add("sticky");
      scrollBtn.style.display = "block";
    }
  }
  else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
}