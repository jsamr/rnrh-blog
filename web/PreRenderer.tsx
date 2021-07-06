import React from "react";
import { CustomBlockRenderer } from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";

const PreRenderer: CustomBlockRenderer = function PreRenderer({
  TDefaultRenderer,
  ...props
}) {
  if (props.tnode.hasClass("prism-code")) {
    return (
      <ScrollView horizontal style={props.style}>
        <TDefaultRenderer
          {...props}
          style={{ flexGrow: 1, flexShrink: 1, padding: 10 }}
        />
      </ScrollView>
    );
  }
  return <TDefaultRenderer {...props} />;
};

export default PreRenderer;
