import { MutableRefObject } from "react";
import { LayoutChangeEvent, Platform, ScrollViewProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { EventEmitter } from "events";

// This is the min distance from the top edge of the scroll view
// to select a heading
const MIN_DIST_FROM_TOP_EDG = 15;

export default class Scroller {
  private ref: MutableRefObject<ScrollView | null>;
  private entriesMap: Record<string, number> = {};
  private entriesCoordinates: Array<[string, number]> = [];
  private eventEmitter = new EventEmitter();
  private lastEntryName = "";
  private offset = 0;

  constructor(ref: MutableRefObject<ScrollView | null>) {
    this.ref = ref;
  }

  handlers: ScrollViewProps = {
    onContentSizeChange: () => {
      this.entriesCoordinates = Object.entries(this.entriesMap).sort(
        (a, b) => a[1] - b[1]
      );
    },
    onScroll: ({ nativeEvent }) => {
      const offsetY =
        nativeEvent.contentOffset.y - this.offset + MIN_DIST_FROM_TOP_EDG;
      const layoutHeight = nativeEvent.layoutMeasurement.height;
      // We use a conditional to avoid overheading the JS thread on Android.
      // On iOS, scrollEventThrottle will do the work.
      if (Platform.OS !== "android" || Math.abs(nativeEvent.velocity!.y) < 1) {
        for (let i = 0; i < this.entriesCoordinates.length; i++) {
          const [entryName, lowerBound] = this.entriesCoordinates[i];
          const upperBound =
            i < this.entriesCoordinates.length - 1
              ? this.entriesCoordinates[i + 1][1]
              : lowerBound + layoutHeight;
          if (offsetY >= lowerBound && offsetY < upperBound) {
            if (entryName !== this.lastEntryName) {
              this.eventEmitter.emit("select-entry", entryName);
              this.lastEntryName = entryName;
            }
            break;
          }
        }
      }
    },
  };

  setOffset(offset: number) {
    this.offset = offset;
  }

  addSelectedEntryListener(listener: (entryName: string) => void) {
    this.eventEmitter.addListener("select-entry", listener);
  }

  removeSelectedEntryListener(listener: (entryName: string) => void) {
    this.eventEmitter.removeListener("select-entry", listener);
  }

  registerScrollEntry(name: string, layout: LayoutChangeEvent) {
    this.entriesMap[name] = layout.nativeEvent.layout.y;
  }

  scrollToEntry(entryName: string) {
    if (entryName in this.entriesMap) {
      this.ref.current?.scrollTo({
        y: this.entriesMap[entryName] + this.offset - MIN_DIST_FROM_TOP_EDG,
        animated: true,
      });
    }
  }
}
