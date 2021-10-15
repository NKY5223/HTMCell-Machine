export default class Cell {
    /** @param {CellMachine} sys */
    constructor(x = 0, y = 0, rot = 0, sys) {
        this.x = x;
        this.y = y;
        this.elRot = this.rot = rot & 3;
        this.sys = sys;

        
        this.element = document.createElement("div");
        this.updateEl();
        this.element.classList.add("cell");
        this.element.classList.add(this.type = this.constructor.type);
    }
    static type = "unknown";
    update() {

    }   
    push(rot = 0, force = 1) {
        if (force < 1) return false;

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

        let push = cell.push(rot, force);
        if (push === null) {
            this.remove();
            return true;
        }
        if (push) this.move(rot);

        return push;
    }
    cellAtRot(rot = 0) {
        rot &= 3;
        return this.sys.cellAt(this.x + (rot === 0) - (rot === 2), this.y + (rot === 3) - (rot === 1));
    }
    move(rot = this.rot) {
        switch (rot & 3) {
            case 1:
                if (this.y > 0) this.y--;
                break;
            case 2:
                if (this.x > 0) this.x--;
                break;
            case 3:
                if (this.y < this.sys.h - 1) this.y++;
                break;
            default:
                if (this.x < this.sys.w - 1) this.x++;
                break;
        }
    }
    rotate(rot = 0) {
        this.rot = (this.rot + rot) & 3;
        this.elRot += rot;
    }
    remove() {
        if (!this.sys.cells.includes(this)) return;
        this.sys.cells.splice(this.sys.cells.indexOf(this), 1);
        this.element.remove();
    }
    updateEl() {
        this.element.style.transform = `translate(${100 * this.x + 50}%, ${100 * this.y + 50}%) rotate(${-90 * this.elRot}deg)`;
    }
}