export default class CellMachine {
    constructor(size = 50, time = 200, el = document.getElementById("cells")) {
        this.w = 1;
        this.h = 1;

        this.time = time;
        this.running = true;
        this.ticking = false;

        /** @type {import("./cell.js").default[]} */
        this.cells = [];
        /** @type {[string, 0 | 1 | 2 | 3][]} */
        this.order = [
            ["generator", 0], ["generator", 2], ["generator", 1], ["generator", 3],
            ["rotator"], ["rotator_ccw"],
            ["orientator", 0], ["orientator", 2], ["orientator", 1], ["orientator", 3],
            ["mover", 0], ["mover", 2], ["mover", 1], ["mover", 3]
        ];

        this.element = el;
        el.style.setProperty("--size", size + "px");
        el.style.setProperty("--time", time + "ms");
    }
    tick() {
        if (this.ticking) return;
        this.ticking = true;
        for (let o of this.order) {
            if (o.length < 2) this.cells.filter(cell => cell.type === o[0]).forEach(cell => cell.update());
            else switch (o[1]) {
                case 0:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot & 3) === 0).sort((c0, c1) => c1.x - c0.x).forEach(cell => cell.update());
                    break;
                case 1:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot & 3) === 1).sort((c0, c1) => c0.y - c1.y).forEach(cell => cell.update());
                    break;
                case 2:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot & 3) === 2).sort((c0, c1) => c0.x - c1.x).forEach(cell => cell.update());
                    break;
                case 3:
                    this.cells.filter(cell => cell.type === o[0] && (cell.rot & 3) === 3).sort((c0, c1) => c1.y - c0.y).forEach(cell => cell.update());
                    break;
            }
        }
        for (let cell of this.cells) {
            cell.updateEl();
        }
        setTimeout(() => this.ticking = false, this.time);
    }
    addCell(type = Cell, x = 0, y = 0, rot = 0) {
        const cell = new type(x, y, rot, this);
        this.cells.push(cell);
        this.element.insertBefore(cell.element, this.element.firstChild);
        cell.updateEl();

        return cell;
    }
    rectCell(type = Cell, x1 = 0, y1 = 0, x2 = 1, y2 = 1, rot = 0) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                this.addCell(type, x, y, rot);
            }
        }
    }
    cellAt(x = 0, y = 0) {
        return this.cells.find(cell => cell.x === x && cell.y === y) || null;
    }
    pause() {
        this.running = false;
    }
    play() {
        if (this.running) return;
        this.running = true;
        setTimeout(this.gameLoop.bind(this), 0);
    }
    gameLoop() {
        if (!this.running) return;
        this.tick();
        setTimeout(this.gameLoop.bind(this), this.time);
    }
    clear() {
        while (this.cells.length) this.cells[0].remove();
    }
    createLevel(w = 10, h = 10) {
        this.pause();
        this.clear();
        this.w = w;
        this.h = h;
        this.element.style.setProperty("--width", w);
        this.element.style.setProperty("--height", h);
    }
}