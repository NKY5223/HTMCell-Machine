import Cell from "../../../cell.js";
export default class Generator extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "generator";
    static texture = "./mods/mystic/tex/generator.png";
    update() {
        let toGen = this.cellAtRot((this.rot + 2) & 3);
        
        if (toGen) {
            let pushCell = this.sys.cel
            // let newCell = this.sys.addCell(toGen.constructor, this.x, this.y, toGen.rot);
            if (newCell.push(this.rot, 1) === false) {
                newCell.remove();
            }
        }
    }
}