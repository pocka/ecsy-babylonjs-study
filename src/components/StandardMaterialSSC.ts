import * as bb from "babylonjs"
import { SystemStateComponent } from "ecsy"

export class StandardMaterialSSC extends SystemStateComponent {
  public material!: bb.StandardMaterial | bb.Material | null

  constructor() {
    super()
    this.reset()
  }

  public reset() {
    this.material = null
  }
}
