export class Scene {
    constructor(game) {
        this.game = game;
        this.entities = [];
        this.started = false;

        // optional: scene-local timers
        this.time = 0;
    }

    // ================= LIFECYCLE =================

    enter() {
        // override: build level
    }

    update(dt) {
        // override: scene logic
        this.time += dt;
    }

    exit() {
        // override: cleanup hooks
        this.removeAllEntities();
    }

    // ================= ENTITY MANAGEMENT =================

    addEntity(entity) {
        this.entities.push(entity);
        this.game.addEntity(entity);
    }

    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
        this.game.removeEntity(entity);
    }

    removeAllEntities() {
        for (const e of this.entities) {
            this.game.removeEntity(e);
        }
        this.entities = [];
    }

    // ================= HELPERS =================

    get player() {
        return this.game.player;
    }

    get input() {
        return this.game.input;
    }

    get audio() {
        return this.game.audio;
    }
}