import * as bb from "babylonjs";

import { SceneCreator } from "./scenes";

interface DemoSceneProps {
  onExit?(): void;
}

export const demoScene: SceneCreator<DemoSceneProps> = async (
  engine,
  world,
  { onExit }
) => {
  // Dummy loading
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 3000);
  });

  const scene = new bb.Scene(engine);

  scene.onKeyboardObservable.add(({ event, type }) => {
    if (type !== bb.KeyboardEventTypes.KEYUP || event.key !== "Enter") {
      return;
    }

    onExit?.();
  });

  const camera = new bb.ArcRotateCamera(
    "camera",
    1,
    1,
    20,
    new bb.Vector3(0, 0, 0),
    scene
  );

  camera.attachControl(engine.getRenderingCanvas()!, false);

  const light = new bb.DirectionalLight(
    "light",
    new bb.Vector3(0, -1, 0),
    scene
  );

  light.position = new bb.Vector3(3, 4, 0);
  light.intensity = 0.8;

  const sphere = bb.SphereBuilder.CreateSphere(
    "sphere",
    {
      diameter: 2,
      updatable: false,
    },
    scene
  );

  sphere.position.y = 1;

  const ground = bb.MeshBuilder.CreateGround(
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

  const red = new bb.StandardMaterial("red", scene);

  red.diffuseColor = new bb.Color3(0.8, 0, 0);

  ground.material = red;

  const shadowGenerator = new bb.ShadowGenerator(512, light);

  shadowGenerator.addShadowCaster(sphere);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurBoxOffset = 2.0;
  shadowGenerator.darkness = 0.5;

  return scene;
};
