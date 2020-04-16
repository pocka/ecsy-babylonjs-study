import * as babylon from "babylonjs";
import { World } from "ecsy";

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

const scene = new babylon.Scene(engine);

const camera = new babylon.FreeCamera(
  "camera",
  new babylon.Vector3(0, 5, -20),
  scene
);

camera.setTarget(babylon.Vector3.Zero());
camera.attachControl(canvas, false);

const light = new babylon.HemisphericLight(
  "light",
  new babylon.Vector3(0, 1, 0),
  scene
);

const sphere = babylon.SphereBuilder.CreateSphere(
  "sphere",
  {
    diameter: 2,
  },
  scene
);

window.addEventListener("resize", () => engine.resize());

let lastTime = performance.now();

engine.runRenderLoop(() => {
  const time = performance.now() / 1000;
  const delta = time - lastTime;

  scene.render();
  world.execute(delta, time);

  lastTime = time;
});
