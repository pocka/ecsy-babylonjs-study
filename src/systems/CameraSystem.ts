import * as bb from "babylonjs"
import { Not, System } from "ecsy"

import { Camera } from "../components/Camera"
import { CameraSSC } from "../components/CameraSSC"
import { Position } from "../components/Position"

export class CameraSystem extends System {
  execute() {
    this.queries.added.results.forEach((entity) => {
      const { scene, target } = entity.getComponent(Camera)

      if (!scene) {
        return
      }

      const position =
        entity.getComponent(Position)?.value ?? new bb.Vector3(0, 0, 0)

      const ref = new bb.TargetCamera(entity.id.toString(), position, scene)

      ref.fov = (Math.PI * 40) / 180
      ref.setTarget(target)

      entity.addComponent(CameraSSC, { ref })
    })

    this.queries.removed.results.forEach((entity) => {
      const { ref } = entity.getComponent(CameraSSC)

      ref?.dispose()

      entity.removeComponent(CameraSSC)
    })
  }

  static queries = {
    added: {
      components: [Camera, Not(CameraSSC)],
    },
    removed: {
      components: [Not(Camera), CameraSSC],
    },
  }
}
