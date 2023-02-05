import { h } from "../../dist/5c24-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup(props) {
    console.log(props);

    // readonly
    props.count++;
    console.log(props);
  },

  render() {
    return h("div", {}, "foo: " + this.count);
  },
};
