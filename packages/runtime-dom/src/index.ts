import { createRenderer } from "@5c24-mini-vue/runtime-core";

function createElement(type) {
  console.log("createElement-------------");
  return document.createElement(type);
}

function patchProp(el, key, prevVal, nextVal) {
  console.log("patchProp-------------");
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(child, parent, anchor = null) {
  console.log("insert-------------");
  // parent.append(el);
  parent.insertBefore(child, anchor);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

const renderder: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
  return renderder.createApp(...args);
}

export * from "@5c24-mini-vue/runtime-core";
