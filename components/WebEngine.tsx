import React, { useCallback } from "react";
import {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  isDomElement,
  MixedStyleDeclaration,
  MixedStyleRecord,
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
  useInternalRenderer,
} from "react-native-render-html";
import { findOne, textContent } from "domutils";
import { useScroller } from "../utils/scroller";
import { LayoutChangeEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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

const HeaderRenderer: CustomBlockRenderer = function HeaderRenderer({
  TDefaultRenderer,
  ...props
}) {
  const scroller = useScroller();
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      scroller.setOffset(e.nativeEvent.layout.y + e.nativeEvent.layout.height);
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

const renderers: CustomTagRendererRecord = {
  h2: HeadingRenderer,
  h3: HeadingRenderer,
  img: ImageRenderer,
  p: ParagraphRenderer,
  header: HeaderRenderer,
  div: DivRenderer,
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
  "token-line": {
    whiteSpace: "pre",
    lineHeight: 12 * 1.4,
  },
  "prism-code": {
    backgroundColor: "#282c34",
    fontFamily: "monospace",
    borderRadius: 10,
    fontSize: 12,
    flexShrink: 0,
  },
};

const tagsStyles: MixedStyleRecord = {
  a: {
    color: "#1c1e21",
    backgroundColor: "rgba(187, 239, 253, 0.3)",
  },
  li: {
    marginBottom: 10,
  },
  img: {
    alignSelf: "center",
  },
  h4: {
    marginBottom: 0,
    marginTop: 0,
  },
  code: {
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    fontSize: 14,
  },
  blockquote: {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff8d8",
    borderLeftWidth: 10,
    borderLeftColor: "#ffe564",
  },
};

const baseStyle: MixedStyleDeclaration = {
  color: "#1c1e21",
  fontSize: 16,
  lineHeight: 16 * 1.8,
};

export default function WebEngine({ children }: React.PropsWithChildren<{}>) {
  return (
    <TRenderEngineProvider
      ignoredDomTags={["button", "footer"]}
      selectDomRoot={(node) =>
        findOne((e) => e.name === "article", node.children, true)
      }
      ignoreDomNode={(node) =>
        isDomElement(node) && !!node.attribs.class?.match(/hash-link/)
      }
      classesStyles={classesStyles}
      tagsStyles={tagsStyles}
      baseStyle={baseStyle}
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
