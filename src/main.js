import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#111111", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/soldier.png");

  // Create a bunny Sprite
  const soldier = new Sprite(texture);

  // Center the sprite's anchor point
  soldier.anchor.set(.5);
  soldier.scale.set(3);

  // Move the sprite to the center of the screen
  soldier.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(soldier);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    soldier.rotation += 0.02 * time.deltaTime;
  });
})();
