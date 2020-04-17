import * as bb from "babylonjs";
import { Not, System } from "ecsy";

import { Light } from "../components/Light";
import { LightSSC } from "../components/LightSSC";
import { RenderableSSC } from "../components/RenderableSSC";
import { ShadowCaster } from "../components/ShadowCaster";

export class ShadowCastingSystem extends System {
  execute() {
    this.queries.lights.added?.forEach((entity) => {
      const { shadowRef } = entity.getComponent(LightSSC);

      this.queries.casters.results.forEach((casterEntity) => {
        const { mesh } = casterEntity.getComponent(RenderableSSC);

        shadowRef?.addShadowCaster(mesh!);
      });
    });

    this.queries.casters.added?.forEach((entity) => {
      const { mesh } = entity.getComponent(RenderableSSC);

      this.queries.lights.results.forEach((lightEntity) => {
        const { shadowRef } = lightEntity.getComponent(LightSSC);

        shadowRef?.addShadowCaster(mesh!);
      });
    });

    this.queries.removedCasters.added?.forEach((entity) => {
      const { mesh } = entity.getComponent(RenderableSSC);

      this.queries.lights.results.forEach((lightEntity) => {
        const { shadowRef } = lightEntity.getComponent(LightSSC);

        shadowRef?.removeShadowCaster(mesh!);
      });
    });
  }

  static queries = {
    lights: {
      components: [Light, LightSSC],
      listen: {
        added: true,
      },
    },
    casters: {
      components: [ShadowCaster, RenderableSSC],
      listen: {
        added: true,
      },
    },
    removedCasters: {
      components: [Not(ShadowCaster), RenderableSSC],
      listen: {
        added: true,
      },
    },
  };
}
