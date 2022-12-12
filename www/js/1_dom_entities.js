/*jshint esversion: 6 */

/* Temporary storage of classes, for thinking over the structure */

/**
 * Tag for marking open menus
 */
var TAG_OPEN = "opened";

/**
 * Set main page visible
 */
const showMainUi = () => {
    setVisibility("main_ui", true);
}

/* Just for test
    function FILES_PAGE() {

    const progressBtnId  = "progress_btn";
    const abortBtnId = "abort_btn";
    const acceptedInputFileId = "files_input_file";

    this.progressBtn = document.getElementById(progressBtnId);

    this.setAbortBtnVisibility = (visible) => {
        setVisibility(abortBtnId, visible, "table-row");
    }

    this.setProgressBtnVisibility = (visible) => {
        setVisibility(progressBtnId, visible, 'table-row');
    }

    this.setAcceptInputFiles = (accepted) => {
        document.getElementById(acceptedInputFileId).accept = accepted;
    }
}
const FILES = new FILES_PAGE();
*/

/**
 * Files chapter in dash
 */
const FILES = {};
FILES.progressBtnId = "progress_btn";
FILES.progressBtn = () => document.getElementById(FILES.progressBtnId);
FILES.setAbortBtnVisibility = (visible) => {
    setVisibility("abort_btn", visible, "table-row");
}
FILES.setProgressBtnVisibility = (visible)=> {
    setVisibility(FILES.progressBtnId, visible, 'table-row');
}
FILES.setAcceptInputFiles = (accepted) => {
    document.getElementById("files_input_file").accept = accepted;
}

/**
 * Command panel in dash
 * @type {{}}
 */
const COMMAND_PANEL = {};
COMMAND_PANEL.init = () => loadMacroList();
COMMAND_PANEL.getClearMonitorBtn = ()=> document.getElementById("clear_monitor_btn");
COMMAND_PANEL.monitorEnableVerboseMode = ()=> document.getElementById("monitor_enable_verbose_mode");
COMMAND_PANEL.monitorEnableAutoscroll = () => document.getElementById("monitor_enable_autoscroll");

const COMMAND_PANEL__MONITOR = {};
COMMAND_PANEL__MONITOR.getCmdContent = () => document.getElementById('cmd_content');
COMMAND_PANEL__MONITOR.isVerboseModeEnabled = () => COMMAND_PANEL.monitorEnableVerboseMode().checked;
COMMAND_PANEL__MONITOR.isAutoscrollEnabled = () => COMMAND_PANEL.monitorEnableAutoscroll().checked;
COMMAND_PANEL__MONITOR.getCustomCommandView = () => document.getElementById("custom_cmd_txt");
COMMAND_PANEL__MONITOR.getCustomCommand = () => COMMAND_PANEL__MONITOR.getCustomCommandView().value;
COMMAND_PANEL__MONITOR.setCustomCommand = (val) => document.getElementById("custom_cmd_txt").value = val;
COMMAND_PANEL__MONITOR.clearCustomCommand = () => COMMAND_PANEL__MONITOR.setCustomCommand("");


/**
 * Page upper
 */
const NAV_BAR = {};
/**
 * Update UI and FW versions in page
 */
NAV_BAR.setFwName = (fwName) => {
    if (typeof document.getElementById("fwName") != "undefined")
        document.getElementById("fwName").innerHTML = fwName;
}
NAV_BAR.setVersions = (web_ui_version, fw_version)=> {
    //update UI version
    if (typeof document.getElementById("UI_VERSION") != "undefined")
        document.getElementById("UI_VERSION").innerHTML = web_ui_version;

    //update FW version
    if (typeof document.getElementById("FW_VERSION") != "undefined")
        document.getElementById("FW_VERSION").innerHTML = fw_version;
}
NAV_BAR.onOpenMenuBtnClick = ()=> {
    var mainMenu = document.getElementById("main-menu");
    var dropBtn = document.getElementById("dropbtn");

    var isOpened = mainMenu.classList.toggle(TAG_OPEN);
    dropBtn.classList.toggle(TAG_OPEN, isOpened);

    dropBtn.dispatchEvent(onOpenMenuEvent(isOpened));
}
NAV_BAR.mainTab = () => document.getElementById("maintab");
NAV_BAR.mainTab_open = () => {
    document.getElementById("maintablink").click();
}
NAV_BAR.configTab = () => document.getElementById("configtab");
NAV_BAR.configTab_setSmoothieNavVisibility = (visible) => {
    setVisibility("config_smoothie_nav", visible);
}
NAV_BAR.configTab_setTitles = (tabTitle, tabPrinter) => {
    document.getElementById("tab_title_configuration").innerHTML =
        "<span translate>" + tabTitle + "</span>";
    document.getElementById("tab_printer_configuration").innerHTML =
        "<span translate>" + tabPrinter + "</span>";
}

