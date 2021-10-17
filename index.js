import CellMachine from "./CellMachine.js";
import Cell from "./cell.js";

const texStyles = document.getElementById("tex");
const menu = document.getElementById("menu");
const createBtn = document.getElementById("createBtn");
const createDiv = document.getElementById("createDiv");
const widthInp = document.getElementById("width");
const heightInp = document.getElementById("height");
const createFinalBtn = document.getElementById("createFinalBtn");
const cellsDiv = document.getElementById("cells");
const gui = document.getElementById("gui");
const playBtn = document.getElementById("play");
const tickBtn = document.getElementById("tick");
const hotbarEl = Array.from(document.getElementsByClassName("slot"));

const cellClasses = {};

let notReady = 0;
function registerMod(modid) {
    notReady++;

    /** 
     * @param {Object} module 
     * @param {Array<typeof Cell>} module.default
     */
    function handler({ default: mod }) {
        mod.forEach(cell => {
            if (cell.type in cellClasses) {
                console.error("ERROR: Cell type", cell.type, "clashes with already existing cell", cellClasses[cell.type]);
                return;
            }
            cellClasses[cell.type] = cell;
            texStyles.innerHTML += `.${cell.type} {
    background-image: url(${cell.texture});
}
`
        });
        notReady--;
    }

    import(`./mods/${modid}/export.js`).then(handler).catch(console.error);
}


["mystic", "jell"].forEach(registerMod);

/** @type {Array<typeof Cell>} */
const hotbar = [];
let onready = setInterval(() => {
    if (notReady) return;
    console.log("ready");
    clearInterval(onready);

    hotbar.push(
        cellClasses.generator,
        cellClasses.mover,
        cellClasses.rotator,
        cellClasses.push,
        cellClasses.enemy,
        cellClasses.trash,
        cellClasses.immobile
    );

    hotbar.forEach((cell, i) => hotbarEl[i].classList.add(cell.type));
}, 16);

const sys = new CellMachine(32, 200, cellsDiv);


createBtn.addEventListener("click", e => {
    hide(menu);
    show(createDiv);
});
createFinalBtn.addEventListener("click", e => {
    sys.createLevel(Number(widthInp.value), Number(heightInp.value));
    hide(createDiv);
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