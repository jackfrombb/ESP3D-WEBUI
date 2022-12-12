//restart dialog
function restartdlg() {
    console.log("show restart");
    var modal = setactiveModal('restartdlg.html');
    if (modal == null) return;
    document.getElementById('prgrestart').style.display = 'block';
    document.getElementById('restartmsg').innerHTML = translateTextItem("Restarting, please wait....");
    showModal();
    sendPrinterCommand("[ESP444]RESTART", false, restart_esp_success, restart_esp_failed);
}

function restart_esp_success(response) {
    var i = 0;
    var interval;
    var x = document.getElementById("prgrestart");
    http_communication_locked = true;
    x.max = 40;
    interval = setInterval(function() {
        last_ping = Date.now();
        i = i + 1;
        var x = document.getElementById("prgrestart");
        x.value = i;
        document.getElementById('restartmsg').innerHTML = translateTextItem("Restarting, please wait....") + (41 - i) + translateTextItem(" seconds");
        if (i > 40) {
            clearInterval(interval);
            location.reload();
        }
    }, 1000);
    //console.log(response);
}

function restart_esp_failed(errorcode, response) {
    document.getElementById('prgrestart').style.display = 'none';
    document.getElementById('restartmsg').innerHTML = translateTextItem("Upload failed : ") + errorcode + " :" + response;
    console.log("Error " + errorcode + " : " + response);
    closeModal('Cancel')
}