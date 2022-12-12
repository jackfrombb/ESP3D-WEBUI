var interval_position = -1;
var control_macrolist = [];

/**
 * Control panel in dash
 * @type {{}}
 */
const CONTROL_PANEL = {};
CONTROL_PANEL.jogUI = () => document.getElementById("JogUI");
CONTROL_PANEL.setPositionLabel = (axis, val) => {
    document.getElementById("control_"+ axis+ "_position_label").innerHTML = val;
}
CONTROL_PANEL.setAutoCheckControlVisibility = (visible) => {
    setVisibility("auto_check_control", visible, "flex")
}
CONTROL_PANEL.setMottorOffControlVisibility = (visible) => {
    setVisibility("motor_off_control", visible, 'table-row');
}

CONTROL_PANEL.getAutoCheckPostionCheckBox = () => document.getElementById('autocheck_position');
CONTROL_PANEL.isAutoCheckPosition = () => CONTROL_PANEL.getAutoCheckPostionCheckBox().checked;
CONTROL_PANEL.setAutoCheckPosition = (val) => CONTROL_PANEL.getAutoCheckPostionCheckBox().checked = val;
CONTROL_PANEL.getAutoCheckInterval = () => parseInt(document.getElementById('posInterval_check').value);
CONTROL_PANEL.setAutoCheckInterval = (val) => document.getElementById('posInterval_check').value = val;

/**
 * Set controls visibility
 * @param visible true if visible
 * @param panelFlag set for: 0 = ALL, 1 = btns, 2 = rows
 */
CONTROL_PANEL.setXYZControlVisibility = (visible, panelFlag= 0) => {
    if(panelFlag === 0 || panelFlag === 1) {
        setVisibility("zero_xyz_btn", visible, "block");
        setVisibility("zero_x_btn", visible, "block");
        setVisibility("zero_y_btn", visible, "block");
        setVisibility("zero_z_btn", visible, "block");
    }
    if(panelFlag === 0 || panelFlag === 2) {
        setVisibility("control_xm_position_row", visible, "table-row");
        setVisibility("control_ym_position_row", visible, "table-row");
        setVisibility("control_zm_position_row", visible, "table-row");
    }

}
CONTROL_PANEL.setAxisControlsVisibility = (visible) => {
        setVisibility('JogBar', visible);
        setVisibility('HomeZ', visible);
        setVisibility('CornerZ', !visible);
        setVisibility('control_z_position_display', visible);
        setVisibility('control_zm_position_row',
            visible && ((target_firmware === "grbl-embedded") || (target_firmware === "grbl")));
        setVisibility('z_velocity_display', visible, 'inline');
}

CONTROL_PANEL.getXYVelocity = () => parseInt(document.getElementById('control_xy_velocity').value);
CONTROL_PANEL.setXYVelocity = (val) => document.getElementById('control_xy_velocity').value = val;

CONTROL_PANEL.getZVelocity = () => parseInt(document.getElementById('control_z_velocity').value);
CONTROL_PANEL.setZVelocity = (val) => document.getElementById('control_z_velocity').value = val;

CONTROL_PANEL.getSelectAxisValue = () => document.getElementById('control_select_axis').value;

CONTROL_PANEL.setAxisPosition = (axisName, value) => {
    document.getElementById('control_' + axisName + '_position').innerHTML = value;
}

CONTROL_PANEL.setAxisPositions = (x, y, z) => {
    CONTROL_PANEL.setAxisPosition('x', x);
    CONTROL_PANEL.setAxisPosition('y', y);
    CONTROL_PANEL.setAxisPosition('z', z);
}

CONTROL_PANEL.setMacroList = (content) =>
    document.getElementById('Macro_list').innerHTML = content;

/*NOT IN USE
function initControlsPanel() {
    loadmacrolist();
}
*/
/*NOT IN USE
function hideAxiscontrols() {
    document.getElementById('JogBar').style.display = 'none';
    document.getElementById('HomeZ').style.display = 'none';
    document.getElementById('CornerZ').style.display = 'block';
    document.getElementById('control_z_position_display').style.display = 'none';
    document.getElementById('control_zm_position_row').style.display = 'none';
    document.getElementById('z_velocity_display').style.display = 'none';
}
*/
/* NOT IN USE
function showAxiscontrols() {
    document.getElementById('CornerZ').style.display = 'none';
    document.getElementById('JogBar').style.display = 'block';
    document.getElementById('HomeZ').style.display = 'block';
    document.getElementById('control_z_position_display').style.display = 'block';
    if ((target_firmware == "grbl-embedded") || (target_firmware == "grbl")) {
        document.getElementById('control_zm_position_row').style.display = 'table-row';
    }
    document.getElementById('z_velocity_display').style.display = 'inline';
}
*/

function loadMacroList() {
    control_macrolist = [];
    var url = "/macrocfg.json" + "?" + Date.now();

    //removeIf(production)
    var response = "[{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":0},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":1},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":2},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":3},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":4},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":5},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":6},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":7},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":8}]";
    processMacroGetSuccess(response);
    return;
    //endRemoveIf(production)

    sendGetHttp(url, processMacroGetSuccess, processMacroGetFailed);
}

