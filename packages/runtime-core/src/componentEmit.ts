import { toHandlerKey } from "@5c24-mini-vue/shared";

export function emit(instance, event, ...args) {
  const { props } = instance;

  const handlerName = toHandlerKey(event);
  const handler = props[handlerName];
  handler && handler(...args);
}
