import Cell from "../../../cell.js";
export default class Rotator_CCW extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "rotator_ccw";
    static texture = "./mods/mystic/tex/rotator_ccw.png";
    update() {
        for (let rot of [0, 1, 2, 3]) {
            let cell = this.cellAtRot(rot);
            if (!cell) continue;
            cell.rotate(1);
        }
    }
}