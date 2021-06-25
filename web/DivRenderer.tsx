import React from "react";
import { CustomBlockRenderer } from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";

const DivRenderer: CustomBlockRenderer = function DivRenderer({
  TDefaultRenderer,
  ...props
}) {
  if (props.tnode.classes.indexOf("prism-code") > -1) {
    return (
      <ScrollView horizontal style={props.style}>
        <TDefaultRenderer
          {...props}
          style={[{ flexGrow: 1, flexShrink: 1, padding: 10 }]}
        />
      </ScrollView>
    );
  }
  return <TDefaultRenderer {...props} />;
};

export default DivRenderer;
