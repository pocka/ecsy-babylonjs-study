import * as babylon from "babylonjs";
import { World } from "ecsy";

import { demoScene } from "./demoScene";

const world = new World();

console.log("Hello, ", world);

const canvas = document.createElement("canvas");

canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.touchAction = "none";

document.body.appendChild(canvas);

const engine = new babylon.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

let currentScene: babylon.Scene | null = null;

const renderDemoScene = () => {
  currentScene?.dispose();
  currentScene = null;

  engine.displayLoadingUI();

  demoScene(engine, world, {
    onExit() {
      renderDemoScene();
    },
  }).then((scene) => {
    currentScene = scene;
    engine.hideLoadingUI();
  });
};

window.addEventListener("resize", () => engine.resize());

renderDemoScene();

let lastTime = performance.now();

engine.runRenderLoop(() => {
  const time = performance.now() / 1000;
  const delta = time - lastTime;

  currentScene?.render();
  world.execute(delta, time);

  lastTime = time;
});
