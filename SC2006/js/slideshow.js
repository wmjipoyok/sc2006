/**
* @module slideshow-js
* @description The javascript file is for creating and controlling image slideshow used in displaying images
*/


/* `slideIndex = 1;` is initializing the variable `slideIndex` to the value of 1. This variable is used
to keep track of the current slide being displayed in the slideshow. By setting it to 1, the first
slide in the slideshow will be displayed when the `showSlides()` function is called. */
slideIndex = 1;


/** 
* Initialize the function showSlides() 
* @param {Number} slideIndex - The starting index is 1
*/
/* `showSlides(slideIndex);` is initializing the slideshow by calling the `showSlides()` function with
the starting index of 1 as the argument. This will display the first image in the slideshow and set
the active dot below the slideshow to the first dot. */
showSlides(slideIndex);



/**
 * The function `plusSlides` changes the current slide by a specified amount.
 * @param {Number} n - The parameter "n" is a number that represents the amount of slides to move forward or
 * backward in a slideshow. It can be a positive or negative integer.
 */
function plusSlides(n) {
    showSlides(slideIndex += n);
}


/**
 * The function sets the current slide to be displayed in a slideshow.
 * @param {Number} n - The parameter "n" in the function "currentSlide(n)" represents the slide number that we
 * want to display. It is used to set the value of the "slideIndex" variable which is then passed as an
 * argument to the "showSlides()" function to display the corresponding slide.
 */
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/**
 * The function shows a specific slide and updates the corresponding dot to indicate it is active.
 * @param {Number} n - The parameter "n" represents the slide number that needs to be displayed.
 */
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}