/*jshint esversion: 6 */

var ESP3D_authentication = false;
var page_id = "";
var convertDHT2Fahrenheit = false;
var ws_source;
var event_source;
var log_off = false;
var async_webcommunication = false;
var websocket_port = 0;
var websocket_ip = "";
var esp_hostname = "ESP3D WebUI";
var EP_HOSTNAME;
var EP_STA_SSID;
var EP_STA_PASSWORD;
var EP_STA_IP_MODE;
var EP_STA_IP_VALUE;
var EP_STA_GW_VALUE;
var EP_STA_MK_VALUE;
var EP_WIFI_MODE;
var EP_AP_SSID;
var EP_AP_PASSWORD;
var EP_AP_IP_VALUE;
var EP_BAUD_RATE = 112;
var EP_AUTH_TYPE = 119;
var EP_TARGET_FW = 461;
var EP_IS_DIRECT_SD = 850;
var EP_PRIMARY_SD = 851;
var EP_SECONDARY_SD = 852;
var EP_DIRECT_SD_CHECK = 853;
var SETTINGS_AP_MODE = 1;
var SETTINGS_STA_MODE = 2;
var interval_ping = -1;
var last_ping = 0;
var enable_ping = true;
var esp_error_message = "";
var esp_error_code = 0;

function initEvents(e) {
  page_id = e.data;
  console.log("connection id = " + page_id);
}

function activeIdEvents(e) {
  if (page_id !== e.data) {
    disableInterface();
    console.log("I am disabled");
    event_source.close();
  }
}

function dhtEvents(e) {
  handleDHT(e.data);
}

/**
 * Check for IE, Edge, Chrome
 */
function getBrowserType(bname) {
  var ua = navigator.userAgent;
  switch (bname) {
    case "IE":
      if (ua.indexOf("Trident/") !== -1) return true;
      break;
    case "Edge":
      if (ua.indexOf("Edge") !== -1) return true;
      break;
    case "Chrome":
      if (ua.indexOf("Chrome") !== -1) return true;
      break;
    case "Firefox":
      if (ua.indexOf("Firefox") !== -1) return true;
      break;
    case "MacOSX":
      if (ua.indexOf("Mac OS X") !== -1) return true;
      break;
    default:
      return false;
  }
  return false;
}

var wsmsg = "";
function startSocket() {
  try {
    if (async_webcommunication) {
      ws_source = new WebSocket("ws://" + document.location.host + "/ws", [
        "arduino",
      ]);
    }
    else {
      console.log("Socket is " + websocket_ip + ":" + websocket_port);
      ws_source = new WebSocket("ws://" + websocket_ip + ":" + websocket_port, [
        "arduino",
      ]);
    }
  }
  catch (exception) {
    console.error(exception);
  }

  ws_source.binaryType = "arraybuffer";
  ws_source.onopen = function (e) {
    console.log("Connected", e);
  };
  ws_source.onclose = function (e) {
    console.log("Disconnected", e);
    //seems sometimes it disconnect so wait 3s and reconnect
    //if it is not a log-off
    if (!log_off) setTimeout(startSocket, 3000);
  };

  ws_source.onerror = function (e) {
    //Monitor_output_Update("[#]Error "+ e.code +" " + e.reason + "\n");
    console.log("ws error", e);
  };

  ws_source.onmessage = function (e) {
    var msg = "";
    //bin
    if (e.data instanceof ArrayBuffer) {
      var bytes = new Uint8Array(e.data);
      for (var i = 0; i < bytes.length; i++) {
        msg += String.fromCharCode(bytes[i]);
        if (bytes[i] === 10 || bytes[i] === 13) {
          wsmsg += msg;
          monitor_outputUpdate(wsmsg);
          processSocketResponse(wsmsg);
          //msg = wsmsg.replace("\n", "");
          //wsmsg = msg.replace("\r", "");
          if (
            !(
              wsmsg.startsWith("ok T:") ||
              wsmsg.startsWith("X:") ||
              wsmsg.startsWith("FR:") ||
              wsmsg.startsWith("echo:E0 Flow")
            )
          )
            console.log(wsmsg);
          wsmsg = "";
          msg = "";
        }
      }
      wsmsg += msg;
    }
    else {
      msg += e.data;
      var tval = msg.split(":");
      if (tval.length >= 2) {
        if (tval[0] === "CURRENT_ID") {
          page_id = tval[1];
          console.log("connection id = " + page_id);
        }
        if (enable_ping) {
          if (tval[0] === "PING") {
            page_id = tval[1];
            console.log("ping from id = " + page_id);
            last_ping = Date.now();
            if (interval_ping === -1)
              interval_ping = setInterval(function () {
                check_ping();
              }, 10 * 1000);
          }
        }
        if (tval[0] === "ACTIVE_ID") {
          if (page_id !== tval[1]) {
            disableInterface();
          }
        }
        if (tval[0] === "DHT") {
          handleDHT(tval[1]);
        }
        if (tval[0] === "ERROR") {
          esp_error_message = tval[2];
          esp_error_code = tval[1];
          console.log("ERROR: " + tval[2] + " code:" + tval[1]);
          cancelCurrentUpload();
        }
        if (tval[0] === "MSG") {
          var error_message = tval[2];
          var error_code = tval[1];
          console.log("MSG: " + error_message + " code:" + error_code);
        }
      }
    }
    //console.log(msg);
  };
}

