import * as babylon from "babylonjs"

import { demoScene } from "./demoScene"
import { SceneDisposer } from "./scenes"

import { wait } from "./helpers/time"

const canvas = document.createElement("canvas")

canvas.style.position = "absolute"
canvas.style.top = "0"
canvas.style.left = "0"
canvas.style.width = "100%"
canvas.style.height = "100%"
canvas.style.touchAction = "none"

document.body.appendChild(canvas)

const engine = new babylon.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
})

let sceneDisposer: SceneDisposer | null = null

const renderDemoScene = () => {
  sceneDisposer?.()
  sceneDisposer = null

  engine.displayLoadingUI()

  demoScene(engine, {
    onExit() {
      renderDemoScene()
    },
  })
    .then((disposer) => {
      sceneDisposer = disposer

      return wait(300)
    })
    .then(() => {
      engine.hideLoadingUI()
    })
}

window.addEventListener("resize", () => engine.resize())

renderDemoScene()
