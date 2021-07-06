import React from "react";
import { Text } from "react-native";
import {
  CustomTextualRenderer,
  TChildrenRenderer,
  TNode,
} from "react-native-render-html";

function hasLineReturn(tnode: TNode): boolean {
  const lastChild = tnode.children.length
    ? tnode.children[tnode.children.length - 1]
    : null;
  if (lastChild) {
    if (lastChild.type === "text" && lastChild.data.endsWith("\n")) {
      return true;
    }
    return hasLineReturn(lastChild);
  }
  return false;
}

const SpanRenderer: CustomTextualRenderer = function SpanRenderer({
  TDefaultRenderer,
  ...props
}) {
  if (props.tnode.hasClass("token-line") && !hasLineReturn(props.tnode)) {
    return (
      <TDefaultRenderer {...props}>
        <TChildrenRenderer tchildren={props.tnode.children} />
        <Text>{"\n"}</Text>
      </TDefaultRenderer>
    );
  }
  return <TDefaultRenderer {...props} />;
};

export default SpanRenderer;
