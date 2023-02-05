import { h, getCurrentInstance } from "../../lib/5c24-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo:", instance);
    return {};
  },
  render() {
    return h("div", {}, "foo");
  },
};
