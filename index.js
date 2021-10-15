import CellMachine from "./CellMachine.js";
import Cell from "./cell.js";

const menu = document.getElementById("menu");
const createBtn = document.getElementById("createBtn");
const createDiv = document.getElementById("createDiv");
const createFinalBtn = document.getElementById("createFinalBtn");
const cellsDiv = document.getElementById("cells");
const gui = document.getElementById("gui");
const playBtn = document.getElementById("play");
const tickBtn = document.getElementById("tick");
const hotbar = Array.from(document.getElementsByClassName("slot"));

const cellClasses = {};

let ready = 0;
function registerMod(modid) {
    ready++;

    /** 
     * @param {Object} module 
     * @param {Array<typeof Cell>} module.default
     */
    function handler({ default: mod }) {
        console.log(mod);
        mod.forEach(cell => {
            if (cell.type in cellClasses) {
                console.error("ERROR: Cell type", cell.type, "clashes with already existing cell", cellClasses[cell.type]);
                return;
            }
            cellClasses[cell.type] = cell;
        });
        ready--;
    }

    import(`./mods/${modid}/export.js`).then(handler).catch(console.error);
}


["mystic", "jell"].forEach(registerMod);


const sys = new CellMachine(32, 200, cellsDiv);


createBtn.addEventListener("click", e => {
    hide(menu);
    sys.createLevel(10, 4);

    show(cellsDiv);
    show(gui);
});
playBtn.addEventListener("click", e => {
    if (sys.running) {
        sys.pause();
        playBtn.title = "Play";
        return;
    }
    sys.play();
    playBtn.title = "Pause";
});
tickBtn.addEventListener("click", e => {
    sys.pause();
    playBtn.title = "Play";
    sys.tick();
});

/** @param {Element} el */
function hide(el) {
    el.classList.add("hidden");
}
/** @param {Element} el */
function show(el) {
    el.classList.remove("hidden");
}