class Slide extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "slide");
    }
    push(rot = 0, force = 1) {
        if (rot % 2 !== this.rot % 2) return false;

        return super.push(rot, force);
    }
}