
class VisualInfoPanel {
    #fan = document.getElementById("printer_fan_group");
    constructor() {
        this.setFanSpeed(10);
    }

    setFanSpeed(percent){
        this.#fan.classList.add("fas", "fa-spinner","fa-3x", "fa-spin")
    }
}

const VISUAL_INFO_PANEL = new VisualInfoPanel();