function check_ping() {
  //if ((Date.now() - last_ping) > 20000){
  //Disable_interface(true);
  //console.log("No heart beat for more than 20s");
  //}
}

/*
deprecated
function disable_items(item, state) {
  var liste = item.getElementsByTagName("*");
  for (let i = 0; i < liste.length; i++)
    liste[i].disabled = state;
}*/

function disable_items(state, ...items) {
  for(const item of items){
    let liste = item.getElementsByTagName("*");
    for (let i = 0; i < liste.length; i++)
      liste[i].disabled = state;
  }
}

/**
 * For short setVisibility function
 * @param ellId htmlElement ID for document.getElementById
 * @param isVisible visibility
 * @param visibilityStyle style.display.value if visible, default = 'block'
 */
function setVisibility(ellId, isVisible, visibilityStyle = 'block') {
  document.getElementById(ellId).style.display = isVisible ? visibilityStyle : 'none';
}

function onTogglePing(forcevalue) {
  if (typeof forcevalue != "undefined")
    enable_ping = forcevalue;
  else
    enable_ping = !enable_ping;
  if (enable_ping) {
    if (interval_ping !== -1)
      clearInterval(interval_ping);
    last_ping = Date.now();
    interval_ping = setInterval(function () {
      check_ping();
    }, 10 * 1000);
    console.log("enable ping");
  }
  else {
    if (interval_ping !== -1) clearInterval(interval_ping);
    console.log("disable ping");
  }
}

function handleDHT(data) {
  var tdata = data.split(" ");
  if (tdata.length !== 2) {
    console.log("DHT data invalid: " + data);
    return;
  }
  var temp = convertDHT2Fahrenheit ? parseFloat(tdata[0]) * 1.8 + 32 : parseFloat(tdata[0]);
  NAV_BAR.setDhtHumidity(parseFloat(tdata[1]).toFixed(2).toString() + "%");
  var temps = temp.toFixed(2).toString() + "&deg;";
  temps += convertDHT2Fahrenheit ? "F" : "C";
  NAV_BAR.setDhtTemperature(temps);
}

var total_boot_steps = 5;
var current_boot_steps = 0;

function displayBootProgress(step) {
  var val = 1;
  if (typeof step != "undefined") val = step;
  current_boot_steps += val;
  CONNECT_DIALOG.setLoadProgress(Math.round(
    (current_boot_steps * 100) / total_boot_steps
  ));
}

