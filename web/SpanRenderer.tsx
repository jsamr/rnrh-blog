import React from "react";
import { Text } from "react-native";
import {
  CustomTextualRenderer,
  TChildrenRenderer,
  TNode,
} from "react-native-render-html";

function tnodeEndsWithNewLine(tnode: TNode): boolean {
  if (tnode.type === "text") {
    return tnode.data.endsWith("\n");
  }
  const lastChild = tnode.children[tnode.children.length - 1];
  return lastChild ? tnodeEndsWithNewLine(lastChild) : false;
}

const SpanRenderer: CustomTextualRenderer = function SpanRenderer({
  TDefaultRenderer,
  ...props
}) {
  if (props.tnode.hasClass("token-line") && !tnodeEndsWithNewLine(props.tnode)) {
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
