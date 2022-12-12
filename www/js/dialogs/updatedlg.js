//update dialog ========================================================================================================

var update_ongoing = false;
var current_update_filename = "";
function updatedlg() {
    var modal = setactiveModal('updatedlg.html');
    if (modal == null) return;
    document.getElementById("fw_file_name").innerHTML = translateTextItem("No file chosen");
    document.getElementById('prgfw').style.display = 'none';
    document.getElementById('uploadfw-button').style.display = 'none';
    document.getElementById('updatemsg').innerHTML = "";
    document.getElementById('fw-select').value = "";
    if (target_firmware == "grbl-embedded") document.getElementById('fw_update_dlg_title').innerHTML = translateTextItem("ESP3D Update").replace("ESP3D", "GRBL_ESP32");
    if (target_firmware == "marlin-embedded") document.getElementById('fw_update_dlg_title').innerHTML = translateTextItem("ESP3D Update").replace("ESP3D", "Marlin");
    showModal();
}

function closeUpdateDialog(msg) {
    if (update_ongoing) {
        alertdlg(translateTextItem("Busy..."), translateTextItem("Update is ongoing, please wait and retry."));
        return;
    }
    closeModal(msg);
}

function checkupdatefile() {
    var files = document.getElementById('fw-select').files;
    document.getElementById('updatemsg').style.display = 'none';
    if (files.length == 0) document.getElementById('uploadfw-button').style.display = 'none';
    else document.getElementById('uploadfw-button').style.display = 'block';
    if (files.length > 0) {
        if (files.length == 1) {
            document.getElementById("fw_file_name").innerHTML = files[0].name;
        } else {
            var tmp = translateTextItem("$n files");
            document.getElementById("fw_file_name").innerHTML = tmp.replace("$n", files.length);
        }
    } else {
        document.getElementById("fw_file_name").innerHTML = translateTextItem("No file chosen");
    }
}

function UpdateProgressDisplay(oEvent) {
    if (oEvent.lengthComputable) {
        var percentComplete = (oEvent.loaded / oEvent.total) * 100;
        document.getElementById('prgfw').value = percentComplete;
        document.getElementById('updatemsg').innerHTML = translateTextItem("Uploading ") + current_update_filename + " " + percentComplete.toFixed(0) + "%";
    } else {
        // Impossible because size is unknown
    }
}

function UploadUpdatefile() {
    confirmdlg(translateTextItem("Please confirm"), translateTextItem("Update Firmware ?"), StartUploadUpdatefile)
}

function StartUploadUpdatefile(response) {
    if (response != "yes") return;
    if (http_communication_locked) {
        alertdlg(translateTextItem("Busy..."), translateTextItem("Communications are currently locked, please wait and retry."));
        return;
    }
    var files = document.getElementById('fw-select').files
    var formData = new FormData();
    var url = "/updatefw";
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var arg = "/" + file.name + "S";
        //append file size first to check updload is complete
        formData.append(arg, file.size);
        formData.append('myfile[]', file, "/" + file.name);
    }
    document.getElementById('fw-select_form').style.display = 'none';
    document.getElementById('uploadfw-button').style.display = 'none';
    update_ongoing = true;
    document.getElementById('updatemsg').style.display = 'block';
    document.getElementById('prgfw').style.display = 'block';
    if (files.length == 1) current_update_filename = files[0].name;
    else current_update_filename = "";
    document.getElementById('updatemsg').innerHTML = translateTextItem("Uploading ") + current_update_filename;
    sendFileHttp(url, formData, UpdateProgressDisplay, updatesuccess, updatefailed)
}

function updatesuccess(response) {
    document.getElementById('updatemsg').innerHTML = translateTextItem("Restarting, please wait....");
    document.getElementById("fw_file_name").innerHTML = "";
    var i = 0;
    var interval;
    var x = document.getElementById("prgfw");
    x.max = 40;
    interval = setInterval(function() {
        i = i + 1;
        var x = document.getElementById("prgfw");
        x.value = i;
        document.getElementById('updatemsg').innerHTML = translateTextItem("Restarting, please wait....") + (41 - i) + translateTextItem(" seconds");
        if (i > 40) {
            update_ongoing = false;
            clearInterval(interval);
            location.reload();
        }
    }, 1000);
    //console.log(response);
}

function updatefailed(errorcode, response) {
    document.getElementById('fw-select_form').style.display = 'block';
    document.getElementById('prgfw').style.display = 'none';
    document.getElementById("fw_file_name").innerHTML = translateTextItem("No file chosen");
    document.getElementById('uploadfw-button').style.display = 'none';
    //document.getElementById('updatemsg').innerHTML = "";
    document.getElementById('fw-select').value = "";
    if (esp_error_code !=0){
        alertdlg (translateTextItem("Error") + " (" + esp_error_code + ")", esp_error_message);
        document.getElementById('updatemsg').innerHTML = translateTextItem("Upload failed : ") + esp_error_message;
        esp_error_code = 0;
    } else {
        alertdlg (translateTextItem("Error"), "Error " + errorcode + " : " + response);
        document.getElementById('updatemsg').innerHTML = translateTextItem("Upload failed : ") + errorcode + " :" + response;
    }
    console.log("Error " + errorcode + " : " + response);
    update_ongoing = false;
    sendGetHttp("/updatefw");
}