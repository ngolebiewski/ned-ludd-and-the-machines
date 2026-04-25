import { Application, Assets } from "pixi.js";
import { Game } from "./engine/Game";
import { AudioManager } from "./AudioManager";
import { TitleScene } from "./scenes/TitleScene";

(async () => {
  // ================= PIXI APP =================
  const app = new Application();

  await app.init({
    resizeTo: window,
    background: "#222",
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.canvas);
  // ================= FULLSCREEN GAME MODE =================
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  app.canvas.style.display = "block";
  app.canvas.style.position = "fixed";
  app.canvas.style.top = "0";
  app.canvas.style.left = "0";
  // ================= AUDIO =================
  const audio = new AudioManager();

  let audioUnlocked = false;

  const unlockAudio = async () => {
    if (audioUnlocked) return;

    audioUnlocked = true;

    if (audio.audioCtx.state === "suspended") {
      await audio.audioCtx.resume();
    }

    audio.start();

    // optional: remove listener after first use
    app.stage.off("pointerdown", unlockAudio);
  };

  app.stage.eventMode = "static";
  app.stage.on("pointerdown", unlockAudio); 

  // ================= ASSETS =================
  const assets = {
    soldier: await Assets.load("/assets/soldier.png"),
    sheet: await Assets.load("/assets/factory_spritesheet.json"),
  };

  // ================= GAME =================
  const game = new Game(app, audio, assets);

  // start scene
  game.sceneManager.change(TitleScene);

  // ================= MAIN LOOP =================
  app.ticker.add((t) => {
    const dt = t.deltaMS / 1000;

    game.update(dt);
    game.camera?.update?.(dt); // future camera system hook
  });

  // ================= DEBUG KEYS =================
  window.addEventListener("keydown", (e) => {
    if (e.key === "b") audio.enterBossMode();
    if (e.key === "n") audio.exitBossMode();
   });
})();
