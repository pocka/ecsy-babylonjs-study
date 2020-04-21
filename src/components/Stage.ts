export class Stage {
  public width!: number
  public height!: number

  constructor() {
    this.reset()
  }

  public reset() {
    this.width = 0
    this.height = 0
  }
}
