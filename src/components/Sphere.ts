export class Sphere {
  /**
   * Radius of the sphere.
   */
  public radius!: number

  constructor() {
    this.reset()
  }

  reset() {
    this.radius = 1
  }
}
