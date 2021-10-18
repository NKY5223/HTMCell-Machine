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

/** @type {{el: Element, cell: typeof Cell}[]} */
const hotbar = Array.from(document.getElementsByClassName("slot")).map(el => ({el, cell: null}));
/** @type {{[type: string]: typeof Cell}} */
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

let onready = setInterval(() => {
    if (notReady) return;
    console.log("ready");
    clearInterval(onready);

    [
        cellClasses.generator,
        cellClasses.mover,
        cellClasses.rotator,
        cellClasses.push,
        cellClasses.enemy,
        cellClasses.trash,
        cellClasses.immobile
    ].forEach((cell, i) => {
        hotbar[i].cell = cell;
        hotbar[i].el.classList.add(cell.type);
    });
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

/** @type {Element} */
let activeSlot = null;
hotbar.forEach(({el: slot}) => {
    slot.addEventListener("click", e => {
        if (activeSlot) activeSlot.classList.remove("selected");
        slot.classList.add("selected");
        activeSlot = slot;
    });
});

/** @type {Set<string>} */
const keysDown = new Set();
document.addEventListener("keydown", e => {
    keysDown.add(e.code);
});
document.addEventListener("keyup", e => {
    keysDown.delete(e.code);
});

let camX = 0;
let camY = 0;
let camScale = 1;
const camSpeed = 5;

document.addEventListener("wheel", e => {
    if (e.ctrlKey) return;

    let m = 0.9 ** (e.deltaY / 125);
    let x = (e.pageX - window.innerWidth / 2) / camScale + camX;
    let y = (e.pageY - window.innerHeight / 2) / camScale + camY;

    camX = (m * x - x + camX) / m;
    camY = (m * y - y + camY) / m;
    camScale *= m;
});
(function camera() {
    camX += camSpeed * (keysDown.has("KeyD") - keysDown.has("KeyA")) / Math.sqrt(camScale);
    camY += camSpeed * (keysDown.has("KeyS") - keysDown.has("KeyW")) / Math.sqrt(camScale);
    cellsDiv.style.transform = `scale(${camScale}) translate(${-camX}px, ${-camY}px)`;
    requestAnimationFrame(camera);
})();

window.addEventListener("beforeunload", e => {
    e.preventDefault();
    return e.returnValue = "Are you sure you want to exit? You might have unsaved work";
});

/** @param {Element} el */
function hide(el) {
    el.classList.add("hidden");
}
/** @param {Element} el */
function show(el) {
    el.classList.remove("hidden");
}