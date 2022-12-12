//To switch themes (Light/Dark)
const TAG_THEME = "theme", TAG_LIGHT = "light", TAG_DARK = "dark";

/**
 * Switch theme between dark and light
 */
function switch_theme() {
    var body = document.documentElement;
    var current_theme = body.getAttribute(TAG_THEME);

    if (current_theme === TAG_DARK) {
        current_theme = TAG_LIGHT;
    } else {
        current_theme = TAG_DARK;
    }

    set_theme(current_theme);
    localStorage.setItem(TAG_THEME, current_theme);
}

function set_theme(theme, switcher_id = "theme-switcher"){
    var body = document.documentElement;
    body.setAttribute(TAG_THEME, theme);

    var tSwitch = document.getElementById(switcher_id);
    tSwitch.setAttribute(TAG_THEME, theme);
}

/**
 * Get current theme
 * @returns {string} return dark(default)/light string
 */
function get_current_theme() {
    var cur_theme = localStorage.getItem(TAG_THEME);

    if (cur_theme === null) {
        cur_theme = TAG_DARK;
    }

    //console.log("CURRENT THEME: " + cur_theme);
    return cur_theme;
}