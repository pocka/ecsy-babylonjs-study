import * as bb from "babylonjs";
import * as ecsy from "ecsy";

export type SceneCreator<T = {}> = (
  engine: bb.Engine,
  world: ecsy.World,
  params: T
) => Promise<bb.Scene>;
