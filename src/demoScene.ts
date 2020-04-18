import * as bb from "babylonjs"
import { World } from "ecsy"

import { SceneCreator } from "./scenes"

import { Light } from "./components/Light"
import { Renderable } from "./components/Renderable"
import { ShadowCaster } from "./components/ShadowCaster"
import { Sphere } from "./components/Sphere"

import { LightingSystem } from "./systems/LightingSystem"
import { RendererSystem } from "./systems/RendererSystem"
import { ShadowCastingSystem } from "./systems/ShadowCastingSystem"

import { wait } from "./helpers/time"

interface DemoSceneProps {
  onExit?(): void
}

const GROUND_SIZE = 10

const rand = (min: number, max: number) => Math.random() * (max - min) + min

export const demoScene: SceneCreator<DemoSceneProps> = async (
  engine,
  { onExit }
) => {
  const world = new World()

  world
    .registerSystem(LightingSystem)
    .registerSystem(ShadowCastingSystem)
    .registerSystem(RendererSystem)

  const scene = new bb.Scene(engine)

  const sphere = world
    .createEntity()
    .addComponent(Sphere, { radius: 1, position: new bb.Vector3(0, 1, 0) })
    .addComponent(Renderable, { scene })
    .addComponent(ShadowCaster)

  const balls = Array.from({ length: 100 }).map(() => {
    return world
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
    balls.forEach((ball) => ball.remove())

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

  // Dummy loading
  await wait(3000)

  let lastTime = performance.now()

  const renderLoop = () => {
    const time = performance.now() / 1000
    const delta = time - lastTime

    scene.render()
    world.execute(delta, time)

    lastTime = time
  }

  engine.runRenderLoop(renderLoop)

  return () => {
    // Run disposing processes
    renderLoop()

    world.stop()
    world.enabled = false

    engine.stopRenderLoop(renderLoop)

    scene.dispose()
  }
}
