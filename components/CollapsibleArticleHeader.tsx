import React, { useMemo, useState } from "react";
import { HeaderBackButton } from "@react-navigation/stack";
import { StyleSheet, View, ViewStyle, Share } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Appbar } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import Color from "color";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useThemeColor from "../hooks/useThemeColor";
import { useScrollState } from "../utils/scroll-anim";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../shared-types";
import { useCallback } from "react";

const COLLAPSE_OFFSET_THRESHOLD = 10;

function useCollapsedState() {
  const { scrollAnim } = useScrollState();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(0);
  const previousScrollAnim = useSharedValue(0);
  const collapsedState = useDerivedValue(
    () => withTiming(isHeaderCollapsed),
    [isHeaderCollapsed]
  );
  const diffScrollAnim = useDerivedValue(() => {
    const prev = previousScrollAnim.value;
    previousScrollAnim.value = scrollAnim.value;
    return scrollAnim.value - prev;
  });
  useAnimatedReaction(
    () => diffScrollAnim.value,
    (diff) => {
      if (Math.abs(diff) > 1) {
        if (
          diff > 0 &&
          isHeaderCollapsed === 0 &&
          scrollAnim.value > COLLAPSE_OFFSET_THRESHOLD
        ) {
          runOnJS(setIsHeaderCollapsed)(1);
        } else if (
          (isHeaderCollapsed === 1 && diff < 0) ||
          scrollAnim.value < COLLAPSE_OFFSET_THRESHOLD
        ) {
          runOnJS(setIsHeaderCollapsed)(0);
        }
      }
    },
    [setIsHeaderCollapsed, isHeaderCollapsed, diffScrollAnim, scrollAnim]
  );
  return collapsedState;
}

export default function CollapsibleArticleHeader() {
  const background = useThemeColor("headerBackground");
  const color = useThemeColor("headerColor");
  const navigation = useNavigation();
  const collapsedState = useCollapsedState();
  const { headerHeight, topOffset } = useScrollState();
  const {
    params: { url },
  } = useRoute<RouteProp<RootStackParamList, "Article">>();
  const transparentBackgrond = useMemo(
    () => Color(background).alpha(0.92).string(),
    [background]
  );
  const onPressShare = useCallback(() => {
    Share.share({
      message: url,
      url,
      title: url,
    });
  }, [url]);
  const onPressOpen = useCallback(() => {
    WebBrowser.openBrowserAsync(url);
  }, [url]);
  const contentStyle = useAnimatedStyle<ViewStyle>(() => {
    const translateY = interpolate(
      collapsedState.value,
      [0, 1],
      [0, -headerHeight],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
    };
  }, [headerHeight, collapsedState]);
  const containerStyle = useAnimatedStyle<ViewStyle>(() => {
    const height = headerHeight;
    const translateY = interpolate(
      collapsedState.value,
      [0, 1],
      [0, -(headerHeight - topOffset)],
      Extrapolate.CLAMP
    );
    return {
      backgroundColor: transparentBackgrond,
      paddingTop: topOffset,
      height,
      transform: [
        {
          translateY,
        },
      ],
    };
  }, [transparentBackgrond, topOffset, headerHeight, collapsedState]);
  return (
    <Animated.View style={[styles.backbutton, containerStyle]}>
      <Animated.View style={contentStyle}>
        <HeaderBackButton
          style={{ flexGrow: 0 }}
          onPress={navigation.goBack}
          label="Blog"
        />
        <View style={{ flex: 1 }} />
        <Appbar.Action
          onPress={onPressShare}
          color={color}
          icon="share-variant"
        />
        <Appbar.Action onPress={onPressOpen} color={color} icon="open-in-new" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backbutton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
