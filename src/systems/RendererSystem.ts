import * as bb from "babylonjs"
import { Not, System } from "ecsy"

import { Sphere } from "../components/Sphere"
import { Renderable } from "../components/Renderable"
import { RenderableSSC } from "../components/RenderableSSC"

export class RendererSystem extends System {
  execute() {
    this.queries.addedSpheres.results.forEach((entity) => {
      const { position, radius } = entity.getComponent(Sphere)
      const { scene } = entity.getComponent(Renderable)

      const mesh = bb.MeshBuilder.CreateSphere(
        entity.id.toString(),
        {
          diameter: radius * 2,
          updatable: false,
        },
        scene
      )

      mesh.position = position

      entity.addComponent(RenderableSSC, { mesh })
    })

    this.queries.removed.results.forEach((entity) => {
      const { mesh } = entity.getComponent(RenderableSSC)

      mesh?.dispose()

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
