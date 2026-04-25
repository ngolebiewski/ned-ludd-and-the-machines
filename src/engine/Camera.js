export class Camera {
    constructor(app) {
        this.app = app;

        this.x = 0;
        this.y = 0;

        this.target = null;
    }

    follow(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        this.x = this.target.x - this.app.screen.width / 2;
        this.y = this.target.y - this.app.screen.height / 2;

        this.app.stage.x = -this.x;
        this.app.stage.y = -this.y;
    }
}