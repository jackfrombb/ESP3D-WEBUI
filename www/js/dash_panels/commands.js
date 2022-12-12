var CustomCommand_history = [];
var CustomCommand_history_index = -1;
var Monitor_output = [];

function initCommandPanel() {

}

function monitor_outputAutoscrollCmd() {
    COMMAND_PANEL__MONITOR.getCmdContent().scrollTop = COMMAND_PANEL__MONITOR.getCmdContent().scrollHeight;
}

function monitor_checkAutoscroll() {
    if (COMMAND_PANEL__MONITOR.isAutoscrollEnabled())
        monitor_outputAutoscrollCmd();
}

function monitor_checkVerboseMode() {
    monitor_outputUpdate();
}

function monitor_outputClear() {
    Monitor_output = [];
    monitor_outputUpdate();
}

function monitor_outputUpdate(message) {
    if (message) {
        if (typeof message === 'string' || message instanceof String) {
            Monitor_output = Monitor_output.concat(message);
        }
        else {
            try {
                var msg = JSON.stringify(message, null, " ");
                Monitor_output = Monitor_output.concat(msg + "\n");
            } catch (err) {
                Monitor_output = Monitor_output.concat(message.toString() + "\n");
            }
        }
        Monitor_output = Monitor_output.slice(-300);
    }
    var regex = /ok T:/g;

    if (target_firmware === "repetier" || target_firmware === "repetier4davinci") {
        regex = /T:/g;
    }
    var output = "";
    var Monitor_outputLength = Monitor_output.length;
    var isverbosefilter = COMMAND_PANEL__MONITOR.isVerboseModeEnabled();
    for (var i = 0; i < Monitor_outputLength; i++) {
        //Filter the output  
        if ((Monitor_output[i].trim().toLowerCase().startsWith("ok")) && !isverbosefilter) continue;
        if ((Monitor_output[i].trim().toLowerCase() === "wait") && !isverbosefilter) continue;
        if ((target_firmware === "grbl") || (target_firmware === "grbl-embedded")) {
            //no status
            if ((Monitor_output[i].startsWith("<") || Monitor_output[i].startsWith("[echo:")) && !isverbosefilter) continue;
        } else {
            //no temperatures
            if (!isverbosefilter && Monitor_output[i].match(regex)) continue;
        }
        if ((Monitor_output[i].trim() === "\n") || (Monitor_output[i].trim() === "\r")
            || (Monitor_output[i].trim() === "\r\n") || (Monitor_output[i].trim() === ""))
            continue;

        m = Monitor_output[i];

        if (Monitor_output[i].startsWith("[#]")) {
            if (!isverbosefilter) continue;
            else m = m.replace("[#]", "");
        }

        //position
        if (!isverbosefilter && Monitor_output[i].startsWith("X:")) continue;
         if (!isverbosefilter && Monitor_output[i].startsWith("FR:")) continue;
        m = m.replace("&", "&amp;");
        m = m.replace("<", "&lt;");
        m = m.replace(">", "&gt;");
        if (m.startsWith("ALARM:") || m.startsWith("Hold:") || m.startsWith("Door:")) {
            m = "<font color='orange'><b>" + m + translateTextItem(m.trim()) + "</b></font>\n";
        }
        if (m.startsWith("error:")) {
            m = "<font color='red'><b>" + m.toUpperCase() + translateTextItem(m.trim()) + "</b></font>\n";
        }
        if ((m.startsWith("echo:") || m.startsWith("Config:")) && !isverbosefilter) continue;
        if (m.startsWith("echo:Unknown command: \"echo\"") || (m.startsWith("echo:enqueueing \"*\""))) continue;
        output += m;
    }
    COMMAND_PANEL__MONITOR.getCmdContent().innerHTML = output;
    monitor_checkAutoscroll();
}

function sendCustomCommand() {
    var cmd = COMMAND_PANEL__MONITOR.getCustomCommand().trim();
    if (cmd.length === 0)
        return;

    var url = "/command?commandText=";

    CustomCommand_history.push(cmd);
    CustomCommand_history.slice(-40);
    CustomCommand_history_index = CustomCommand_history.length;

    COMMAND_PANEL__MONITOR.clearCustomCommand();

    monitor_outputUpdate(cmd + "\n");
    cmd = encodeURI(cmd);
    //because # is not encoded
    cmd = cmd.replace("#", "%23");
    sendGetHttp(url + cmd, sendCustomCommandSuccess, sendCustomCommandFailed);
}

function customCommand_OnKeyUp(event) {
    if (event.keyCode === 13) {
        sendCustomCommand();
    }

    if (event.keyCode === 38 || event.keyCode === 40) {
        if (event.keyCode === 38 && CustomCommand_history.length > 0 && CustomCommand_history_index > 0) {
            CustomCommand_history_index--;
        } else if (event.keyCode === 40 && CustomCommand_history_index < CustomCommand_history.length - 1) {
            CustomCommand_history_index++;
        }

        if (CustomCommand_history_index >= 0 && CustomCommand_history_index < CustomCommand_history.length) {
            COMMAND_PANEL__MONITOR.setCustomCommand(CustomCommand_history[CustomCommand_history_index]);
        }
        return false;
    }
    return true;
}

function sendCustomCommandSuccess(response) {
    if (response[response.length - 1] !== '\n') monitor_outputUpdate(response + "\n");
    else {
        monitor_outputUpdate(response);
    }
    var tcmdres = response.split("\n");
    for (var il = 0; il < tcmdres.length; il++){
        processSocketResponse(tcmdres[il]);
    }
}

function sendCustomCommandFailed(error_code, response) {
    if (error_code === 0) {
        monitor_outputUpdate(translateTextItem("Connection error") + "\n");
    } else {
         monitor_outputUpdate(translateTextItem("Error : ") + error_code + " :" + decodeEntities(response) + "\n");
    }
    console.log("cmd Error " + error_code + " :" + decodeEntities(response));
}
