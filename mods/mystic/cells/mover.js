import Cell from "../../../cell.js";
export default class Mover extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
    }
    static type = "mover";
    static texture = "./mods/mystic/tex/mover.png";
    update() {
        let cell = this.cellAtRot(this.rot & 3);
        
        if (cell) {
            let push = cell.push(this.rot & 3, 1);
            if (push === null) this.remove();
            else if (!push) return;
        }

        this.move();
    }
    push(rot = 0, force = 1) {
        if (((rot + 2) & 3) === this.rot && force < 2) return false;

        rot &= 3;
        switch (rot) {
            case 0:
                if (this.x + 1 >= this.sys.w) return false;
                break;
            case 1:
                if (this.y - 1 < 0) return false;
                break;
            case 2:
                if (this.x - 1 < 0) return false;
                break;
            case 3:
                if (this.y + 1 >= this.sys.h) return false;
                break;
        }


        let cell = this.cellAtRot(rot);
        if (!cell) {
            this.move(rot);
            return true;
        }

        let push = cell.push(rot, force + (rot === this.rot) - (((rot + 2) & 3) === this.rot));
        
        if (push === null) {
            this.remove();
            return true;
        }
        if (push) this.move(rot);
        
        return push;

    }
}