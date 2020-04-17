import * as bb from "babylonjs";
import { Not, System } from "ecsy";

import { Light } from "../components/Light";
import { LightSSC } from "../components/LightSSC";

export class LightingSystem extends System {
  execute() {
    this.queries.added.results.forEach((entity) => {
      const { scene, position, lookingAt, intensity } = entity.getComponent(
        Light
      );

      if (!scene) {
        return;
      }

      const light = new bb.DirectionalLight("light", lookingAt, scene);

      light.position = position;
      light.intensity = intensity;

      const shadowGenerator = new bb.ShadowGenerator(512, light);

      shadowGenerator.useBlurExponentialShadowMap = true;
      shadowGenerator.blurBoxOffset = 2.0;
      shadowGenerator.darkness = 0.5;

      entity.addComponent(LightSSC, {
        lightRef: light,
        shadowRef: shadowGenerator,
      });
    });

    this.queries.removed.results.forEach((entity) => {
      const component = entity.getComponent(LightSSC);

      component.lightRef?.dispose();
      component.shadowRef?.dispose();

      entity.removeComponent(LightSSC);
    });
  }

  static queries = {
    added: {
      components: [Light, Not(LightSSC)],
    },
    removed: {
      components: [Not(Light), LightSSC],
    },
  };
}
