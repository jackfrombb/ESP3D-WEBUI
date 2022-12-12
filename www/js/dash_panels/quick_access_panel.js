
class QuickAccessPanel {

    constructor() {
        this.addBtn = document.getElementById("add-new-command-btn");
        this.addMenu = document.getElementById("add-new-command-menu");

        this.addBtn.onclick = (x) => {
            //Rotating Plus/Cross
            var span = this.addBtn.querySelector("#add");

            var isOpened = span.classList.toggle(TAG_OPEN);
            this.addMenu.classList.toggle(TAG_OPEN, isOpened);

            this.addMenu.dispatchEvent(onOpenMenuEvent(isOpened));

            if(isOpened) {
                setTimeout((s) => {
                    span.style.zIndex = "3";
                }, 30, span);
            }
            else {
                span.style.zIndex = "3";
            }

            log.debug("addBtnClick: " + isOpened);
        }
    }
}

let QUICK_ACCESS_PANEL = new QuickAccessPanel();
