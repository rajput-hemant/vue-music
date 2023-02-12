import type { App, Component } from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export default {
  install(app: App<Element>) {
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true,
    });

    (<any>Object)
      .entries(baseComponents)
      .forEach(([path, module]: [string, { default: Component }]) => {
        const componentName = upperFirst(
          camelCase(
            path
              .split("/")!
              .pop()! // get file name
              .replace(/\.\w+$/, "") // remove file extension
          )
        );

        // export default
        app.component(`Base${componentName}`, module.default);
      });
  },
};
