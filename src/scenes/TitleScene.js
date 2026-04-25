import { Text } from "pixi.js";
import { Scene } from "../engine/Scene";
import { LevelScene } from "./LevelScene";

export class TitleScene extends Scene {
  enter() {
    this.title = new Text({
      text: "Ned Ludd and the Machines:\nA World Turned Upside Down\n\n(click to play)",
      style: {
        fill: "#ffffff",
        fontSize: 26,
        align: "center",
      },
    });

    this.title.anchor.set(0.5);
    this.title.x = this.game.app.screen.width / 2;
    this.title.y = this.game.app.screen.height / 2;

    this.game.app.stage.addChild(this.title);

    this.onStart = () => {
      this.game.sceneManager.change(LevelScene);
    };

    this.game.app.stage.eventMode = "static";
    this.game.app.stage.once("pointerdown", this.onStart);
  }

  update() {}

  exit() {
    this.game.app.stage.removeChild(this.title);
    this.game.app.stage.off("pointerdown", this.onStart);
  }
}
