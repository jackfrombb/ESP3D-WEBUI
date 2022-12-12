class ClosingBack {
    constructor() {
        this.back = document.getElementById("close_layout");

        this.back.onclick = (x)=>{
            this.close_all_modal();
            log.debug("CLose all modal")
        }

        document.addEventListener(EVENT_MENU_OPEN, (ev)=>{
            this.back.classList.toggle(TAG_OPEN);
            log.debug("EVENT ON OPEN: " + ev.detail.isOpen)
        })
    }


    /**
     * Remove TAG_OPEN from all tags
     */
    close_all_modal() {
        var actives = document.getElementsByClassName(TAG_OPEN);
        while (actives.length > 0) {
            actives[0].classList.remove(TAG_OPEN);
        }
    }
}

let CLOSING_BACK = new ClosingBack();