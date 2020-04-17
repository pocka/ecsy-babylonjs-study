import * as bb from "babylonjs";
import { SystemStateComponent } from "ecsy";

export class LightSSC extends SystemStateComponent {
  public lightRef!: bb.IShadowLight | null;
  public shadowRef!: bb.ShadowGenerator | null;

  constructor() {
    super();

    this.reset();
  }

  reset() {
    this.lightRef = null;
    this.shadowRef = null;
  }
}
