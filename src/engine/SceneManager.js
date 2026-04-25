export class SceneManager {
    constructor(game) {
        this.game = game;
        this.current = null;
    }

    change(SceneClass) {
        // ---------------- EXIT OLD SCENE ----------------
        if (this.current) {
            this.current.exit?.();
        }

        // clear scene entities (if you use shared list)
        this.game.clearSceneEntities?.();

        // ---------------- ENTER NEW SCENE ----------------
        this.current = new SceneClass(this.game);
        this.current.enter?.();
    }

    update(dt) {
        this.current?.update?.(dt);
    }
}