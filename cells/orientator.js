class Orientator extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "orientator");
    }
    update() {
        for (let rot of [0, 1, 2, 3]) {
            let cell = this.cellAtRot(rot);
            if (!cell) continue;
            switch (((this.rot & 3) - (cell.rot & 3)) & 3) {
                case 0:
                    break;
                case 1:
                    cell.rotate(1);
                    break;
                case 2:
                    cell.rotate(2);
                    break;
                case 3: 
                    cell.rotate(-1);
                    break;
            }
        }
    }
}