import * as bb from "babylonjs"

export class Position {
  public value!: bb.Vector3

  constructor() {
    this.reset()
  }

  public reset() {
    this.value = new bb.Vector3(0, 0, 0)
  }

  public copy(src: Position) {
    this.value = src.value.clone()
  }
}
