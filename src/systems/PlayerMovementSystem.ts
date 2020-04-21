import { System } from "ecsy"

import { Player } from "../components/Player"
import { Position } from "../components/Position"
// TODO: Create mesh component and obtain size from it
import { Sphere } from "../components/Sphere"
import { Stage } from "../components/Stage"

export class PlayerMovementSystem extends System {
  #keyState: {
    [key: string]: boolean
  } = {}

  init() {
    window.addEventListener("keydown", (ev) => {
      this.#keyState[ev.key] = true
    })

    window.addEventListener("keyup", (ev) => {
      this.#keyState[ev.key] = false
    })
  }

  execute() {
    this.queries.player.results.forEach((entity) => {
      const position = entity.getComponent(Position)

      const speed = 0.1

      if (this.#keyState.w) {
        position.value.y += speed
      }
      if (this.#keyState.a) {
        position.value.x += speed
      }
      if (this.#keyState.s) {
        position.value.y -= speed
      }
      if (this.#keyState.d) {
        position.value.x -= speed
      }

      const sphere = entity.getComponent(Sphere)

      if (!sphere) {
        return
      }

      const stageEntity = this.queries.stage.results[0]

      if (!stageEntity) {
        return
      }

      const stage = stageEntity.getComponent(Stage)

      const size = sphere.radius * 2

      const minX = -stage.width / 2
      const maxX = stage.width / 2 - size / 2
      const minY = -stage.height / 2
      const maxY = stage.height / 2 - size / 2

      if (position.value.y < minY) {
        position.value.y = minY
      }

      if (position.value.y > maxY) {
        position.value.y = maxY
      }

      if (position.value.x < minX) {
        position.value.x = minX
      }

      if (position.value.x > maxX) {
        position.value.x = maxX
      }
    })
  }

  static queries = {
    player: {
      components: [Player, Position],
    },
    stage: {
      components: [Stage],
    },
  }
}
