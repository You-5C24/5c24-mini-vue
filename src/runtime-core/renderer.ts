import { effect } from "../reactivity/effect";
import { EMPTY_PROPS } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container: any, parentComponent) {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        // 只渲染 children
        processFlagment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processText(n1, n2, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFlagment(n1, n2, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processElement(n1, n2, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const oldProps = n1.props || EMPTY_PROPS;
    const newProps = n2.props || EMPTY_PROPS;
    const el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps) {
    for (let key in newProps) {
      const prevProps = oldProps[key];
      const nextProps = newProps[key];

      if (prevProps !== nextProps) {
        hostPatchProp(el, key, prevProps, nextProps);
      }
    }

    if (oldProps !== EMPTY_PROPS) {
      for (let key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    const { children, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const val = props[key];

      hostPatchProp(el, key, null, val);
    }

    hostInsert(el, container);
  }

  function mountChildren(vnode: any, container: any, parentComponent) {
    const { children } = vnode;
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(n1, n2, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVNode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