NAV_BAR.settingsTab_setFiltersVisibility = (visible) => {
    setVisibility("settings_filters", visible);
}
NAV_BAR.settingsTab_setXwPositionLabels = () => {
    document.getElementById("control_x_position_label").innerHTML = "Xw";
    document.getElementById("control_y_position_label").innerHTML = "Yw";
    document.getElementById("control_z_position_label").innerHTML = "Zw";
}
NAV_BAR.setShowSdUsed = (direct_sd) => {
    //SD image or not
    if (direct_sd && typeof document.getElementById("showSDused") != "undefined")
        document.getElementById("showSDused").innerHTML =
            "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'><g transform='translate(50,1200) scale(1, -1)'><path  fill='#777777' d='M200 1100h700q124 0 212 -88t88 -212v-500q0 -124 -88 -212t-212 -88h-700q-124 0 -212 88t-88 212v500q0 124 88 212t212 88zM100 900v-700h900v700h-900zM500 700h-200v-100h200v-300h-300v100h200v100h-200v300h300v-100zM900 700v-300l-100 -100h-200v500h200z M700 700v-300h100v300h-100z' /></g></svg>";
    else if (typeof document.getElementById("showSDused") != "undefined")
        document.getElementById("showSDused").innerHTML = "";
}

NAV_BAR.settingsUpdateFWBtn = () => document.getElementById("settings_update_fw_btn");
NAV_BAR.settingsRestartBtn = () => document.getElementById("settings_restart_btn");
NAV_BAR.setConfigTabLinkVisibility = (visible) => {
    setVisibility("configtablink", visible);
}

NAV_BAR.setFwGithubLink = (link) => {
    document.getElementById("FW_github").href = link;
}

NAV_BAR.setDhtHumidity = (val) => {
    document.getElementById("DHT_humidity").innerHTML = val;
}
NAV_BAR.setDhtTemperature = (val) => {
    document.getElementById("DHT_temperature").innerHTML = val;
}

NAV_BAR.lockUi = ()=> document.getElementById("lock_UI");
NAV_BAR.setLockUiBtnVisible = (visible)=>{
    setVisibility('lock_ui_btn', visible);
}
NAV_BAR.lockUi_SetChecked = (forcevalue)=> {
    if (typeof forcevalue != "undefined")
        NAV_BAR.lockUi().checked = forcevalue;
}
NAV_BAR.lockUi_isChecked = () => {
    return NAV_BAR.lockUi().checked;
}
NAV_BAR.lockUi_btnTxt = (txt)=> {
    document.getElementById("lock_UI_btn_txt").innerHTML =
        translateTextItem(txt);
}
NAV_BAR.lockUi_onToggleLock = (forcevalue) => {
    NAV_BAR.lockUi_SetChecked(forcevalue);

    if(NAV_BAR.lockUi_isChecked()) {
        NAV_BAR.lockUi_btnTxt("Unlock interface");

        disable_items(true, NAV_BAR.mainTab(), NAV_BAR.configTab());
        NAV_BAR.settingsUpdateFWBtn().disabled = true;
        NAV_BAR.settingsRestartBtn().disabled = true;

        FILES.progressBtn().disabled = false;

        COMMAND_PANEL.getClearMonitorBtn().disabled = false;
        COMMAND_PANEL.monitorEnableVerboseMode().disabled = false;
        COMMAND_PANEL.monitorEnableAutoscroll().disabled = false;

        disable_items(false, CONTROL_PANEL.jogUI());
        CONTROL_PANEL.jogUI().style.pointerEvents = "none";
    }
    else {
        NAV_BAR.lockUi_btnTxt("Lock interface");

        disable_items(false, NAV_BAR.mainTab(), NAV_BAR.configTab());
        NAV_BAR.settingsUpdateFWBtn().disabled = false;
        NAV_BAR.settingsRestartBtn().disabled = false;
        CONTROL_PANEL.jogUI().style.pointerEvents = "auto";
    }
}

const CONNECT_DIALOG = {};
CONNECT_DIALOG.setLoadProgress = (val) => {
    document.getElementById("load_prg").value = val;
}

const CAMERA = {};
CAMERA.getFrame = () => document.getElementById("camera_frame");
CAMERA.getAddressValue = () => document.getElementById('camera_webaddress').value;
CAMERA.setAddressValue = (val) => {document.getElementById('camera_webaddress').value = val; }
CAMERA.setVisibility = (visible) => {
    document.getElementById('camera_frame').src = visible ? CAMERA.getAddressValue() : "";
    setVisibility('camera_frame_display', visible);
    setVisibility('camera_detach_button', visible, "table-row");
}
