import React, { useCallback } from "react";
import {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  MixedStyleRecord,
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
  useInternalRenderer,
} from "react-native-render-html";
import { findOne, textContent } from "domutils";
import { useScroller } from "../utils/scrollerContext";
import { LayoutChangeEvent } from "react-native";

const HeadingRenderer: CustomBlockRenderer = function HeaderRenderer({
  TDefaultRenderer,
  ...props
}) {
  const scroller = useScroller();
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      scroller.registerScrollEntry(textContent(props.tnode.domNode!), e);
    },
    [scroller]
  );
  return <TDefaultRenderer {...props} viewProps={{ onLayout }} />;
};

const ImageRenderer: CustomBlockRenderer = function ImageRenderer(props) {
  const { Renderer, rendererProps } = useInternalRenderer("img", props);
  if ((props.tnode.parent?.classes.indexOf("avatar__photo") || -1) > -1) {
    return <Renderer {...rendererProps} width={50} height={50} />;
  }
  return <Renderer {...rendererProps} style={{}} />;
};

const ParagraphRenderer: CustomBlockRenderer = function ParagraphRenderer({
  TDefaultRenderer,
  tnode,
  ...props
}) {
  const marginsFixture =
    tnode.markers.olNestLevel > -1 || tnode.markers.ulNestLevel > -1
      ? { marginTop: 0, marginBottom: 0 }
      : null;
  return (
    <TDefaultRenderer
      {...props}
      tnode={tnode}
      style={[props.style, marginsFixture]}
    />
  );
};

const renderers: CustomTagRendererRecord = {
  h2: HeadingRenderer,
  h3: HeadingRenderer,
  img: ImageRenderer,
  p: ParagraphRenderer
};

const classesStyles: MixedStyleRecord = {
  avatar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  avatar__photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatar__intro: {
    flexShrink: 1,
    alignItems: "flex-start",
  },
  avatar__name: {
    fontWeight: "bold",
    flexGrow: 0,
    marginBottom: 10,
  },
  avatar__subtitle: {
    color: "rgb(118, 118, 118)",
    fontWeight: "bold",
    lineHeight: 16,
  },
  "avatar__photo-link": {
    borderRadius: 25,
    marginRight: 10,
    overflow: "hidden",
  },
};

export default function WebEngine({ children }: React.PropsWithChildren<{}>) {
  return (
    <TRenderEngineProvider
      ignoredDomTags={["button"]}
      selectDomRoot={(node) =>
        findOne((e) => e.name === "article", node.children, true)
      }
      classesStyles={classesStyles}
      triggerTREInvalidationPropNames={["classesStyles", "tagsStyles"]}
    >
      <RenderHTMLConfigProvider
        renderers={renderers}
        enableExperimentalMarginCollapsing
      >
        {children}
      </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
}