function disableInterface(lostconnection) {
  var lostcon = false;
  if (typeof lostconnection != "undefined") lostcon = lostconnection;
  //block all communication
  http_communication_locked = true;
  log_off = true;
  if (interval_ping !== -1) clearInterval(interval_ping);
  //clear all waiting commands
  clearCmdList();
  //no camera
  CAMERA.getFrame().src = "";
  //No auto check
  onAutoCheckPosition(false);
  on_autocheck_temperature(false);
  onAutocheckStatus(false);
  if (async_webcommunication) {
    event_source.removeEventListener("ActiveID", activeIdEvents, false);
    event_source.removeEventListener("InitID", initEvents, false);
    event_source.removeEventListener("DHT", dhtEvents, false);
  }
  ws_source.close();
  document.title += "(" + decodeEntities(translateTextItem("Disabled")) + ")";
  UIdisableddlg(lostcon);
}

function updateUiFirmwareTarget() {
  var fwName;
  initpreferences();

  CONTROL_PANEL.setPositionLabel("x", "X");
  CONTROL_PANEL.setPositionLabel("y", "Y");
  CONTROL_PANEL.setPositionLabel("z", "Z");

  NAV_BAR.configTab_setSmoothieNavVisibility(false);

  CONTROL_PANEL.setAxisControlsVisibility(true);//showAxiscontrols();

  fwName = getFwNameAndBuildUi();

  EP_HOSTNAME = {
    "grbl-embedded":"System/Hostname",
    "marlin-embedded":"ESP_HOSTNAME"
  }[target_firmware] || 130;

  EP_STA_SSID = {
    "grbl-embedded":"Sta/SSID",
    "marlin-embedded":"STA_SSID"
  }[target_firmware] || 1;

  EP_STA_PASSWORD = {
    "grbl-embedded":"Sta/Password",
    "marlin-embedded":"STA_PWD"
  }[target_firmware] || 34;

  EP_STA_IP_MODE = {
    "grbl-embedded":"Sta/IPMode",
    "marlin-embedded":"STA_IP_MODE"
  }[target_firmware] || 99;

  EP_STA_IP_VALUE = {
    "grbl-embedded":"Sta/IP",
    "marlin-embedded":"STA_IP"
  }[target_firmware] || 100;

  EP_STA_GW_VALUE =  {
    "grbl-embedded":"Sta/Gateway",
    "marlin-embedded":"STA_GW"
  }[target_firmware] || 104;

  EP_STA_MK_VALUE = {
    "grbl-embedded":"Sta/Netmask",
    "marlin-embedded":"STA_MK"
  }[target_firmware] || 108;

  EP_WIFI_MODE = {
    "grbl-embedded":"Radio/Mode",
    "marlin-embedded":"WIFI_MODE"
  }[target_firmware] || 0;

  EP_AP_SSID = {
    "grbl-embedded":"AP/SSID",
    "marlin-embedded":"AP_SSID"
  }[target_firmware] || 218;

  EP_AP_PASSWORD = {
    "grbl-embedded":"AP/Password",
    "marlin-embedded":"AP_PWD"
  }[target_firmware] || 251;

  EP_AP_IP_VALUE = {
    "grbl-embedded":"AP/IP",
    "marlin-embedded":"AP_IP"
  }[target_firmware] || 316;

  SETTINGS_AP_MODE =  {
    "grbl-embedded": 2,
    "marlin-embedded":2
  }[target_firmware] || 1;

  SETTINGS_STA_MODE = {
    "grbl-embedded":1,
    "marlin-embedded": 1
  }[target_firmware] || 2;

  /*
  OLD
  if (target_firmware === "grbl-embedded") {
    EP_HOSTNAME = "System/Hostname";
    EP_STA_SSID = "Sta/SSID";
    EP_STA_PASSWORD = "Sta/Password";
    EP_STA_IP_MODE = "Sta/IPMode";
    EP_STA_IP_VALUE = "Sta/IP";
    EP_STA_GW_VALUE = "Sta/Gateway";
    EP_STA_MK_VALUE = "Sta/Netmask";
    EP_WIFI_MODE = "Radio/Mode";
    EP_AP_SSID = "AP/SSID";
    EP_AP_PASSWORD = "AP/Password";
    EP_AP_IP_VALUE = "AP/IP";
    SETTINGS_AP_MODE = 2;
    SETTINGS_STA_MODE = 1;
  }
  else if (target_firmware === "marlin-embedded") {
    EP_HOSTNAME = "ESP_HOSTNAME";
    EP_STA_SSID = "STA_SSID";
    EP_STA_PASSWORD = "STA_PWD";
    EP_STA_IP_MODE = "STA_IP_MODE";
    EP_STA_IP_VALUE = "STA_IP";
    EP_STA_GW_VALUE = "STA_GW";
    EP_STA_MK_VALUE = "STA_MK";
    EP_WIFI_MODE = "WIFI_MODE";
    EP_AP_SSID = "AP_SSID";
    EP_AP_PASSWORD = "AP_PWD";
    EP_AP_IP_VALUE = "AP_IP";
    SETTINGS_AP_MODE = 2;
    SETTINGS_STA_MODE = 1;
  }
  else {
    EP_HOSTNAME = 130;
    EP_STA_SSID = 1;
    EP_STA_PASSWORD = 34;
    EP_STA_IP_MODE = 99;
    EP_STA_IP_VALUE = 100;
    EP_STA_MK_VALUE = 104;
    EP_STA_GW_VALUE = 108;
    EP_WIFI_MODE = 0;
    EP_AP_SSID = 218;
    EP_AP_PASSWORD = 251;
    EP_AP_IP_VALUE = 316;
    SETTINGS_AP_MODE = 1;
    SETTINGS_STA_MODE = 2;
  }*/

  NAV_BAR.setFwName(fwName);
  //SD image or not
  NAV_BAR.setShowSdUsed(direct_sd);

  return fwName;
}

