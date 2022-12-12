//Temporary file for working out the design change

document.addEventListener("DOMContentLoaded", onload);

var animation_time = 1;

function onload() {
    prepareAll();
    trigerAll();
}

function onExtruderClick() {
    trigerAll();
}

function onMouseIn(path) {
    animate(path, "stroke-width", 4, 0.5);
}

function onMouseOut(path) {
    animate(path, "stroke-width", 2, 0.5);
}

function onClick() {
    trigerAll(path);
}

function prepareAll() {
    var toHide = document.getElementsByTagName("path");

    for (var i = 0; i < toHide.length; i++) {
        if (toHide[i].hasAttribute("class").valueOf("hide_on_start")) {
            prepare(toHide[i]);
        }
    }
}

function getResolution(display) {
    display.innerText = "Resolution width " + window.screen.width;
    console.log("Display: " + display.innerText);
}

function trigerAll() {
    var toHide = document.getElementsByTagName("path");

    for (var i = 0; i < toHide.length; i++) {
        if (toHide[i].hasAttribute("class").valueOf("hide_on_start")) {
            if (toHide[i]["show"])
                hide(toHide[i]);
            else
                show(toHide[i]);

            console.log("Show: " + toHide[i]);
        }
    }
}

function clear(path) {
}

function prepare(path) {
    var length = path.getTotalLength();

    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = 'none';

    // Set up the starting positions
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
}

function show(path) {
    animate(path, 'stroke-dashoffset', 0, animation_time);
    path["show"] = true;
}

function hide(path) {
    var length = path.getTotalLength();
    animate(path, 'stroke-dashoffset', length, animation_time);
    path["show"] = false;
}

/**
 * Animation via properties in style
 * @param {*} object Object for animation
 * @param {*} property Property for animation
 * @param {*} to To this value
 * @param {*} time From this time
 */
function animate(object, property, to, time) {
    object.style[property] = object.style.WebkitTransition = property + ' ' + time + 'S ease-in-out';
    object.style[property] = to;
}

function animateStroke(object, from, to) {
    var start = Date.now(); // remember start time
    var time = animation_time * 500;
    var interval = 100; // 2.0 > 4.0 | - | 2.0

    console.log("Animate from:" + from + "; to:" + to + "; ");

    var timer = setInterval(function () {
        var timePassed = Date.now() - start;
        var step = timePassed / time;

        if (timePassed >= time) {
            object.style.strokeWidth = to;
            clearInterval(timer);
            return;
        }

        var width = from + ((to - from) * step);
        object.style.strokeWidth = width;

        console.log("Step:" + step + ";" + "width: " + width);
    }, interval);
}

/*function onAddBtnClick(btn){
    const ELLS = btn.getElementsByTagName("span");
    for(var i=0; i<ELLS.length; i++) {
        ELLS[i].classList.contains("active") ?
            ELLS[i].classList.remove("active") : ELLS[i].classList.add("active");
 }
}*/
