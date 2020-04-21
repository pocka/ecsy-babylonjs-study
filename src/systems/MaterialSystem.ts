import * as bb from "babylonjs"
import { Not, System } from "ecsy"

import { RenderableSSC } from "../components/RenderableSSC"
import { StandardMaterial } from "../components/StandardMaterial"
import { StandardMaterialSSC } from "../components/StandardMaterialSSC"

export class MaterialSystem extends System {
  execute() {
    this.queries.addedStandard.results.forEach((entity) => {
      const {
        diffuseColor,
        specularColor,
        ambientColor,
        emissiveColor,
        scene,
      } = entity.getComponent(StandardMaterial)

      if (!scene) {
        if (process.env.NODE_ENV === "development") {
          console.error("Tried to create material outside a scene.")
        }

        return
      }

      const material = new bb.StandardMaterial(entity.id.toString(), scene)

      material.diffuseColor = diffuseColor
      material.specularColor = specularColor
      material.ambientColor = ambientColor
      material.emissiveColor = emissiveColor

      const { mesh } = entity.getComponent(RenderableSSC)

      mesh!.material = material

      entity.addComponent(StandardMaterialSSC, {
        material,
      } as StandardMaterialSSC)
    })

    this.queries.removed.results.forEach((entity) => {
      const { material } = entity.getComponent(StandardMaterialSSC)

      material?.dispose()

      entity.removeComponent(StandardMaterialSSC)
    })
  }

  static queries = {
    addedStandard: {
      components: [RenderableSSC, StandardMaterial, Not(StandardMaterialSSC)],
    },
    removed: {
      components: [Not(StandardMaterial), StandardMaterialSSC],
    },
  }
}
