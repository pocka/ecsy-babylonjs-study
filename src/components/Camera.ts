import * as bb from "babylonjs"

export class Camera {
  public target!: bb.Vector3

  public scene!: bb.Scene | null

  constructor() {
    this.reset()
  }

  public reset() {
    this.target = new bb.Vector3(0, 0, 0)
    this.scene = null
  }
}
