import * as bb from "babylonjs"

export class StandardMaterial {
  public diffuseColor!: bb.Color3
  public specularColor!: bb.Color3
  public ambientColor!: bb.Color3
  public emissiveColor!: bb.Color3
  public scene!: bb.Scene | null

  constructor() {
    this.reset()
  }

  public reset() {
    const black = bb.Color3.Black()
    this.diffuseColor = black.clone()
    this.specularColor = black.clone()
    this.ambientColor = black.clone()
    this.emissiveColor = black.clone()
    this.scene = null
  }
}