function getFwNameAndBuildUi() {
  let fwName;
  switch (target_firmware){

    case "repetier":
      fwName = "Repetier";
      NAV_BAR.setConfigTabLinkVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      GRBL_PANEL.setVisibility(false);
      CONTROL_PANEL.setXYZControlVisibility(false);
      break;

    case "repetier4davinci":
      fwName = "Repetier for Davinci";
      NAV_BAR.setConfigTabLinkVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      GRBL_PANEL.setVisibility(false);
      CONTROL_PANEL.setVisibility(false);
      break;

    case "smoothieware":
      fwName = "Smoothieware";
      NAV_BAR.setConfigTabLinkVisibility(true);
      NAV_BAR.configTab_setSmoothieNavVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      GRBL_PANEL.setVisibility(false);
      CONTROL_PANEL.setXYZControlVisibility(false);
      break;

    case "grbl-embedded":
      fwName = "GRBL ESP32";
      //last_grbl_pos = "";

      NAV_BAR.setConfigTabLinkVisibility(true);
      NAV_BAR.configTab_setSmoothieNavVisibility(false);
      FILES.setProgressBtnVisibility(false);
      FILES.setAbortBtnVisibility(false);
      CONTROL_PANEL.setMottorOffControlVisibility(false);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);

      NAV_BAR.configTab_setTitles("GRBL configuration", "GRBL");

      FILES.setAcceptInputFiles(" .g, .gco, .gcode, .txt, .ncc, .G, .GCO, .GCODE, .TXT, .NC");
      GRBL_PANEL.controlSet(grblaxis);
      //CONTROL_PANEL.setGRBLControlVisibility(grblaxis);
      //CONTROL_PANEL.setGRBLControlVisibility(true);
      GRBL_PANEL.setVisibility(true);

      NAV_BAR.setFwGithubLink("https://github.com/bdring/Grbl_Esp32");
      NAV_BAR.settingsTab_setFiltersVisibility(false);

      NAV_BAR.settingsTab_setXwPositionLabels();
      break;

    case "marlin-embedded":
      fwName = "Marlin ESP32";

      NAV_BAR.setConfigTabLinkVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      NAV_BAR.setFwGithubLink("https://github.com/MarlinFirmware/Marlin");
      GRBL_PANEL.setVisibility(false);
      NAV_BAR.settingsTab_setFiltersVisibility(false);
      CONTROL_PANEL.setXYZControlVisibility(false);
      break;

    case "marlin":
      fwName = "Marlin";

      NAV_BAR.setConfigTabLinkVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      GRBL_PANEL.setVisibility(false);
      CONTROL_PANEL.setXYZControlVisibility(false);
      break;

    case "marlinkimbra":
      fwName = "Marlin Kimbra";

      NAV_BAR.setConfigTabLinkVisibility(true);
      CONTROL_PANEL.setAutoCheckControlVisibility(true);
      CONTROL_PANEL.setMottorOffControlVisibility(true);
      FILES.setProgressBtnVisibility(true);
      FILES.setAbortBtnVisibility(true);
      GRBL_PANEL.setVisibility(false);
      CONTROL_PANEL.setXYZControlVisibility(false);
      break;

    case "grbl":
      fwName = "Grbl";

      NAV_BAR.setConfigTabLinkVisibility(true);
      NAV_BAR.configTab_setTitles("GRBL configuration", "GRBL");
      FILES.setAcceptInputFiles(" .g, .gco, .gcode, .txt, .ncc, .G, .GCO, .GCODE, .TXT, .NC");
      CONTROL_PANEL.setAutoCheckControlVisibility(false);
      CONTROL_PANEL.setMottorOffControlVisibility(false);
      FILES.setProgressBtnVisibility(false);
      FILES.setAbortBtnVisibility(false);
      GRBL_PANEL.setVisibility(true);
      NAV_BAR.settingsTab_setXwPositionLabels();

      CONTROL_PANEL.setXYZControlVisibility(true, 2);
      break;

    default:
      fwName = "Unknown";
      NAV_BAR.setConfigTabLinkVisibility(false);
      break;
  }
  return fwName;
}

