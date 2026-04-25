import { SceneManager } from "./SceneManager";
import { Input } from "./Input";
import { Player } from "../entities/Player";
import { Camera } from "./Camera";

export class Game {
  static instance;

  constructor(app, audio, assets) {
    if (Game.instance) return Game.instance;

    this.app = app;
    this.audio = audio;

    // systems
    this.input = new Input();
    this.sceneManager = new SceneManager(this);

    // assets
    this.assets = assets;

    // state
    this.state = {
      score: 0,
      health: 100,
      gameOver: false,
    };

    // scene-only entities
    this.entities = [];

    // persistent player
    this.player = new Player(100, 300, this.assets.soldier);

    this.app.stage.addChild(this.player.sprite);
    this.camera = new Camera(app);
    this.camera.follow(this.player);
    Game.instance = this;
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.app.stage.addChild(entity.sprite);
  }

  removeEntity(entity) {
    this.entities = this.entities.filter((e) => e !== entity);
    this.app.stage.removeChild(entity.sprite);
  }

  clearSceneEntities() {
    for (const e of this.entities) {
      this.app.stage.removeChild(e.sprite);
    }
    this.entities = [];
  }

  update(dt) {
    this.sceneManager.update(dt);

    this.player.update(dt, this, this.state);

    for (const e of this.entities) {
      e.update(dt, this);
    }
    this.camera.update();
    // IMPORTANT: must happen last
    this.input.update();
  }

  resetGame() {
    this.clearSceneEntities();

    this.player.sprite.x = 100;
    this.player.sprite.y = 300;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.health = 100;

    this.state.score = 0;
    this.state.gameOver = false;

    this.audio?.exitBossMode?.();
  }
}
