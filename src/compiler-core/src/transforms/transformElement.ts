import { createVNodeCall, NodeTypes } from "../ast";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const vnodeTag = `'${node.tag}'`;

      let vnodeProps;

      const children = node.children;
      let vnodeChildren = children[0];

      const vnodeElement = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      );

      node.codegenNode = vnodeElement;
    };
  }
}
