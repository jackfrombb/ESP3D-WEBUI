/*jshint esversion: 6 */

function camera_NormalizeAddress() {
    var saddress = CAMERA.getAddressValue();
    var saddressl = saddress.trim().toLowerCase();
    saddress = saddress.trim();

    if (saddress.length > 0) {
        if (!(saddressl.indexOf("https://") !== -1 || saddressl.indexOf("http://") !== -1
            || saddressl.indexOf("rtp://") !== -1 || saddressl.indexOf("rtps://") !== -1
            || saddressl.indexOf("rtp://") !== -1)) {
            saddress = "http://" + saddress;
        }
    }
    CAMERA.setAddressValue(saddress);
}

function camera_LoadFrame() {
    var saddress = CAMERA.getAddressValue();
    saddress = saddress.trim();
    const visible = saddress.length === 0;

    if(visible) {
        camera_NormalizeAddress();
    }

    CAMERA.setVisibility(visible);
}

function camera_OnKeyUp(event) {
    if (event.keyCode === 13) {
        camera_LoadFrame();
    }
    return true;
}

function camera_saveAddress() {
    camera_NormalizeAddress();
    preferenceslist[0].camera_address = htmlEncode(CAMERA.getAddressValue());
    SavePreferences(true);
}

function camera_detachCam() {
    var webaddress = document.getElementById('camera_frame').src;
    document.getElementById('camera_frame').src = "";
    document.getElementById('camera_frame_display').style.display = "none";
    document.getElementById('camera_detach_button').style.display = "none";
    window.open(webaddress);
}

function camera_getAddress() {
        CAMERA.setAddressValue(typeof(preferenceslist[0].camera_address) !== 'undefined' ?
            decodeEntities(preferenceslist[0].camera_address) : "");
}