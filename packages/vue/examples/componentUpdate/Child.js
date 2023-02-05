import { h } from "../../lib/5c24-mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {},
  render(proxy) {
    return h("div", {}, [
      h("div", {}, "child - props - msg: " + this.$props.msg),
    ]);
  },
};
