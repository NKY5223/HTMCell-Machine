class Rotator extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "rotator");
    }
    update() {
        for (let rot of [0, 1, 2, 3]) {
            let cell = this.cellAtRot(rot);
            if (!cell) continue;
            cell.rotate(-1);
        }
    }
}