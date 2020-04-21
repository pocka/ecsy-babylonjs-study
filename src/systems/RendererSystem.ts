import * as bb from "babylonjs"
import { Not, System } from "ecsy"

import { Renderable } from "../components/Renderable"
import { RenderableSSC } from "../components/RenderableSSC"
import { Sphere } from "../components/Sphere"

export class RendererSystem extends System {
  execute() {
    this.queries.addedSpheres.results.forEach((entity) => {
      const { radius } = entity.getComponent(Sphere)
      const { scene } = entity.getComponent(Renderable)

      const mesh = bb.MeshBuilder.CreateBox(
        entity.id.toString(),
        {
          width: radius * 2,
          height: radius * 2,
          depth: 0.02,
          updatable: false,
        },
        scene
      )

      mesh.setDirection(new bb.Vector3(0, 0, -1))
      mesh.receiveShadows = true

      entity.addComponent(RenderableSSC, { mesh })
    })

    this.queries.removed.results.forEach((entity) => {
      const { mesh } = entity.getComponent(RenderableSSC)

      mesh?.dispose()

      if (process.env.NODE_ENV === "development") {
        console.debug("Disposed mesh resource.")
      }

      entity.removeComponent(RenderableSSC)
    })
  }

  static queries = {
    addedSpheres: {
      components: [Sphere, Renderable, Not(RenderableSSC)],
    },
    removed: {
      components: [Not(Renderable), RenderableSSC],
    },
  }
}
