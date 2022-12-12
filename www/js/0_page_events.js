/*jshint esversion: 6 */

/*
    To combine all the events of the page in one place
 */

window.onload = function () {

    //Resume saved theme
    set_theme(get_current_theme());

    //to check if javascript is disabled like in anroid preview
    document.getElementById("loadingmsg").style.display = "none";

    console.log("Connect to board");
    connectDlg();

    //ugly hack for IE
    console.log(navigator.userAgent);
    if (getBrowserType("IE")) {
        document.getElementById("control-body").className = "panel-body";
        document.getElementById("extruder-body").className =
            "panel-body panel-height";
        document.getElementById("command-body").className = "panel-body";
        document.getElementById("file-body").className =
            "panel-body panel-height panel-max-height panel-scroll";
    }
};
window.onresize = function (x) {
// removeIf(production)
    console.log("On resize: w[" + window.screen.availWidth+"],[h:"+window.screen.availHeight+"]");
// endRemoveIf(production)
}

/**
 * Some menu opening event
 */
const EVENT_MENU_OPEN = 'onmenuopen';
let onOpenMenuEvent = (isOpened) => new CustomEvent(EVENT_MENU_OPEN, { bubbles: true, detail : { isOpen:isOpened} });
