import Cell from "../../../cell.js";
export default class Push extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "push";
    static texture = "./mods/mystic/tex/push.png";
}