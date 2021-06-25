import React, { useCallback, useMemo } from "react";
import {
  CustomBlockRenderer,
  TNode,
  TNodeRenderer,
  collapseTopMarginForChild,
} from "react-native-render-html";
import { FlatList } from "react-native-gesture-handler";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useScroller } from "../utils/scroller";
import { useScrollState } from "../utils/scroll-anim";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ArticleRenderer: CustomBlockRenderer = function ArticleRenderer({
  TDefaultRenderer,
  ...props
}) {
  const { headerHeight: paddingTop } = useScrollState();
  const scroller = useScroller();
  const { onScroll } = useScrollState();
  // We know the structure of the DOM beforehand:
  // <article>
  //   <header>...</header>
  //   <div class="markdown"> ... </div>
  // </article>
  // Thus we want to flatten the nodes from the markdown element
  // and render each node in a FlatList cell. That way, the first render
  // will only draw 2 items (initialNumToRender), increasing dramatically
  // the "time to first contentful paint".
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
  const renderChild = useCallback(
    ({ item, index }: ListRenderItemInfo<TNode>) => {
      return (
        <TNodeRenderer
          propsFromParent={{
            // In normal circumstances, this is handled by TChildrenRenderer.
            // But since we are rendering each TNode in isolation, we need to
            // implement margin collapsing manually.
            collapsedMarginTop: collapseTopMarginForChild(index, children),
          }}
          tnode={item}
        />
      );
    },
    [children]
  );
  return (
    <AnimatedFlatList
      {...scroller.handlers}
      onScroll={onScroll}
      ref={scroller.ref as any}
      renderItem={renderChild}
      keyExtractor={(item, index) => `${item.tagName}-${index}`}
      initialNumToRender={2}
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop }]}
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
    paddingHorizontal: 10,
    // leave some space for the FAB
    paddingBottom: 65,
  },
});

export default ArticleRenderer;
