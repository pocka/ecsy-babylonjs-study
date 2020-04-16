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

const camera = new babylon.ArcRotateCamera(
  "camera",
  1,
  1,
  20,
  new babylon.Vector3(0, 0, 0),
  scene
);

camera.attachControl(canvas, false);

const light = new babylon.DirectionalLight(
  "light",
  new babylon.Vector3(0, -1, 0),
  scene
);

light.position = new babylon.Vector3(3, 4, 0);
light.intensity = 0.8;

const sphere = babylon.SphereBuilder.CreateSphere(
  "sphere",
  {
    diameter: 2,
    updatable: false,
  },
  scene
);

sphere.position.y = 1;

const ground = babylon.MeshBuilder.CreateGround(
  "ground",
  {
    height: 6,
    width: 6,
    subdivisions: 2,
  },
  scene
);
ground.position.y = -0.5;
ground.receiveShadows = true;

const red = new babylon.StandardMaterial("red", scene);

red.diffuseColor = new babylon.Color3(0.8, 0, 0);

ground.material = red;

const shadowGenerator = new babylon.ShadowGenerator(512, light);

shadowGenerator.addShadowCaster(sphere);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurBoxOffset = 2.0;
shadowGenerator.darkness = 0.5;

window.addEventListener("resize", () => engine.resize());

let lastTime = performance.now();

engine.runRenderLoop(() => {
  const time = performance.now() / 1000;
  const delta = time - lastTime;

  scene.render();
  world.execute(delta, time);

  lastTime = time;
});
