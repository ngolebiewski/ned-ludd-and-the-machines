// base class
export class Entity {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    update(dt, game) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    get hitbox() {
    return {
        x: this.x - this.collider.w / 2,
        y: this.y - this.collider.h,
        w: this.collider.w,
        h: this.collider.h
    };
}
}