import React, {  } from "react";
import {
  CustomBlockRenderer,
  TBlock,
  useComputeMaxWidthForTag,
  useContentWidth,
} from "react-native-render-html";
import { Video } from "expo-av";
import { findOne } from "domutils";

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
}) {
  const computeMaxWidth = useComputeMaxWidthForTag("video");
  const width = computeMaxWidth(useContentWidth());
  return (
    <Video
      useNativeControls
      resizeMode="contain"
      style={[{ aspectRatio: 16 / 9 }, style, { width }]}
      source={{ uri: findSource(tnode) }}
    />
  );
};


export default VideoRenderer;