function setPageTitle(page_title) {
  if (typeof page_title != "undefined")
    esp_hostname = page_title;

  document.title = esp_hostname;
}

function initUI_step1() {
  console.log("Init UI start");

  if (ESP3D_authentication)
    connectDlg(false);

  addCmd(displayBootProgress);

  //initial check
  if (
    typeof target_firmware == "undefined" ||
    typeof web_ui_version == "undefined" ||
    typeof direct_sd == "undefined"
  )
    alert("Missing init data!");

  //check FW
  updateUiFirmwareTarget();

  //set title using hostname
  setPageTitle();

  //Update UI and FW versions in page
  NAV_BAR.setVersions(web_ui_version, fw_version);

  // Get the element with id="defaultOpen" and click on it
  NAV_BAR.mainTab_open();

  if (target_firmware === "grbl-embedded" || target_firmware === "grbl") {
    GRBL_PANEL.openControlTab();
  }

  //removeIf(production)
  console.log(JSON.stringify(translated_list));
  //endRemoveIf(production)

  initUI_step2();
}

function initUI_step2() {
  addCmd(displayBootProgress);
  //get all settings from ESP3D
  console.log("Get settings");
  //query settings but do not update list in case wizard is showed
  refreshSettings(true);
  initUI_step3();
}

function initUI_step3() {
  addCmd(displayBootProgress);
  //init panels
  console.log("Get macros");
  COMMAND_PANEL.init();
  initGrblPanel();
  console.log("Get preferences");
  getpreferenceslist();
  initUI_step4();
}

function initUI_step4() {
  addCmd(displayBootProgress);
  init_temperature_panel();
  init_extruder_panel();
  initCommandPanel();
  init_files_panel(false);

  //check if we need setup
  if (target_firmware === "???") {
    console.log("Launch Setup");
    addCmd(displayBootProgress);
    closeModal("Connection successful");
    setupdlg();
  }
  else {
    //wizard is done UI can be updated
    setup_is_done = true;
    do_not_build_settings = false;
    addCmd(displayBootProgress);
    buildHtmlSettingList(current_setting_filter);
    addCmd(closeModal);
    addCmd(showMainUi);
  }
}

