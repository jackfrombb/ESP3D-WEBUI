var http_communication_locked = false;
var http_cmd_list = [];
var processing_cmd = false;
var xmlhttpupload;

var max_cmd = 20;

const xmHttpProcess = (xmlhttp, errorfn, resultfn) => {
    if (xmlhttp.status === 200) {
        if (typeof resultfn != 'undefined' && resultfn != null)
            resultfn(xmlhttp.responseText);
    }
    else {
        if (xmlhttp.status === 401) GetIdentificationStatus();
        if (typeof errorfn != 'undefined' && errorfn != null)
            errorfn(xmlhttp.status, xmlhttp.responseText);
    }
}

function clearCmdList() {
    http_cmd_list = [];
    processing_cmd = false;
}

function httpResultFn(response_text) {
    if ((http_cmd_list.length > 0) && (typeof http_cmd_list[0].resultfn != 'undefined')) {
        var fn = http_cmd_list[0].resultfn;
        fn(response_text);
    } //else console.log ("No resultfn");
    http_cmd_list.shift();
    processing_cmd = false;
    processCmd();
}

function httpErrorFn(error_code, response_text) {
    if ((http_cmd_list.length > 0) && (typeof http_cmd_list[0].errorfn != 'undefined')) {
        var fn = http_cmd_list[0].errorfn;
        if (error_code === 401) {
            logindlg();
            console.log("Authentication issue pls log");
        }
        fn(error_code, response_text);
    } //else console.log ("No errorfn");
    http_cmd_list.shift();
    processing_cmd = false;
    processCmd();
}

function processCmd() {
    if ((http_cmd_list.length > 0) && (!processing_cmd)) {
        //console.log("Processing 1/" + http_cmd_list.length);
        //console.log("Processing " + http_cmd_list[0].cmd);
        if (http_cmd_list[0].type === "GET") {
            processing_cmd = true;
            processGetHttp(http_cmd_list[0].cmd, httpResultFn, httpErrorFn);
        }
        else if (http_cmd_list[0].type === "POST") {
            processing_cmd = true;
            if (!(http_cmd_list[0].isupload)) {
                processPostHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, httpResultFn, httpErrorFn);
            } else {
                //console.log("Uploading");
                processFileHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, http_cmd_list[0].progressfn, httpResultFn, httpErrorFn);
            }
        }
        else if (http_cmd_list[0].type === "CMD") {
            processing_cmd = true;
            var fn = http_cmd_list[0].cmd;
            fn();
            http_cmd_list.shift();
            processing_cmd = false;
            processCmd();
        }

    } //else if (http_cmd_list.length > 0)console.log("processing"); 
}

function addCmd(cmd_fn, id) {
    if (http_cmd_list.length > max_cmd) {
        //console.log("adding rejected");	
        return;
    }
    var cmd_id = 0;
    if (typeof id != 'undefined') cmd_id = id;
    //onsole.log("adding command");
    var cmd = {
        cmd: cmd_fn,
        type: "CMD",
        id: cmd_id
    };
    http_cmd_list.push(cmd);
    //console.log("Now " + http_cmd_list.length);
    processCmd();
}

function sendGetHttp(url, result_fn, error_fn, id, max_id) {
    if ((http_cmd_list.length > max_cmd) && (max_cmd !== -1)) {
        console.log("adding rejected");
        error_fn();
        return;
    }
    var cmd_id = 0;
    var cmd_max_id = 1;
    //console.log("ID = " + id);
    //console.log("Max ID = " + max_id);
    //console.log("+++ " + url);

    if (typeof id != 'undefined') {
        cmd_id = id;
        if (typeof max_id != 'undefined') cmd_max_id = max_id;
        //else console.log("No Max ID defined");
        for (p = 0; p < http_cmd_list.length; p++) {
            //console.log("compare " + (max_id - cmd_max_id));	
            if (http_cmd_list[p].id === cmd_id) {
                cmd_max_id--;
                //console.log("found " + http_cmd_list[p].id + " and " + cmd_id);	
            }
            if (cmd_max_id <= 0) {
                //console.log("Limit reched for " + id);	
                return;
            }
        }
    } //else console.log("No ID defined");	
    //console.log("adding " + url);
    var cmd = {
        cmd: url,
        type: "GET",
        isupload: false,
        resultfn: result_fn,
        errorfn: error_fn,
        id: cmd_id
    };
    http_cmd_list.push(cmd);
    //console.log("Now " + http_cmd_list.length);
    processCmd();
}

