import * as bb from "babylonjs";

export class Renderable {
  public scene!: bb.Scene | null;

  constructor() {
    this.reset();
  }

  reset() {
    this.scene = null;
  }
}
