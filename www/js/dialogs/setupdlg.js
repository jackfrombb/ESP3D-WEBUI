//setup dialog

var active_wizard_page = 0;
var maz_page_wizard = 5;

function setupdlg() {
    setup_is_done = false;
    language_save = language;
    document.getElementById('main_ui').style.display = 'none';
    document.getElementById('settings_list_data').innerHTML = "";
    active_wizard_page = 0;
    //reset page 1
    document.getElementById("startsteplink").className = document.getElementById("startsteplink").className.replace(" wizard_done", "");
    document.getElementById("wizard_button").innerHTML = translateTextItem("Start setup");
    document.getElementById("wizard_line1").style.background = "#e0e0e0";
    document.getElementById("step1link").disabled = true;
    document.getElementById("step1link").className = "steplinks disabled";
    //reset page 2
    document.getElementById("step1link").className = document.getElementById("step1link").className.replace(" wizard_done", "");
    document.getElementById("wizard_line2").style.background = "#e0e0e0";
    document.getElementById("step2link").disabled = true;
    document.getElementById("step2link").className = "steplinks disabled";
    //reset page 3
    document.getElementById("step2link").className = document.getElementById("step2link").className.replace(" wizard_done", "");
    document.getElementById("wizard_line3").style.background = "#e0e0e0";
    document.getElementById("step3link").disabled = true;
    document.getElementById("step3link").className = "steplinks disabled";
    if (!direct_sd || (target_firmware == "grbl-embedded") || (target_firmware == "marlin-embedded")) {
        document.getElementById("step3link").style.display = 'none';
        document.getElementById("wizard_line4").style.display = 'none';
    } else {
        document.getElementById("step3link").style.display = 'block';
        document.getElementById("wizard_line4").style.display = 'block';
    }
    //reset page 4
    document.getElementById("step3link").className = document.getElementById("step3link").className.replace(" wizard_done", "");
    document.getElementById("wizard_line4").style.background = "#e0e0e0";
    document.getElementById("endsteplink").disabled = true;
    document.getElementById("endsteplink").className = "steplinks disabled";
    var content = "<table><tr><td>";
    content += getIconSvg("flag") + "&nbsp;</td><td>";
    content += buildLanguageList("language_selection");
    content += "</td></tr></table>";
    document.getElementById("setup_langage_list").innerHTML = content;

    var modal = setactiveModal('setupdlg.html', setupdone);
    if (modal == null) return;
    showModal();
    document.getElementById("startsteplink", true).click();
}

function setupdone(response) {
    setup_is_done = true;
    do_not_build_settings = false;
    buildHtmlSettingList(current_setting_filter);
    translateText(language_save);
    document.getElementById('main_ui').style.display = 'block';
    closeModal("setup done");

}

function continue_setup_wizard() {
    active_wizard_page++;
    switch (active_wizard_page) {
        case 1:
            enablestep1();
            preferenceslist[0].language = language;
            SavePreferences(true);
            language_save = language;
            break;
        case 2:
            enablestep2();
            break;
        case 3:
            if (!direct_sd || (target_firmware == "grbl-embedded") || (target_firmware == "marlin-embedded")) {
                active_wizard_page++;
                document.getElementById("wizard_line3").style.background = "#337AB7";
                enablestep4();
            } else enablestep3();
            break;
        case 4:
            enablestep4();
            break;
        case 5:
            closeModal('ok')
            break;
        default:
            console.log("wizard page out of range");
    }
}

function enablestep1() {
    var content = "";
    var index = 0;
    if (document.getElementById("startsteplink").className.indexOf(" wizard_done") == -1) {
        document.getElementById("startsteplink").className += " wizard_done";
        if (!can_revert_wizard) document.getElementById("startsteplink").className += " no_revert_wizard";
    }
    document.getElementById("wizard_button").innerHTML = translateTextItem("Continue");
    document.getElementById("wizard_line1").style.background = "#337AB7";
    document.getElementById("step1link").disabled = "";
    document.getElementById("step1link").className = document.getElementById("step1link").className.replace(" disabled", "");
    content += "<h4>" + translateTextItem("ESP3D Settings") + "</h4><hr>";
    if (!((target_firmware == "grbl-embedded") || (target_firmware == "marlin-embedded"))) {
        index = getIndexFromEepromPos(EP_TARGET_FW);
        content += translateTextItem("Save your printer's firmware base:");
        content += buildControlFromIndex(index);
        content += translateTextItem("This is mandatory to get ESP working properly.");
        content += "<hr>\n";
        index = getIndexFromEepromPos(EP_BAUD_RATE);
        content += translateTextItem("Save your printer's board current baud rate:");
        content += buildControlFromIndex(index);
        content += translateTextItem("Printer and ESP board must use same baud rate to communicate properly.") + "<br>";
        content += "<hr>\n";
    }
    index = getIndexFromEepromPos(EP_HOSTNAME);
    content += translateTextItem("Define ESP name:") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";

    document.getElementById("step1").innerHTML = content
    document.getElementById("step1link").click();
}

