import { Entity } from "../engine/Entity";
import { Sprite } from "pixi.js";

export class Enemy extends Entity {
  constructor(x, y, texture) {
    super(x, y, new Sprite(texture));

    this.sprite.anchor.set(0.5, 1);

    // ================= AI STATE =================
    this.patternTimer = 0;
    this.fireCooldown = 2;

    this.isFiring = false;
    this.fireTimer = 0;

    // optional patrol (matches your old demo vibe)
    this.vx = 0;
    this.speed = 60;
    this.direction = 1;

    this.collider = {
      x: this.x,
      y: this.y,
      w: 32,
      h: 48,
    };
  }

  update(dt, game) {
    // ================= PATROL MOVEMENT =================
    this.x += this.direction * this.speed * dt;

    const app = game.app;
    const half = this.sprite.width / 2;

    if (this.x > app.screen.width - half) {
      this.x = app.screen.width - half;
      this.direction = -1;
      this.sprite.scale.x = -1;
    }

    if (this.x < half) {
      this.x = half;
      this.direction = 1;
      this.sprite.scale.x = 1;
    }

    // ================= FIRE TIMER =================
    this.patternTimer += dt;

    if (this.patternTimer >= this.fireCooldown) {
      this.patternTimer = 0;
      this.fire(game);
    }

    // ================= FIRE STATE RESET =================
    if (this.isFiring) {
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.isFiring = false;
      }
    }

    super.update(dt, game);
  }

  fire(game) {
    this.isFiring = true;
    this.fireTimer = 0.2;

    game.audio?.playSFX?.("hit");
  }
}
