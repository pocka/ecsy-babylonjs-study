import * as bb from "babylonjs"

export type SceneDisposer = () => void

export type SceneCreator<T = {}> = (
  engine: bb.Engine,
  params: T
) => Promise<SceneDisposer>
