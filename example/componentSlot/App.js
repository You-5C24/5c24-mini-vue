import { h } from "../../lib/5c24-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h("p", {}, "header" + age),
        footer: () =>
          h("p", {}, [h("span", {}, "footer "), h("span", {}, "123")]),
      }
    );
    // const foo = h(Foo, {}, h("p", {}, "123"));

    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};
