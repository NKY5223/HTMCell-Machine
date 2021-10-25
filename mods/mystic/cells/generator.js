import Cell from "../../../cell.js";
export default class Generator extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "generator";
    static texture = "./mods/mystic/tex/generator.png";
    update() {
        let pos = this.posAtRot(this.rot & 3);
        if (pos[0] < 0 || pos[0] >= this.sys.w || pos[1] < 0 || pos[1] >= this.sys.h) return;
        let toGen = this.cellAtRot((this.rot + 2) & 3);

        if (toGen) {
            let pushCell = this.cellAtRot();
            if (!pushCell || pushCell.push(this.rot, 1)) {
                this.sys.addCell(toGen.constructor, ...pos, toGen.rot);
            }
        }
    }
}