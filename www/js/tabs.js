const TAG_ACTIVE_TAB = " active";

const TABS = {}
TABS.tabcontent = () => document.getElementsByClassName("tabcontent");
TABS.tablinks = () => document.getElementsByClassName("tablinks");
TABS.curtab = (tabname) => document.getElementById(tabname);

/**
 * Open tab content with smooth appearance animation
 * @param evt
 * @param tabname
 * @param tabcontentid
 * @param tablinkid
 */
TABS.opentab = (evt, tabname, tabcontentid, tablinkid) => {
    var i, tabcontent, tablinks;

    tabcontent = TABS.tabcontent();

    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].parentNode.id == tabcontentid) {
            tabcontent[i].style.opacity = 0.0;
            tabcontent[i].style.display = "none";
        }
    }

    tablinks = TABS.tablinks();
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].parentNode.id == tablinkid) {
            tablinks[i].className = tablinks[i].className.replace(TAG_ACTIVE_TAB, "");
        }
    }

    var curTab = TABS.curtab(tabname);
    curTab.style.display = "block";
    setTimeout(function () { curTab.style.opacity = 1.0; }, 10);
    evt.currentTarget.className += TAG_ACTIVE_TAB;
}