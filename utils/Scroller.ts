import { MutableRefObject } from "react";
import {
  LayoutChangeEvent,
  Platform,
  ScrollViewProps,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { EventEmitter } from "events";

export default class Scroller {
  private ref: MutableRefObject<ScrollView | null>;
  private entriesMap: Record<string, number> = {};
  private entriesCoordinates: Array<[string, number]> = [];
  private eventEmitter = new EventEmitter();
  private lastEntryName = "";
  private layoutHeight = 0;
  private offset = 100;

  constructor(ref: MutableRefObject<ScrollView | null>) {
    this.ref = ref;
  }

  handlers: ScrollViewProps = {
    onLayout: ({ nativeEvent }) => {
      this.layoutHeight = nativeEvent.layout.height;
    },
    onContentSizeChange: () => {
      this.entriesCoordinates = Object.entries(this.entriesMap).sort(
        (a, b) => a[1] - b[1]
      );
    },
    onScroll: ({ nativeEvent }) => {
      const offsetY = nativeEvent.contentOffset.y;
      const layoutHeight = nativeEvent.layoutMeasurement.height;
      const distanceFromTop = layoutHeight * 0.75;
      // We use a conditional to avoid overheading the JS thread on Android.
      // On iOS, scrollEventThrottle will do the work.
      if (Platform.OS !== "android" || Math.abs(nativeEvent.velocity!.y) < 1) {
        for (let i = 0; i < this.entriesCoordinates.length; i++) {
          const [entryName, lowerBound] = this.entriesCoordinates[i];
          const upperBound =
            i < this.entriesCoordinates.length - 1
              ? this.entriesCoordinates[i + 1][1]
              : lowerBound + layoutHeight;
          if (
            offsetY - distanceFromTop >= lowerBound &&
            offsetY - distanceFromTop < upperBound
          ) {
            if (entryName !== this.lastEntryName) {
              this.eventEmitter.emit("select-entry", entryName);
              this.lastEntryName = entryName;
            }
            break;
          }
        }
      }
    }
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
        y: this.entriesMap[entryName] + this.layoutHeight - this.offset,
        animated: true,
      });
    }
  }
}
