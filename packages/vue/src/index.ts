// mini-vue 出口
export * from "@5c24-mini-vue/runtime-dom";
import { baseCompile } from "@5c24-mini-vue/compiler-core";
import * as runtimeDom from "@5c24-mini-vue/runtime-dom";
import { registerRuntimeCompiler } from "@5c24-mini-vue/runtime-dom";

function compileToFunction(template) {
  const { code } = baseCompile(template);
  const render = new Function("Vue", code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(compileToFunction);
