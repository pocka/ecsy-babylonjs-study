import * as bb from "babylonjs"
import { World } from "ecsy"

import { SceneCreator } from "./scenes"

import { Camera } from "./components/Camera"
import { Light } from "./components/Light"
import { Player } from "./components/Player"
import { Position } from "./components/Position"
import { Renderable } from "./components/Renderable"
import { ShadowCaster } from "./components/ShadowCaster"
import { Sphere } from "./components/Sphere"

import { CameraSystem } from "./systems/CameraSystem"
import { LightingSystem } from "./systems/LightingSystem"
import { PlayerMovementSystem } from "./systems/PlayerMovementSystem"
import { PositioningSystem } from "./systems/PositioningSystem"
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
    .registerSystem(PlayerMovementSystem)
    .registerSystem(RendererSystem)
    .registerSystem(PositioningSystem)
    .registerSystem(CameraSystem)

  const scene = new bb.Scene(engine)

  const sphere = world
    .createEntity()
    .addComponent(Sphere, { radius: 0.1 } as Sphere)
    .addComponent(Renderable, { scene })
    .addComponent(Position, { value: new bb.Vector3(0, 0, 0.5) } as Position)
    .addComponent(ShadowCaster)
    .addComponent(Player)

  const balls = Array.from({ length: 100 }).map(() => {
    return world
      .createEntity()
      .addComponent(Sphere, {
        radius: rand(0.1, 0.3),
      } as Sphere)
      .addComponent(Renderable, { scene } as Renderable)
      .addComponent(ShadowCaster)
      .addComponent(Position, {
        value: new bb.Vector3(
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2),
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2),
          0
        ),
      } as Position)
  })

  const light = world
    .createEntity()
    .addComponent(Light, {
      scene,
      lookingAt: new bb.Vector3(0, 0, -10),
      intensity: 0.8,
    } as Light)
    .addComponent(Position, {
      value: new bb.Vector3(0, 0, 20),
    } as Position)

  const camera = world
    .createEntity()
    .addComponent(Camera, {
      scene,
    } as Camera)
    .addComponent(Position, {
      value: new bb.Vector3(0, 0, 10),
    } as Position)

  scene.onKeyboardObservable.add(({ event, type }) => {
    if (type !== bb.KeyboardEventTypes.KEYUP || event.key !== "Enter") {
      return
    }

    light.remove()
    sphere.remove()
    balls.forEach((ball) => ball.remove())
    camera.remove()

    scene.dispose()

    onExit?.()
  })

  const ground = bb.MeshBuilder.CreateGround(
    "ground",
    {
      height: GROUND_SIZE,
      width: GROUND_SIZE,
      subdivisions: 2,
    },
    scene
  )

  ground.rotate(new bb.Vector3(1, 0, 0), (Math.PI * 90) / 180)
  ground.position.z = -0.5
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

    if (scene.activeCamera) {
      scene.render()
    }

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
