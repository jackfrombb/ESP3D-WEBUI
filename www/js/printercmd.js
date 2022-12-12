
function sendPrinterCommand(cmd, echo_on, processfn, errorfn, id, max_id) {
    var url = "/command?commandText=";
    var push_cmd = true;
    if (typeof echo_on !== 'undefined') {
        push_cmd = echo_on;
    }
    if (cmd.trim().length === 0) return;
    if (push_cmd) monitor_outputUpdate("[#]" + cmd + "\n");
    //removeIf(production)
    console.log(cmd);
    if (typeof processfn !== 'undefined') processfn("Test response");
    else sendPrinterCommandSuccess("Test response");
    return;
    //endRemoveIf(production)
    if (typeof processfn === 'undefined' || processfn == null)
        processfn = sendPrinterCommandSuccess;
    if (typeof errorfn === 'undefined' || errorfn == null)
        errorfn = sendPrinterCommandFailed;

    cmd = encodeURI(cmd);
    cmd = cmd.replace("#", "%23");
    sendGetHttp(url + cmd, processfn, errorfn, id, max_id);
    //console.log(cmd);
}

function sendPrinterSilentCommand(cmd, processfn, errorfn, id, max_id) {
    var url = "/command_silent?commandText=";
    if (cmd.trim().length === 0) return;
    //removeIf(production)
    console.log(cmd);
    if (typeof processfn !== 'undefined') processfn("Test response");
    else sendPrinterCommandSuccess("Test response");
    return;
    //endRemoveIf(production)
    if (typeof processfn === 'undefined' || processfn == null)
        processfn = sendPrinterSilentCommandSuccess;
    if (typeof errorfn === 'undefined' || errorfn == null)
        errorfn = sendPrinterCommandFailed;
    cmd = encodeURI(cmd);
    cmd = cmd.replace("#", "%23");
    sendGetHttp(url + cmd, processfn, errorfn, id, max_id);
    //console.log(cmd);
}

function sendPrinterSilentCommandSuccess(response) {
    //console.log(response);
}

function sendPrinterCommandSuccess(response) {
    if ((target_firmware === "grbl") || (target_firmware === "grbl-embedded"))
        return;

    if (response[response.length - 1] !== '\n')
        monitor_outputUpdate(response + "\n");
    else monitor_outputUpdate(response);
}

function sendPrinterCommandFailed(error_code, response) {
    if (error_code === 0) {
        monitor_outputUpdate(translateTextItem("Connection error") + "\n");
    }
    else {
         monitor_outputUpdate(translateTextItem("Error : ") + error_code + " :" + decodeEntities(response) + "\n");
    }

    console.log("printer cmd Error " + error_code + " :" + decodeEntities(response));
}