function compareStrings(a, b) {
  // case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}

/* NOT IN USE
function compareInts(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
*/

function htmlEncode(str) {
  var i = str.length,
    aRet = [];

  while (i--) {
    var iC = str[i].charCodeAt(0);
    if (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) {
      if (iC === 65533) iC = 176;
      aRet[i] = "&#" + iC + ";";
    }
    else {
      aRet[i] = str[i];
    }
  }
  return aRet.join("");
}

function decodeEntities(str_text) {
  var tmpelement = document.createElement("div");
  tmpelement.innerHTML = str_text;
  str_text = tmpelement.textContent;
  tmpelement.textContent = "";
  return str_text;
}

var socket_response = "";
var socket_is_settings = false;
function processSocketResponse(msg) {
  if (target_firmware === "grbl-embedded" || target_firmware === "grbl") {
    if (msg.startsWith("<")) {
      grblProcessStatus(msg);
    }
    else if (msg.startsWith("[PRB:")) {
      grblGetProbeResult(msg);
    }
    else if (msg.startsWith("[GC:")) {
      console.log(msg);
    }
    else if (
      msg.startsWith("error:") ||
      msg.startsWith("ALARM:") ||
      msg.startsWith("Hold:") ||
      msg.startsWith("Door:")
    ) {
      grblProcessMsg(msg);
    }
    else if (msg.startsWith("Grbl 1.1f [")) {
      grblResetDetected(msg);
    }
    else if (socket_is_settings) socket_response += msg;

    if (!socket_is_settings && msg.startsWith("$0=")) {
      socket_is_settings = true;
      socket_response = msg;
    }

    if (msg.startsWith("ok")) {
      if (socket_is_settings) {
        //update settings
        getESPconfigSuccess(socket_response);
        socket_is_settings = false;
      }
    }
  }
  else {
    if (target_firmware === "marlin-embedded") {
      if (
        socket_is_settings &&
        !(
          msg.startsWith("echo:Unknown command:") ||
          msg.startsWith("echo:enqueueing")
        )
      )
        socket_response += msg + "\n";
      if (
        !socket_is_settings &&
        (msg.startsWith("  G21") ||
          msg.startsWith("  G20") ||
          msg.startsWith("echo:  G21") ||
          msg.startsWith("echo:  G20") ||
          msg.startsWith("echo:; Linear Units:"))
      ) {
        socket_is_settings = true;
        socket_response = msg + "\n";
        //to stop waiting for data
        console.log("Got settings Start");
      }
    }
    if (
      msg.startsWith("ok T:") ||
      msg.startsWith(" T:") ||
      msg.startsWith("T:")
    ) {
      if (!graph_started) start_graph_output();
      process_Temperatures(msg);
    }
    if (msg.startsWith("X:")) {
      processPosition(msg);
    }
    if (msg.startsWith("FR:")) {
      process_feedRate(msg);
    }

    if (msg.startsWith("echo:E") && msg.indexOf("Flow:") !== -1) {
      process_flowdRate(msg);
    }

    if (msg.startsWith("[esp3d]")) {
      process_Custom(msg); // handles custom messages sent via M118
    }
    if (msg.startsWith("ok")) {
      if (socket_is_settings) {
        //update settings
        console.log("Got settings End");
        console.log(socket_response);
        getESPconfigSuccess(socket_response);
        socket_is_settings = false;
      }
    }
  }
}

/**
 * Try to make some sound
 * @param duration
 * @param frequency
 */
function beep(duration, frequency) {
  var audioCtx;
  if (typeof window.AudioContext != "undefined") {
    audioCtx = new window.AudioContext();
  }
  else if (typeof window.webkitAudioContext() != "undefined") {
    audioCtx = new window.webkitAudioContext();
  }
  else if (typeof window.audioContext != "undefined") {
    audioCtx = new window.audioContext();
  }

  // = new (window.AudioContext() || window.webkitAudioContext() || window.audioContext());
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 1;
  oscillator.frequency.value = frequency;
  oscillator.start();
  setTimeout(function () {
    oscillator.stop();
  }, duration);
}
