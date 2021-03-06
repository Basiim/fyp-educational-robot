/*************************************************************************************
 * 
 * 
 * Title: Select Tab
 * 
 * Version: 0.1
 * 
 * Path: /assets/js/selectTab.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the javaScript code for switching between tabs on
 *              the app.
 * 
 * Refrence(s): https://www.w3schools.com/howto/howto_js_tabs.asp
 * 
 * 
 *************************************************************************************/

let selectTab = (evt, tabName) => {
    let tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for(let i = 0; i<tabcontent.length;i++){
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();
