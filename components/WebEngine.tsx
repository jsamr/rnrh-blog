import React, { useCallback, useMemo, useRef } from "react";
import {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  HTMLContentModel,
  HTMLElementModel,
  isDomElement,
  ListElementConfig,
  MixedStyleDeclaration,
  MixedStyleRecord,
  RenderHTMLConfig,
  RenderHTMLConfigProvider,
  TBlock,
  TChildrenRenderer,
  TNode,
  TRenderEngineConfig,
  TRenderEngineProvider,
  useComputeMaxWidthForTag,
  useContentWidth,
  useInternalRenderer,
} from "react-native-render-html";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Video } from "expo-av";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { findOne, textContent } from "domutils";
import { useScroller } from "../utils/scroller";
import useThemeColor from "../hooks/useThemeColor";
import Colors from "../utils/Colors";

function findSource(tnode: TBlock) {
  if (tnode.attributes.src) {
    return tnode.attributes.src;
  }
  const sourceElms = findOne(
    (elm) => elm.tagName === "source",
    tnode.domNode.children
  );
  return sourceElms ? sourceElms.attribs.src : "";
}

const VideoRenderer: CustomBlockRenderer = function VideoRenderer({
  tnode,
  style,
  key,
}) {
  const uri = findSource(tnode);
  const computeMaxWidth = useComputeMaxWidthForTag("video");
  const width = computeMaxWidth(useContentWidth());
  return (
    <Video
      key={key}
      useNativeControls
      resizeMode="contain"
      style={[{ aspectRatio: 16 / 9 }, style, { width }]}
      source={{ uri: findSource(tnode) }}
    />
  );
};

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

const renderChild = ({ item }: ListRenderItemInfo<TNode>) => {
  return <TChildrenRenderer tchildren={[item]} />;
};

const ArticleRenderer: CustomBlockRenderer = function ArticleRenderer({
  TDefaultRenderer,
  ...props
}) {
  const scroller = useScroller();
  const children = useMemo(() => {
    return props.tnode.children
      .map((c) => {
        if (c.classes.includes("markdown")) {
          return c.children;
        }
        return c;
      })
      .flat();
  }, [props.tnode]);
  return (
    <FlatList
      {...scroller.handlers}
      ref={scroller.ref as any}
      renderItem={renderChild}
      keyExtractor={(item, index) => `${item.tagName}-${index}`}
      initialNumToRender={2}
      style={styles.container}
      contentContainerStyle={styles.content}
      data={children}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    // alignSelf: "center",
    paddingHorizontal: 10,
    // leave some space for the FAB
    paddingBottom: 65,
  },
});

const customElementModels = {
  video: HTMLElementModel.fromCustomModel({
    contentModel: HTMLContentModel.block,
    tagName: "video",
  }),
};

const renderers: CustomTagRendererRecord = {
  article: ArticleRenderer,
  h2: HeadingRenderer,
  h3: HeadingRenderer,
  img: ImageRenderer,
  p: ParagraphRenderer,
  div: DivRenderer,
  video: VideoRenderer,
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
    color: Colors.textDark,
  },
  p: {
    marginBottom: 0,
  },
};

const ignoredDomTags = ["button", "footer"];

const selectDomRoot: TRenderEngineConfig["selectDomRoot"] = (node) =>
  findOne((e) => e.name === "article", node.children, true);

const ignoreDomNode: TRenderEngineConfig["ignoreDomNode"] = (node) =>
  isDomElement(node) && !!node.attribs.class?.match(/hash-link/);

const listConfig: ListElementConfig = {
  markerBoxStyle: {
    paddingRight: 2,
  },
};

const renderersProps: RenderHTMLConfig["renderersProps"] = {
  ol: listConfig,
  ul: listConfig,
};

const defaultTextProps = { selectable: true };

export default function WebEngine({ children }: React.PropsWithChildren<{}>) {
  const textColor = useThemeColor("text");
  const anchorBackground = useThemeColor("anchorBackground");
  const baseStyle: MixedStyleDeclaration = useMemo(
    () => ({
      color: textColor,
      fontSize: 16,
      lineHeight: 16 * 1.8,
    }),
    [textColor]
  );
  return (
    <TRenderEngineProvider
      ignoredDomTags={ignoredDomTags}
      selectDomRoot={selectDomRoot}
      ignoreDomNode={ignoreDomNode}
      classesStyles={classesStyles}
      tagsStyles={useMemo(
        () => ({
          ...tagsStyles,
          a: {
            color: textColor,
            backgroundColor: anchorBackground,
            textDecorationColor: textColor,
          },
        }),
        [textColor, anchorBackground]
      )}
      customHTMLElementModels={customElementModels}
      baseStyle={baseStyle}
    >
      <RenderHTMLConfigProvider
        renderers={renderers}
        renderersProps={renderersProps}
        defaultTextProps={defaultTextProps}
        enableExperimentalMarginCollapsing
      >
        {children}
      </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
}
