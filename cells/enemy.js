class Enemy extends Cell {
    constructor(x = 0, y = 0, rot = 0, sys) {
        super(x, y, rot, sys);
        this.element.classList.add(this.type = "enemy");
    }
    push() {
        this.remove();
        return null;
    }
}