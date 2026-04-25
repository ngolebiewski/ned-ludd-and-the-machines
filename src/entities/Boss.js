export class Boss extends Entity {
    constructor(x, y) {
        super(x, y, Sprite.from("boss.png"));

        this.hp = 1000;
        this.phase = 1;
    }

    update(dt, game) {
        if (this.hp < 500) {
            this.phase = 2;
            game.audio.enterBossMode();
        }

        this.ai(dt, game);

        super.update(dt, game);
    }

    ai(dt, game) {
        // simple pattern system
        this.x += Math.sin(Date.now() * 0.001) * 2;
    }
}