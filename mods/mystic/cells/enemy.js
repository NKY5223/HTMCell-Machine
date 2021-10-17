import Cell from "../../../cell.js";
export default class Enemy extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "enemy";
    static texture = "./mods/mystic/tex/enemy.png";
    push() {
        this.remove();
        return null;
    }
}