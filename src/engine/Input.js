export class Input {
    constructor() {
        this.keys = {};
        this._pressed = {};
        this._released = {};

        // ================= ACTION MAP =================
        this.actions = {
            jump: ["ArrowUp", "KeyW"],
            attack: ["Space"],
            left: ["ArrowLeft", "KeyA"],
            right: ["ArrowRight", "KeyD"],
            duck: ["ArrowDown", "KeyS"],
        };

        // movement axis (smoothed per frame)
        this.move = { x: 0 };

        // ================= EVENTS =================
        this._onKeyDown = (e) => {
            if (!this.keys[e.code]) {
                this._pressed[e.code] = true;
            }
            this.keys[e.code] = true;
        };

        this._onKeyUp = (e) => {
            this.keys[e.code] = false;
            this._released[e.code] = true;
        };

        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }

    // ================= ACTION API =================

    isPressed(action) {
        const keys = this.actions[action];
        return keys?.some(k => this._pressed[k]) || false;
    }

    isDown(action) {
        const keys = this.actions[action];
        return keys?.some(k => this.keys[k]) || false;
    }

    isReleased(action) {
        const keys = this.actions[action];
        return keys?.some(k => this._released[k]) || false;
    }

    // ================= FRAME UPDATE =================
    update() {
        // reset edge states every frame
        this._pressed = {};
        this._released = {};

        // ================= AXIS =================
        let x = 0;

        if (this.keys["ArrowRight"] || this.keys["KeyD"]) x += 1;
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) x -= 1;

        // normalize for safety (future gamepad support)
        this.move.x = Math.max(-1, Math.min(1, x));
    }

    // ================= CLEANUP =================
    destroy() {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }
}