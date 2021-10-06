class Arrow extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "arrow");
    }
    push(rot = 0, force = 1) {
        if ((rot & 3) !== (this.rot & 3)) return false;

        return super.push(rot, force);
    }
}