function macroBuildList(response_text) {
    var response = [];
    try {
        if (response_text.length !== 0) {
            response = JSON.parse(response_text);
        }
    }
    catch (e) {
        console.error("Parsing error:", e);
    }
    for (var i = 0; i < 9; i++) {
        var entry;
        if ((response.length !== 0)
            && (typeof(response[i].name) !== 'undefined'
                && typeof(response[i].glyph) !== 'undefined'
                && typeof(response[i].filename) !== 'undefined'
                && typeof(response[i].target) !== 'undefined'
                && typeof(response[i].class) !== 'undefined'
                && typeof(response[i].index) !== 'undefined')) {
            entry = {
                name: response[i].name,
                glyph: response[i].glyph,
                filename: response[i].filename,
                target: response[i].target,
                class: response[i].class,
                index: response[i].index
            };
        }
        else {
            entry = {
                name: '',
                glyph: '',
                filename: '',
                target: '',
                class: '',
                index: i
            };
        }
        control_macrolist.push(entry);
    }
    controlBuildMacroUi();
}

function processMacroGetSuccess(response) {
    if (response.indexOf("<HTML>") === -1)
        macroBuildList(response);
    else
        macroBuildList("");
}

function processMacroGetFailed(errorcode, response) {
    console.log("Error " + errorcode + " : " + response);
    macroBuildList("");
}

function onAutoCheckPosition(use_value) {
    if (typeof(use_value) !== 'undefined')
        CONTROL_PANEL.setAutoCheckPosition(use_value);

    if (CONTROL_PANEL.isAutoCheckPosition()) {
        var interval = CONTROL_PANEL.getAutoCheckInterval();
        if (!isNaN(interval) && interval > 0 && interval < 100) {
            if (interval_position !== -1)
                clearInterval(interval_position);
            interval_position = setInterval(function() {
                getPosition()
            }, interval * 1000);
        }
        else {
            CONTROL_PANEL.setAutoCheckPosition(false);
            CONTROL_PANEL.setAutoCheckInterval(0);
            if (interval_position !== -1)
                clearInterval(interval_position);
            interval_position = -1;
        }
    }
    else {
        if (interval_position !== -1)
            clearInterval(interval_position);
        interval_position = -1;
    }
}

function onPosIntervalChange() {
    var interval = CONTROL_PANEL.getAutoCheckInterval();
    if (!isNaN(interval) && interval > 0 && interval < 100) {
        onAutoCheckPosition();
    }
    else {
        CONTROL_PANEL.setAutoCheckPosition(false);
        CONTROL_PANEL.setAutoCheckInterval(0);

        if (interval !== 0)
            alertdlg(translateTextItem("Out of range"),
                translateTextItem("Value of auto-check must be between 0s and 99s !!"));

        onAutoCheckPosition();
    }
}

function getPosition() {
    var command = "M114";
    if ((target_firmware === "grbl") || (target_firmware === "grbl-embedded")) {
        command = "?";
        sendPrinterCommand(command, false, null, null, 114, 1);
    }
    else if (target_firmware === "marlin-embedded") {
        sendPrinterCommand(command, false, null, null, 114, 1);
    }
    else sendPrinterCommand(command, false, processPosition, null, 114, 1);
}

function controlGetPositionValue(label, result_data) {
    var result = "";
    var pos1 = result_data.indexOf(label, 0);
    if (pos1 > -1) {
        pos1 += label.length;
        var pos2 = result_data.indexOf(" ", pos1);
        if (pos2 > -1) {
            result = result_data.substring(pos1, pos2);
        }
        else result = result_data.substring(pos1);
    }
    return result.trim();
}

function processPosition(response) {
    if ((target_firmware === "grbl") || (target_firmware === "grbl-embedded")) {
        processGrblPosition(response);
    }
    else {
        CONTROL_PANEL.setAxisPositions(
            controlGetPositionValue("X:", response),
            controlGetPositionValue("Y:", response),
            controlGetPositionValue("Z:", response))
    }
}

function controlMotorsOff() {
    var command = "M84";
    sendPrinterCommand(command, true);
}

/* NOT IN USED
function sendHomeCommand(cmd) {
    if (document.getElementById('lock_UI').checked) return;
    if ((target_firmware === "grbl-embedded") || (target_firmware === "grbl")) {
        switch (cmd) {
            case 'G28':
                cmd = '$H';
                break;
            case 'G28 X0':
                cmd = '$HX';
                break;
            case 'G28 Y0':
                cmd = '$HY';
                break;

            case 'G28 Z0':
                if (grblaxis > 3) {
                    cmd = '$H' + document.getElementById('control_select_axis').value;
                } else cmd = '$HZ';
                break;
            default:
                cmd = '$H';
                break;
        }

    }
    sendPrinterCommand(cmd, true, getPosition);
}*/

