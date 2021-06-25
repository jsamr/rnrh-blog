import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const scrollStateContext = createContext<{
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  scrollAnim: Animated.SharedValue<number>;
  topOffset: number;
  headerHeight: number;
}>(null as any);

export function useScrollState() {
  return useContext(scrollStateContext);
}

export const VISIBLE_HEADER_HEIGHT = 50;

export function ScrollStateProvider({ children }: PropsWithChildren<{}>) {
  const scrollAnim = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollAnim.value = event.contentOffset.y;
  });
  const { top: topOffset } = useSafeAreaInsets();
  const headerHeight = useMemo(
    () => VISIBLE_HEADER_HEIGHT + topOffset,
    [topOffset]
  );

  return React.createElement(
    scrollStateContext.Provider,
    {
      value: useMemo(
        () => ({ onScroll, scrollAnim, headerHeight, topOffset }),
        [onScroll, scrollAnim, headerHeight, topOffset]
      ),
    },
    children
  );
}
