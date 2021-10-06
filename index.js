const createBtn = document.getElementById("create");
const menu = document.getElementById("menu");
const cellsDiv = document.getElementById("cells");
const gui = document.getElementById("gui");
const playBtn = document.getElementById("play");
const tickBtn = document.getElementById("tick");

/** @param {Element} el */
function hide(el) {
    el.classList.add("hidden");
}
/** @param {Element} el */
function show(el) {
    el.classList.remove("hidden");
}

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