function enablestep2() {
    var content = "";
    if (document.getElementById("step1link").className.indexOf("wizard_done") == -1) {
        document.getElementById("step1link").className += " wizard_done";
        if (!can_revert_wizard) document.getElementById("step1link").className += " no_revert_wizard";
    }
    document.getElementById("wizard_line2").style.background = "#337AB7";
    document.getElementById("step2link").disabled = "";
    document.getElementById("step2link").className = document.getElementById("step2link").className.replace(" disabled", "");
    index = getIndexFromEepromPos(EP_WIFI_MODE);
    content += "<h4>" + translateTextItem("WiFi Configuration") + "</h4><hr>";
    content += translateTextItem("Define ESP role:") + "<table><tr><td>";
    content += buildControlFromIndex(index, "define_esp_role");
    content += "</td></tr></table>" + translateTextItem("AP define access point / STA allows to join existing network") + "<br>";
    content += "<hr>\n";
    index = getIndexFromEepromPos(EP_STA_SSID);
    content += "<div id='setup_STA'>";
    content += translateTextItem("What access point ESP need to be connected to:") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>" + translateTextItem("You can use scan button, to list available access points.") + "<br>";
    content += "<hr>\n";
    index = getIndexFromEepromPos(EP_STA_PASSWORD);
    content += translateTextItem("Password to join access point:") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    content += "</div>";
    content += "<div id='setup_AP'>";
    content += translateTextItem("What is ESP access point SSID:") + "<table><tr><td>";
    index = getIndexFromEepromPos(EP_AP_SSID);
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    content += "<hr>\n";
    index = getIndexFromEepromPos(EP_AP_PASSWORD);
    content += translateTextItem("Password for access point:") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    if (!((target_firmware == "grbl-embedded") || (target_firmware == "marlin-embedded"))) {
        content += "<hr>\n";
        content += translateTextItem("Define security:") + "<table><tr><td>";
        index = getIndexFromEepromPos(EP_AUTH_TYPE);
        content += buildControlFromIndex(index);
        content += "</td></tr></table>";
    }
    content += "</div>";
    document.getElementById("step2").innerHTML = content;
    define_esp_role(getIndexFromEepromPos(EP_WIFI_MODE));
    document.getElementById("step2link").click();
}

function enablestep3() {
    var content = "";
    if (document.getElementById("step2link").className.indexOf("wizard_done") == -1) {
        document.getElementById("step2link").className += " wizard_done";
        if (!can_revert_wizard) document.getElementById("step2link").className += " no_revert_wizard";
    }
    document.getElementById("wizard_line3").style.background = "#337AB7";
    document.getElementById("step3link").disabled = "";
    document.getElementById("step3link").className = document.getElementById("step3link").className.replace(" disabled", "");
    index = getIndexFromEepromPos(EP_IS_DIRECT_SD);
    content += "<h4>" + translateTextItem("SD Card Configuration") + "</h4><hr>";
    content += translateTextItem("Is ESP connected to SD card:") + "<table><tr><td>";
    content += buildControlFromIndex(index, "define_sd_role");
    content += "</td></tr></table>";
    content += "<hr>\n";
    content += "<div id='setup_SD'>";
    index = getIndexFromEepromPos(EP_DIRECT_SD_CHECK);
    content += translateTextItem("Check update using direct SD access:") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    content += "<hr>\n";
    content += "<div id='setup_primary_SD'>";
    index = getIndexFromEepromPos(EP_PRIMARY_SD);
    content += translateTextItem("SD card connected to ESP") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    content += "<hr>\n";
    index = getIndexFromEepromPos(EP_SECONDARY_SD);
    content += translateTextItem("SD card connected to printer") + "<table><tr><td>";
    content += buildControlFromIndex(index);
    content += "</td></tr></table>";
    content += "<hr>\n";
    content += "</div>";
    content += "</div>";
    document.getElementById("step3").innerHTML = content;
    define_sd_role(getIndexFromEepromPos(EP_IS_DIRECT_SD));
    document.getElementById("step3link").click();
}

function enablestep4() {
    if (document.getElementById("step3link").className.indexOf("wizard_done") == -1) {
        document.getElementById("step3link").className += " wizard_done";
        if (!can_revert_wizard) document.getElementById("step3link").className += " no_revert_wizard";
    }
    document.getElementById("wizard_button").innerHTML = translateTextItem("Close");
    document.getElementById("wizard_line4").style.background = "#337AB7";
    document.getElementById("endsteplink").disabled = "";
    document.getElementById("endsteplink").className = document.getElementById("endsteplink").className.replace(" disabled", "");
    document.getElementById("endsteplink").click();
}

function define_esp_role(index) {
    if (!((setting_configList[index].defaultvalue == SETTINGS_AP_MODE) || (setting_configList[index].defaultvalue == SETTINGS_STA_MODE))) {
        document.getElementById("setup_STA").style.display = "none";
        document.getElementById("setup_AP").style.display = "none";
    }
    if (setting_configList[index].defaultvalue == SETTINGS_AP_MODE) {
        document.getElementById("setup_STA").style.display = "none";
        document.getElementById("setup_AP").style.display = "block";
    }
    if (setting_configList[index].defaultvalue == SETTINGS_STA_MODE) {
        document.getElementById("setup_STA").style.display = "block";
        document.getElementById("setup_AP").style.display = "none";
    }
}

function define_sd_role(index) {
    if (setting_configList[index].defaultvalue == 1) {
        document.getElementById("setup_SD").style.display = "block";
        if (target_firmware == "smoothieware") document.getElementById("setup_primary_SD").style.display = "block";
        else document.getElementById("setup_primary_SD").style.display = "none";
    } else {
        document.getElementById("setup_SD").style.display = "none";
        document.getElementById("setup_primary_SD").style.display = "none";
    }
}