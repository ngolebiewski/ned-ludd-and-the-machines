import { Application, Assets, Sprite, TilingSprite } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ background: "#222", resizeTo: window });

  document.getElementById("pixi-container").appendChild(app.canvas);

  // -----------------------------
  // LOAD ASSETS
  // -----------------------------
  const soldierTex = await Assets.load("/assets/soldier.png");
  const sheet = await Assets.load("/assets/factory_spritesheet.json");

  // -----------------------------
  // SET CONSTANTS
  // -----------------------------
  const tileSize = 64;

  // -----------------------------
  // GET BRICK TILE
  // -----------------------------
  const brickTex =
    sheet.textures[
      Object.keys(sheet.textures)[12] // tile #12
    ];

  // -----------------------------
  // DRAW GROUND
  // -----------------------------
  const bricks = new TilingSprite({
    texture: brickTex,
    width: app.screen.width,
    height: tileSize,
  });

  app.stage.addChild(bricks);

  // -----------------------------
  // CREATE ENEMY (soldier) -- just for quick demo, switch to OOP Soon
  // -----------------------------
  const soldier = new Sprite(soldierTex);

  // bottom-center anchor (feet-based positioning)
  soldier.anchor.set(0.5, 0.95);

  // normal scale
  soldier.scale.set(1);

  // start roughly centered
  soldier.x = app.screen.width / 2;

  app.stage.addChild(soldier);

  // -----------------------------
  // ENEMY MOVEMENT (patrol)
  // -----------------------------
  let direction = 1; // 1 = right, -1 = left
  const speed = 120; // pixels per second

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS / 1000;

    // move horizontally
    soldier.x += direction * speed * dt;

    const halfWidth = soldier.width / 2;

    // hit right edge
    if (soldier.x > app.screen.width - halfWidth) {
      soldier.x = app.screen.width - halfWidth;
      direction = -1;
      soldier.scale.x = -1; // face left
    }

    // hit left edge
    if (soldier.x < halfWidth) {
      soldier.x = halfWidth;
      direction = 1;
      soldier.scale.x = 1; // face right
    }
  });

  // -----------------------------
  // LAYOUT (handles resize + grounding)
  // -----------------------------
  function layout() {
    // position ground
    bricks.y = app.screen.height - tileSize;
    bricks.width = app.screen.width;

    // place soldier ON the ground (feet touching)
    soldier.y = bricks.y;
  }

  layout();
  app.renderer.on("resize", layout);
})();
