import React, { useMemo } from "react";
import {
  CustomTagRendererRecord,
  HTMLContentModel,
  HTMLElementModel,
  isDomElement,
  ListElementConfig,
  MixedStyleDeclaration,
  MixedStyleRecord,
  RenderHTMLConfig,
  RenderHTMLConfigProvider,
  TRenderEngineConfig,
  TRenderEngineProvider,
} from "react-native-render-html";
import { findOne } from "domutils";
import useThemeColor from "../hooks/useThemeColor";
import Colors from "../utils/Colors";
import VideoRenderer from "../web/VideoRenderer";
import ArticleRenderer from "../web/ArticleRenderer";
import HeadingRenderer from "../web/HeadingRenderer";
import ImageRenderer from "../web/ImageRenderer";
import ParagraphRenderer from "../web/ParagraphRenderer";
import DivRenderer from "../web/DivRenderer";
import { TextProps } from "react-native";

const customElementModels = {
  video: HTMLElementModel.fromCustomModel({
    contentModel: HTMLContentModel.block,
    tagName: "video",
    isOpaque: true,
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
  h1: {
    marginVertical: 15,
    paddingBottom: 5,
    fontSize: 55,
    lineHeight: 55 * 1.2,
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
};

const ignoredDomTags = ["button", "footer"];

const selectDomRoot: TRenderEngineConfig["selectDomRoot"] = (node) =>
  findOne((e) => e.name === "article", node.children, true);

const ignoreDomNode: TRenderEngineConfig["ignoreDomNode"] = (node) =>
  isDomElement(node) && !!node.attribs.class?.match(/hash-link/);

const listConfig: ListElementConfig = {
  markerBoxStyle: {
    paddingRight: 6,
  },
};

const renderersProps: RenderHTMLConfig["renderersProps"] = {
  ol: listConfig,
  ul: listConfig,
};

const defaultTextProps: TextProps = { selectable: true };

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
