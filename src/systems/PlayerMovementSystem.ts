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

      const speed = 0.03

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
    })
  }

  static queries = {
    player: {
      components: [Player, Position],
    },
  }
}
