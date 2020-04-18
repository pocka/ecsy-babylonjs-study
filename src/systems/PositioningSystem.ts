import * as bb from "babylonjs"
import { Entity, System } from "ecsy"

import { LightSSC } from "../components/LightSSC"
import { Position } from "../components/Position"
import { RenderableSSC } from "../components/RenderableSSC"

const positionEntity = (entity: Entity) => {
  const position = entity.getComponent(Position).value

  const renderable = entity.getComponent(RenderableSSC)

  if (renderable && renderable.mesh) {
    renderable.mesh.position = position
  }

  const light = entity.getComponent(LightSSC)

  if (light && light.lightRef) {
    light.lightRef.position = position
  }
}

export class PositioningSystem extends System {
  execute() {
    this.queries.items.results.forEach(positionEntity)
    this.queries.items.added?.forEach(positionEntity)
  }

  static queries = {
    items: {
      components: [Position],
      listen: {
        added: true,
        changed: true,
      },
    },
  }
}
