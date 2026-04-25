import { Sprite } from "pixi.js";
import { Entity } from "../engine/Entity";

export class Player extends Entity {
  constructor(x, y, texture) {
    super(x, y, new Sprite(texture));

    // ================= PHYSICS =================
    this.vx = 0;
    this.vy = 0;

    this.gravity = 0.4;
    this.jumpStrength = -8;

    // attack timer (replace setTimeout)
    this.attackTimer = 0;
    this.attackCooldown = 0.15;

    // ================= STATE =================
    this.isJumping = false;
    this.isDucking = false;
    this.isAttacking = false;

    // ================= STATS =================
    this.health = 100;
    this.score = 0;

    // ================= GROUND =================
    this.groundY = 300;

    // ================= COLLIDER =================
    this.collider = {
      x: this.x,
      y: this.y,
      w: 32,
      h: 48,
    };

    this.sprite.anchor.set(0.5, 1);
  }

  update(dt, game) {
    const input = game.input;
    if (!input) return;

    // ================= ATTACK TIMER =================
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }

    // ================= INPUT =================
    const move = input.move?.x || 0;

    this.isDucking = input.isDown("duck");

    const speed = this.isDucking ? 120 : 220;
    this.vx = move * speed;

    // ================= JUMP =================
    if (input.isPressed("jump") && !this.isJumping && !this.isDucking) {
      this.vy = this.jumpStrength;
      this.isJumping = true;
    }

    // ================= ATTACK =================
    if (input.isPressed("attack")) {
      this.attack(game);
    }

    // ================= PHYSICS =================
    this.vy += this.gravity * dt * 60;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // ================= GROUND =================
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.vy = 0;
      this.isJumping = false;
    }

    // ================= COLLIDER =================
    this.collider.x = this.x;
    this.collider.y = this.y;
    this.collider.h = this.isDucking ? 28 : 48;

    // ================= SYNC SPRITE =================
    super.update(dt, game);
  }

  attack(game) {
    if (this.isAttacking) return;

    this.isAttacking = true;
    this.attackTimer = this.attackCooldown;

    game.audio?.playSFX?.("hit");
  }
} 
