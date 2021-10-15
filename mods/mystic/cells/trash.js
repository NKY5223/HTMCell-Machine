import Cell from "../../../cell.js";
export default class Trash extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "trash";
    push() {
        return null;
    }
}