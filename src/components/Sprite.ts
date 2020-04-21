/**
 * Represents sprite (2D plane) object.
 */
export class Sprite {
  /**
   * A width of the sprite.
   */
  public width!: number

  /**
   * A height of the sprite.
   */
  public height!: number

  public reset() {
    this.width = 0
    this.height = 0
  }
}
