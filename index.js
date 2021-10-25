import CellMachine from "./CellMachine.js";
import Cell from "./cell.js";

const texStyles = document.getElementById("tex");
const menu = document.getElementById("menu");
const splash = document.getElementById("splash");
const createBtn = document.getElementById("createBtn");
const creditsBtn = document.getElementById("creditsBtn");
const createDiv = document.getElementById("createDiv");
const widthInp = document.getElementById("width");
const heightInp = document.getElementById("height");
const createFinalBtn = document.getElementById("createFinalBtn");
const cellsDiv = document.getElementById("cells");
const gui = document.getElementById("gui");
const playBtn = document.getElementById("play");
const tickBtn = document.getElementById("tick");
const hotbarEl = document.getElementById("hotbar");
const creditsDiv = document.getElementById("credits");


/** @typedef {{el: Element, cells: typeof Cell[], currentCell: typeof Cell}} Slot */
/** @type {Slot[]} */
const hotbar = Array.from(document.getElementsByClassName("slot")).map(el => ({ el, cells: null, currentCell: null }));
/** @type {{[type: string]: typeof Cell}} */
const cellClasses = {};

let notReady = 0;
function loadMod(modid) {
    notReady++;

    /** 
     * @param {Object} module 
     * @param {typeof Cell[]} module.default
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
`;
            let img = new Image();
            img.src = cell.texture;
            textures.push(img);
        });
        notReady--;
    }

    import(`./mods/${modid}/export.js`).then(handler).catch(console.error);
}
/** @type {HTMLImageElement[]} */
const textures = [];


["mystic", "jell"].forEach(loadMod);

let onready = setInterval(() => {
    if (notReady) return;
    console.log("ready");
    clearInterval(onready);

    [
        [cellClasses.generator],
        [cellClasses.mover],
        [cellClasses.rotator, cellClasses.rotator_ccw, cellClasses.orientator],
        [cellClasses.push, cellClasses.slide, cellClasses.arrow],
        [cellClasses.enemy],
        [cellClasses.trash],
        [cellClasses.immobile]
    ].forEach((cells, i) => {
        hotbar[i].cells = cells;
        hotbar[i].el.classList.add(cells[0].type);
        hotbar[i].currentCell = cells[0];
    });
}, 16);


const sys = new CellMachine(32, 200, cellsDiv);


createBtn.addEventListener("click", e => {
    hide(menu);
    show(createDiv);
});
[widthInp, heightInp].forEach(el => el.addEventListener("input", e => {
    if (el.value === "") return;
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

/** @type {Slot} */
let activeSlot = null;
hotbar.forEach(slot => {
    slot.el.addEventListener("mousedown", e => {
        if (activeSlot) activeSlot.el.classList.remove("selected");
        slot.el.classList.add("selected");
        activeSlot = slot;
    });
    slot.el.addEventListener("contextmenu", e => e.preventDefault());
});

document.addEventListener("keydown", e => {
    if (e.code !== "AltLeft") return;
    e.preventDefault();
    hotbar.forEach(slot => {
        if (!slot.currentCell) return;
        slot.el.classList.remove(slot.currentCell.type);
        slot.currentCell = slot.cells[(slot.cells.indexOf(slot.currentCell) + 1) % slot.cells.length];
        slot.el.classList.add(slot.currentCell.type);
    });
});

let placing = -1;
let placeX = 0;
let placeY = 0;
let mouseX = 0;
let mouseY = 0;
cellsDiv.addEventListener("mousedown", e => {
    placing = e.button;
    mouseX = e.pageX;
    mouseY = e.pageY;
    calcPlacePos();
    if (activeSlot && activeSlot.cells && placing === 0) placeCell(activeSlot.currentCell, placeX, placeY, rotate);
});
document.addEventListener("mouseup", e => placing = -1);
cellsDiv.addEventListener("mousemove", e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    calcPlacePos();
});
cellsDiv.addEventListener("contextmenu", e => e.preventDefault());
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
const camSpeedCoeff = 0.2;

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
window.addEventListener("blur", e => {
    placing = -1;
    keysDown.clear();
});
gui.addEventListener("wheel", e => e.stopPropagation());
(function runsEveryFrame() {
    targetCamX += camSpeed * (keysDown.has("KeyD") - keysDown.has("KeyA")) / Math.sqrt(camScale);
    targetCamY += camSpeed * (keysDown.has("KeyS") - keysDown.has("KeyW")) / Math.sqrt(camScale);
    camX = (1 - camSpeedCoeff) * camX + camSpeedCoeff * targetCamX;
    camY = (1 - camSpeedCoeff) * camY + camSpeedCoeff * targetCamY;
    calcPlacePos();
    cellsDiv.style.transform = `scale(${camScale}) translate(${-camX}px, ${-camY}px)`;

    if (placing === 0 && activeSlot && activeSlot.cells) placeCell(activeSlot.currentCell, placeX, placeY, rotate);
    else if (placing === 2) removeCell(placeX, placeY);

    requestAnimationFrame(runsEveryFrame);
})();
function placeCell(cellType, x = 0, y = 0, rot = 0) {
    if (x < 0 || x >= sys.w || y < 0 || x >= sys.h) return;
    let cell = sys.cellAt(x, y);
    if (cell && cell.constructor === cellType && cell.rot & 3 === rot & 3) return;
    removeCell(x, y);
    sys.addCell(cellType, x, y, rot & 3);
}
function removeCell(x = 0, y = 0) {
    sys.cellAt(x, y)?.remove();
}
function calcPlacePos(x = mouseX, y = mouseY) {
    placeX = Math.floor(((x - window.innerWidth / 2) / camScale + camX) / 32 + sys.w / 2);
    placeY = Math.floor(((y - window.innerHeight / 2) / camScale + camY) / 32 + sys.h / 2);
}

creditsBtn.addEventListener("click", e => {
    hide(menu);
    show(creditsDiv);
});

const splashTexts = [
    `<a href="https://discord.gg/zC63JqbagH" target="_blank">Also check out CMCM!</a>`,
    "-10% original!",
    `<a href="https://discord.gg/4aArDTsPJb" target="_blank">Also check out Jell Machine!</a>`,
    "Filled with Cells!",
    "Easter Eggless",
    "Written with HTML, CSS, JS!",
    "Not infected!",
    "Wash your hands!",
    "Wear a mask!",
    "Get the vaccine!"
];
splash.innerHTML = splashTexts[Math.floor(Math.random() * splashTexts.length)];

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