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
const hotbarEl = document.getElementById("hotbar");

/** @type {{el: Element, cell: typeof Cell}[]} */
const hotbar = Array.from(document.getElementsByClassName("slot")).map(el => ({ el, cell: null }));
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
[widthInp, heightInp].forEach(el => el.addEventListener("input", e => {
    el.value = Math.max(1, Math.floor(Number(el.value)));
}));
let inGame = false;
createFinalBtn.addEventListener("click", e => {
    sys.createLevel(Number(widthInp.value), Number(heightInp.value));
    hide(createDiv);
    show(cellsDiv);
    show(gui);
    inGame = true;
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

/** @type {{el: Element, cell: typeof Cell}} */
let activeSlot = null;
hotbar.forEach(slot => {
    slot.el.addEventListener("click", e => {
        if (activeSlot) activeSlot.el.classList.remove("selected");
        slot.el.classList.add("selected");
        activeSlot = slot;
    });
});

let placing = false;
cellsDiv.addEventListener("mousedown", e => {
    placing = true;
});
cellsDiv.addEventListener("mouseup", e => {
    placing = false;
});
cellsDiv.addEventListener("mousemove", e => {
    if (!placing) return;
    if (!activeSlot) return;
    if (!activeSlot.cell) return;
    let x = Math.floor(((e.pageX - window.innerWidth / 2) / camScale + camX) / 32 + sys.w / 2);
    let y = Math.floor(((e.pageY - window.innerHeight / 2) / camScale + camY) / 32 + sys.h / 2);
    sys.cellAt(x, y)?.remove();
    if (e.button === 0) sys.addCell(activeSlot.cell, x, y, rotate & 3);
});
cellsDiv.addEventListener("contextmenu", e => {
    e.preventDefault();
});
let rotate = 0;
document.addEventListener("keydown", e => {
    rotate += (e.code === "KeyQ") - (e.code === "KeyE");
    hotbarEl.style.setProperty("--rotate", rotate);
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
let targetCamX = 0;
let targetCamY = 0;
let camScale = 1;
const camSpeed = 5;
const camSpeedCoeff = 0.1;

document.body.addEventListener("wheel", e => {
    if (e.ctrlKey) return;
    if (!inGame) return;
    if (camScale > 10 && e.deltaY < 0) return;
    if (camScale < 0.01 && e.deltaY > 0) return;

    let m = 0.9 ** (e.deltaY / 125);
    let x = (e.pageX - window.innerWidth / 2) / camScale + camX;
    let y = (e.pageY - window.innerHeight / 2) / camScale + camY;

    targetCamX = camX = (m * x - x + camX) / m;
    targetCamY = camY = (m * y - y + camY) / m;
    camScale *= m;
});
gui.addEventListener("wheel", e => e.stopPropagation());
(function camera() {
    targetCamX += camSpeed * (keysDown.has("KeyD") - keysDown.has("KeyA")) / Math.sqrt(camScale);
    targetCamY += camSpeed * (keysDown.has("KeyS") - keysDown.has("KeyW")) / Math.sqrt(camScale);
    camX = (1 - camSpeedCoeff) * camX +  camSpeedCoeff * targetCamX;
    camY = (1 - camSpeedCoeff) * camY +  camSpeedCoeff * targetCamY;
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