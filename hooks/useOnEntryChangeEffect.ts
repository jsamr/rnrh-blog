import { useEffect } from "react";
import { useScroller } from "../utils/scroller";

export default function useOnEntryChangeEffect(
  onEntryChange: (entryName: string) => void
) {
  const scroller = useScroller();
  useEffect(
    function updateActiveTargetOnScroll() {
      scroller.addSelectedEntryListener(onEntryChange);
      return () => scroller.removeSelectedEntryListener(onEntryChange);
    },
    [scroller, onEntryChange]
  );
}