function processGetHttp(url, resultfn, errorfn) {
    if (http_communication_locked) {
        errorfn(503, translateTextItem("Communication locked!"));
        console.log("locked");
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            xmHttpProcess(xmlhttp, resultfn, errorfn);
           /* if (xmlhttp.status === 200) {
                //console.log("*** " + url + " done");
                if (typeof resultfn != 'undefined' && resultfn != null)
                    resultfn(xmlhttp.responseText);
            }
            else {
                if (xmlhttp.status === 401) GetIdentificationStatus();
                if (typeof errorfn != 'undefined' && errorfn != null)
                    errorfn(xmlhttp.status, xmlhttp.responseText);
            }*/
        }
    }
    if (url.indexOf("?") !== -1) url += "&PAGEID=" + page_id;
    //console.log("GET:" + url);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/* NOT IN USE
function sendPostHttp(url, postdata, result_fn, error_fn, id, max_id) {
    if ((http_cmd_list.length > max_cmd) && (max_cmd !== -1)) {
        //console.log("adding rejected");	
        error_fn();
        return;
    }
    var cmd_id = 0;
    var cmd_max_id = 1;
    if (typeof id != 'undefined') {
        cmd_id = id;
        if (typeof max_id != 'undefined') cmd_max_id = max_id;
        for (p = 0; p < http_cmd_list.length; p++) {
            if (http_cmd_list[p].id === cmd_id) cmd_max_id--;
            if (cmd_max_id <= 0) return;
        }
    }

    //console.log("adding " + url);
    var cmd = {
        cmd: url,
        type: "POST",
        isupload: false,
        data: postdata,
        resultfn: result_fn,
        errorfn: error_fn,
        initfn: init_fn,
        id: cmd_id
    };
    http_cmd_list.push(cmd);
    processCmd();
}*/

function processPostHttp(url, postdata, resultfn, errorfn) {
    if (http_communication_locked) {
        errorfn(503, translateTextItem("Communication locked!"));
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState === 4) {
            xmHttpProcess(xmlhttp, errorfn, resultfn);
            /*if (xmlhttp.status === 200) {
                if (typeof resultfn != 'undefined' && resultfn != null)
                    resultfn(xmlhttp.responseText);
            }
            else {
                if (xmlhttp.status === 401) GetIdentificationStatus();
                if (typeof errorfn != 'undefined' && errorfn != null)
                    errorfn(xmlhttp.status, xmlhttp.responseText);
            }*/
        }
    }

    //console.log(url);
    xmlhttp.open("POST", url, true);
    xmlhttp.send(postdata);
}

function sendFileHttp(url, postdata, progress_fn, result_fn, error_fn) {
    if ((http_cmd_list.length > max_cmd) && (max_cmd !== -1)) {
        //console.log("adding rejected");	
        error_fn();
        return;
    }
    if (http_cmd_list.length !== 0)
        process = false;

    var cmd = {
        cmd: url,
        type: "POST",
        isupload: true,
        data: postdata,
        progressfn: progress_fn,
        resultfn: result_fn,
        errorfn: error_fn,
        id: 0
    };
    http_cmd_list.push(cmd);
    processCmd();
}

function cancelCurrentUpload() {
    xmlhttpupload.abort();
    //http_communication_locked = false;
    console.log("Cancel Upload");
}

function processFileHttp(url, postdata, progressfn, resultfn, errorfn) {
    if (http_communication_locked) {
        errorfn(503, translateTextItem("Communication locked!"));
        return;
    }
    http_communication_locked = true;
    xmlhttpupload = new XMLHttpRequest();
    xmlhttpupload.onreadystatechange = function() {
        if (xmlhttpupload.readyState === 4) {
            http_communication_locked = false;
            xmHttpProcess(xmlhttpupload, resultfn, errorfn);
            /*if (xmlhttpupload.status === 200) {
                if (typeof resultfn != 'undefined' && resultfn != null) resultfn(xmlhttpupload.responseText);
            }
            else {
                if (xmlhttpupload.status === 401) GetIdentificationStatus();
                if (typeof errorfn != 'undefined' && errorfn != null)
                    errorfn(xmlhttpupload.status, xmlhttpupload.responseText);
            }*/
        }
    }
    //console.log(url);
    xmlhttpupload.open("POST", url, true);
    if (typeof progressfn != 'undefined' && progressfn != null)
        xmlhttpupload.upload.addEventListener("progress", progressfn, false);
    xmlhttpupload.send(postdata);
}
