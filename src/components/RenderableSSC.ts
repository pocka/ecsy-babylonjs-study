import * as bb from "babylonjs";
import { SystemStateComponent } from "ecsy";

export class RenderableSSC extends SystemStateComponent {
  public mesh!: bb.Mesh | null;

  constructor() {
    super();

    this.reset();
  }

  reset() {
    this.mesh = null;
  }
}
