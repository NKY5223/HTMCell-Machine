class Slide extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "slide");
    }
    push(rot = 0, force = 1) {
        if ((rot & 1) !== (this.rot & 1)) return false;

        return super.push(rot, force);
    }
}