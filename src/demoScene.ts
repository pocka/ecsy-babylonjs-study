import * as bb from "babylonjs"
import { World } from "ecsy"

import { SceneCreator } from "./scenes"

import { Camera } from "./components/Camera"
import { Light } from "./components/Light"
import { StandardMaterial } from "./components/StandardMaterial"
import { Player } from "./components/Player"
import { Position } from "./components/Position"
import { Renderable } from "./components/Renderable"
import { ShadowCaster } from "./components/ShadowCaster"
import { Stage } from "./components/Stage"
import { Sprite } from "./components/Sprite"

import { CameraSystem } from "./systems/CameraSystem"
import { LightingSystem } from "./systems/LightingSystem"
import { MaterialSystem } from "./systems/MaterialSystem"
import { PlayerMovementSystem } from "./systems/PlayerMovementSystem"
import { PositioningSystem } from "./systems/PositioningSystem"
import { RendererSystem } from "./systems/RendererSystem"
import { ShadowCastingSystem } from "./systems/ShadowCastingSystem"

import { wait } from "./helpers/time"

interface DemoSceneProps {
  onExit?(): void
}

const GROUND_SIZE = 20

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
    .registerSystem(MaterialSystem)
    .registerSystem(PositioningSystem)
    .registerSystem(CameraSystem)

  const scene = new bb.Scene(engine)

  const player = world
    .createEntity()
    .addComponent(Renderable, { scene })
    .addComponent(Position, { value: new bb.Vector3(0, 0, 1) } as Position)
    .addComponent(ShadowCaster)
    .addComponent(Player)
    .addComponent(StandardMaterial, {
      diffuseColor: new bb.Color3(0, 0.5, 0),
      specularColor: new bb.Color3(0, 1, 0),
      scene,
    } as StandardMaterial)
    .addComponent(Sprite, {
      width: 1,
      height: 1,
    })

  const enemys = Array.from({ length: 100 }).map(() => {
    const size = rand(0.5, 1)

    return world
      .createEntity()
      .addComponent(Sprite, {
        width: size,
        height: size,
      } as Sprite)
      .addComponent(Renderable, { scene } as Renderable)
      .addComponent(ShadowCaster)
      .addComponent(Position, {
        value: new bb.Vector3(
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2),
          rand(-GROUND_SIZE / 2, GROUND_SIZE / 2),
          rand(0.1, 0.3)
        ),
      } as Position)
      .addComponent(StandardMaterial, {
        diffuseColor: new bb.Color3(0.5, 0.5, 0.5),
        specularColor: new bb.Color3(1, 1, 1),
        scene,
      } as StandardMaterial)
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
      value: new bb.Vector3(0, 0, 30),
    } as Position)

  const stage = world
    .createEntity()
    .addComponent(Stage, {
      width: GROUND_SIZE,
      height: GROUND_SIZE,
    } as Stage)
    .addComponent(Renderable, { scene } as Renderable)
    .addComponent(Position, {
      value: new bb.Vector3(0, 0, -1),
    } as Position)
    .addComponent(StandardMaterial, {
      diffuseColor: new bb.Color3(0.2, 0, 0),
      specularColor: new bb.Color3(1, 0, 0),
      scene,
    } as StandardMaterial)

  scene.onKeyboardObservable.add(({ event, type }) => {
    if (type !== bb.KeyboardEventTypes.KEYUP || event.key !== "Enter") {
      return
    }

    light.remove()
    player.remove()
    enemys.forEach((ball) => ball.remove())
    camera.remove()
    stage.remove()

    scene.dispose()

    onExit?.()
  })

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