function sendZeroCommand(cmd) {
    var command = "G10 L20 P0 " + cmd;
    sendPrinterCommand(command, true, getPosition);
}

function sendJogCommand(cmd, feedrate) {
    if (NAV_BAR.lockUi_isChecked())
        return;

    var feedratevalue = "";
    var command = "";
    if (feedrate == "XYfeedrate") {
        feedratevalue = CONTROL_PANEL.getXYVelocity();
        if (feedratevalue < 1 || isNaN(feedratevalue) || (feedratevalue === null)) {
            alertdlg(translateTextItem("Out of range"), translateTextItem("XY Feedrate value must be at least 1 mm/min!"));
            CONTROL_PANEL.setXYVelocity(preferenceslist[0].xy_feedrate);
            return;
        }
    }
    else {
        feedratevalue = CONTROL_PANEL.getZVelocity();
        if (feedratevalue < 1 || isNaN(feedratevalue) || (feedratevalue === null)) {
            var letter = "Z";
            if ((target_firmware === "grbl-embedded") && (grblaxis > 3)) letter = "Axis";
            alertdlg(translateTextItem("Out of range"), translateTextItem( letter +" Feedrate value must be at least 1 mm/min!"));
            CONTROL_PANEL.setZVelocity(preferenceslist[0].z_feedrate);
            return;
        }
    }
    if ((target_firmware === "grbl-embedded")
        || (target_firmware === "grbl")) {
        if(grblaxis > 3){
            letter = CONTROL_PANEL.getSelectAxisValue();
            cmd = cmd.replace("Z", letter);
        }
        command = "$J=G91 G21 F" + feedratevalue + " " + cmd;
        console.log(command);
    }
    else command = "G91\nG1 " + cmd + " F" + feedratevalue + "\nG90";
    sendPrinterCommand(command, true, getPosition);
}

function onXYVelocityChange() {
    var feedratevalue = CONTROL_PANEL.getXYVelocity();
    if (feedratevalue < 1 || feedratevalue > 9999
        || isNaN(feedratevalue) || (feedratevalue === null)) {
        //we could display error but we do not
    }
}

function onZVelocityChange() {
    var feedratevalue = CONTROL_PANEL.getZVelocity();
    if (feedratevalue < 1 || feedratevalue > 999
        || isNaN(feedratevalue) || (feedratevalue === null)) {
        //we could display error but we do not
    }
}

function processMacroSave(answer) {
    if (answer === "ok") {
        //console.log("now rebuild list");
        controlBuildMacroUi();
    }
}

function controlBuildMacroButton(index) {
    var content = "";
    var entry = control_macrolist[index];
    content += "<button class='btn fixedbutton " + control_macrolist[index].class + "' type='text' ";
    if (entry.glyph.length === 0) {
        content += "style='display:none'";
    }
    content += "onclick='macro_command (\"" + entry.target + "\",\"" + entry.filename + "\")'";
    content += "><span style='position:relative; top:3px;'>";
    if (entry.glyph.length === 0) {
        content += getIconSvg("star");
    }
    else content += getIconSvg(entry.glyph);
    content += "</span>";
    if (entry.name.length > 0) {
        content += "&nbsp;";
    }
    content += entry.name;
    content += "</button>";

    return content;
}

function controlBuildMacroUi() {
    var content = "<button class='btn btn-primary' onclick='MACRO_DIALOG.showMacroDlg(processMacroSave)'>";
    content += "<span class='badge'>";
    content += "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>";
    content += "<g transform='translate(50,1200) scale(1, -1)'>";
    content += "<path  fill='currentColor' d='M407 800l131 353q7 19 17.5 19t17.5 -19l129 -353h421q21 0 24 -8.5t-14 -20.5l-342 -249l130 -401q7 -20 -0.5 -25.5t-24.5 6.5l-343 246l-342 -247q-17 -12 -24.5 -6.5t-0.5 25.5l130 400l-347 251q-17 12 -14 20.5t23 8.5h429z'></path>";
    content += "</g>";
    content += "</svg>";
    content += "<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>";
    content += "<g transform='translate(50,1200) scale(1, -1)'>";
    content += "<path  fill='currentColor' d='M1011 1210q19 0 33 -13l153 -153q13 -14 13 -33t-13 -33l-99 -92l-214 214l95 96q13 14 32 14zM1013 800l-615 -614l-214 214l614 614zM317 96l-333 -112l110 335z'></path>";
    content += "</g>";
    content += "</svg>";
    content += "</span>";
    content += "</button>";
    for (var i = 0; i < 9; i++) {
        content += controlBuildMacroButton(i);
    }

    CONTROL_PANEL.setMacroList(content);
}

/* NOT IN USED
function macroCommand(target, filename) {
    var cmd = ""
    if (target == "ESP") {
        cmd = "[ESP700]" + filename;
    }
    else if (target == "SD") {
        files_print_filename(filename);
    }
    else if (target == "URI") {
        window.open(filename);
    }
    else return;

    //console.log(cmd);
    sendPrinterCommand(cmd);
}*/
