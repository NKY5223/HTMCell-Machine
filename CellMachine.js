class CellMachine {
    constructor(w = 10, h = 10, size = 50, time = 200, el = document.getElementById("cells")) {
        this.w = w;
        this.h = h;

        this.time = time;
        this.running = true;

        /** @type {Cell[]} */
        this.cells = [];
        /** @type {[string, 0 | 1 | 2 | 3][]} */
        this.order = [
            ["rotator"], ["rotator_ccw"],
            ["mover", 0], ["mover", 2], ["mover", 1], ["mover", 3]
        ];

        this.element = el;
        el.style.setProperty("--width", w);
        el.style.setProperty("--height", h);
        el.style.setProperty("--size", size + "px");
        el.style.setProperty("--time", time + "ms");
    }
    update() {
        for (let o of this.order) {
            if (o.length < 2) this.cells.filter(cell => cell.type === o[0]).forEach(cell => cell.update());
            else switch (o[1]) {
                case 0:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot % 4 + 4) % 4 === 0).sort((c0, c1) => c1.x - c0.x).forEach(cell => cell.update());
                    break;
                case 1:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot % 4 + 4) % 4 === 1).sort((c0, c1) => c0.y - c1.y).forEach(cell => cell.update());
                    break;
                case 2:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot % 4 + 4) % 4 === 2).sort((c0, c1) => c0.x - c1.x).forEach(cell => cell.update());
                    break;
                case 3:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot % 4 + 4) % 4 === 3).sort((c0, c1) => c1.y - c0.y).forEach(cell => cell.update());
                    break;
            }
        }
        for (let cell of this.cells) {
            cell.updateEl();
        }
    }
    /** @param args Arguments to pass to `type`'s `constructor` */
    addCell(type = Cell, ...args) {
        const cell = new type(...args, this);
        this.cells.push(cell);
        this.element.appendChild(cell.element);
    }
    cellAt(x = 0, y = 0) {
        return this.cells.find(cell => cell.x === x && cell.y === y) || null;
    }
    disable() {
        this.running = false;
    }
    gameLoop() {
        if (!this.running) return;
        this.update();
        setTimeout(this.gameLoop.bind(this), this.time);
    }
}