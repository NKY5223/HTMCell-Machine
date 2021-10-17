import Cell from "../../../cell.js";
export default class Immobile extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "immobile";
    static texture = "./mods/mystic/tex/immobile.png";
    push() {
        return false;
    }
}