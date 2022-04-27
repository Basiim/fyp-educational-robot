/*************************************************************************************
 * 
 * 
 * Title: Menu
 * 
 * Version: 
 * 
 * Path: /assets/js/menu.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the javaScript code for the hamburger menu for
 *              mobile responsive app.
 * 
 * Refrence(s): https://dev.to/devggaurav/let-s-build-a-responsive-navbar-and-hamburger-menu-using-html-css-and-javascript-4gci
 * 
 * 
 *************************************************************************************/

const hamburger = document.querySelector(".hamburger");
const mobileNavMenu = document.querySelector(".mobileNavMenu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    mobileNavMenu.classList.toggle("active");
}
const navLink = document.querySelectorAll(".navLink");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    mobileNavMenu.classList.remove("active");
}
