import * as bb from "babylonjs"
import { SystemStateComponent } from "ecsy"

export class CameraSSC extends SystemStateComponent {
  public ref!: bb.Camera | null

  constructor() {
    super()

    this.reset()
  }

  public reset() {
    this.ref = null
  }
}
