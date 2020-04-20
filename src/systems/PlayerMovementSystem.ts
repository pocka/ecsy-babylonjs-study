import { System } from "ecsy"

import { Player } from "../components/Player"
import { Position } from "../components/Position"

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

      if (this.#keyState.w) {
        position.value.z -= 1
      }
      if (this.#keyState.a) {
        position.value.x += 1
      }
      if (this.#keyState.s) {
        position.value.z += 1
      }
      if (this.#keyState.d) {
        position.value.x -= 1
      }
    })
  }

  static queries = {
    player: {
      components: [Player, Position],
    },
  }
}
