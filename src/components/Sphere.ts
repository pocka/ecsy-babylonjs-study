import * as bb from "babylonjs";

export class Sphere {
  /**
   * Radius of the sphere.
   */
  public radius!: number;

  public position!: bb.Vector3;

  constructor() {
    this.reset();
  }

  reset() {
    this.radius = 1;
    this.position = new bb.Vector3(0, 0, 0);
  }
}
