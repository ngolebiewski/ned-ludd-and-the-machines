import { Scene } from "../engine/Scene";
import { Enemy } from "../entities/Enemy";

export class LevelScene extends Scene {
    enter() {
        console.log("LEVEL ENTER");

        this.time = 0;

        this.generateLevel();
        this.spawnEnemies();

        this.setupPlayer();
    }

    // ================= PLAYER SETUP =================
    setupPlayer() {
        const player = this.player;

        // only reset POSITION, not full state
        player.x = 100;
        player.y = 300;

        player.vx = 0;
        player.vy = 0;

        player.isJumping = false;
    }

    // ================= LEVEL DATA =================
    generateLevel() {
        this.levelLength = 2000;
        this.platforms = [];
    }

    // ================= ENEMIES =================
    spawnEnemies() {
        this.enemies = [];

        for (let i = 0; i < 5; i++) {
            const enemy = new Enemy(
                300 + i * 160,
                300
            );

            this.addEntity(enemy);
            this.enemies.push(enemy);
        }
    }

    // ================= UPDATE =================
    update(dt) {
        this.time += dt;

        this.updateLevelLogic(dt);
        this.checkTriggers();
    }

    updateLevelLogic(dt) {
        // placeholder for:
        // conveyors, crushers, hazards, etc.
    }

    checkTriggers() {
        const player = this.player;

        // fail condition (temporary)
        if (player.y > 1200) {
            console.warn("PLAYER FELL");
            this.game.resetGame();
            this.game.sceneManager.change(this.constructor); 
            // restarts same level cleanly
        }
    }

    // ================= CLEANUP =================
    exit() {
        this.removeAllEntities();

        this.enemies = [];
        this.platforms = [];
    }
}