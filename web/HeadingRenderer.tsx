import React, { useCallback, useRef } from "react";
import {
  CustomBlockRenderer,
} from "react-native-render-html";
import { textContent } from "domutils";
import { useScroller } from "../utils/scroller";

const HeadingRenderer: CustomBlockRenderer = function HeaderRenderer({
  TDefaultRenderer,
  ...props
}) {
  const scroller = useScroller();
  const ref = useRef<any>();
  const onLayout = useCallback(() => {
    scroller.registerScrollEntry(textContent(props.tnode.domNode!), ref);
  }, [scroller]);
  return <TDefaultRenderer {...props} viewProps={{ onLayout, ref } as any} />;
};

export default HeadingRenderer;
