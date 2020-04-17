import * as bb from "babylonjs"

import { SceneCreator } from "./scenes"

import { Light } from "./components/Light"
import { Renderable } from "./components/Renderable"
import { ShadowCaster } from "./components/ShadowCaster"
import { Sphere } from "./components/Sphere"

interface DemoSceneProps {
  onExit?(): void
}

const GROUND_SIZE = 10

const rand = (min: number, max: number) => Math.random() * (max - min) + min

export const demoScene: SceneCreator<DemoSceneProps> = async (
  engine,
  world,
  { onExit }
) => {
  // Dummy loading
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 3000)
  })

  const scene = new bb.Scene(engine)

  const sphere = world
    .createEntity()
    .addComponent(Sphere, { radius: 1, position: new bb.Vector3(0, 1, 0) })
    .addComponent(Renderable, { scene })
    .addComponent(ShadowCaster)

  Array.from({ length: 100 }).forEach(() => {
    world
      .createEntity()
      .addComponent(Sphere, {
        radius: rand(0.1, 0.5),
        position: new bb.Vector3(
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2),
          rand(1, 8),
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2)
        ),
      })
      .addComponent(Renderable, { scene })
      .addComponent(ShadowCaster)
  })

  const light = world.createEntity().addComponent(Light, {
    scene,
    lookingAt: new bb.Vector3(0, -1, 0),
    position: new bb.Vector3(3, 10, 0),
    intensity: 0.8,
  })

  scene.onKeyboardObservable.add(({ event, type }) => {
    if (type !== bb.KeyboardEventTypes.KEYUP || event.key !== "Enter") {
      return
    }

    light.remove()
    sphere.remove()

    scene.dispose()

    onExit?.()
  })

  const camera = new bb.ArcRotateCamera(
    "camera",
    1,
    1,
    20,
    new bb.Vector3(0, 0, 0),
    scene
  )

  camera.attachControl(engine.getRenderingCanvas()!, false)

  const ground = bb.MeshBuilder.CreateGround(
    "ground",
    {
      height: GROUND_SIZE,
      width: GROUND_SIZE,
      subdivisions: 2,
    },
    scene
  )
  ground.position.y = -0.5
  ground.receiveShadows = true

  const red = new bb.StandardMaterial("red", scene)

  red.diffuseColor = new bb.Color3(0.8, 0, 0)

  ground.material = red

  return scene
}
