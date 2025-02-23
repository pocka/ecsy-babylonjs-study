import * as bb from "babylonjs"

export class Light {
  public lookingAt!: bb.Vector3

  public intensity!: number

  public scene!: bb.Scene | null

  constructor() {
    this.reset()
  }

  reset() {
    this.lookingAt = new bb.Vector3(0, 0, 0)

    this.intensity = 1

    this.scene = null
  }
}
