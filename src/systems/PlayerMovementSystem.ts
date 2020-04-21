import { System } from "ecsy"

import { Player } from "../components/Player"
import { Position } from "../components/Position"
import { Sprite } from "../components/Sprite"
import { Stage } from "../components/Stage"

export class PlayerMovementSystem extends System {
  #keyState: {
    [key: string]: boolean
  } = {}

  #warnings = {
    noBound: false,
  }

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

      const keys = this.#keyState

      // Movement vectors
      const vecX = (keys.a ? (keys.d ? 0 : 1) : keys.d ? -1 : 0) * speed
      const vecY = (keys.w ? (keys.s ? 0 : 1) : keys.s ? -1 : 0) * speed

      // Skip additional computation when player doesn't move.
      if (!vecX && !vecY) {
        return
      }

      position.value.x += vecX
      position.value.y += vecY

      const sprite = entity.getComponent(Sprite)
      const stageEntity = this.queries.stage.results[0]

      if (!sprite || !stageEntity) {
        if (process.env.NODE_ENV === "development" && !this.#warnings.noBound) {
          console.warn(
            "Tried to move a player without Sprite component or a stage entity.\n" +
              "Player will not have bounding area."
          )
          this.#warnings.noBound = true
        }

        return
      }

      const stage = stageEntity.getComponent(Stage)
      const {
        value: { x: stageX, y: stageY },
      } = stageEntity.getComponent(Position)

      const minX = stageX - stage.width / 2 + sprite.width / 2
      const maxX = stageX + stage.width / 2 - sprite.width / 2
      const minY = stageY - stage.height / 2 + sprite.height / 2
      const maxY = stageY + stage.height / 2 - sprite.height / 2

      position.value.x = Math.min(Math.max(position.value.x, minX), maxX)
      position.value.y = Math.min(Math.max(position.value.y, minY), maxY)
    })
  }

  static queries = {
    player: {
      components: [Player, Position],
    },
    stage: {
      components: [Stage, Position],
    },
  }
}
