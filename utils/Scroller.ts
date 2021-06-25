import { MutableRefObject } from "react";
import { FlatListProps, FlatList, View } from "react-native";
import { EventEmitter } from "events";
import { TNode } from "react-native-render-html";
import { textContent } from "domutils";

// This is the min distance from the top edge of the scroll view
// to select a heading
const MIN_DIST_FROM_TOP_EDG = 15;

const headings = ["h2", "h3"];

const isHeading = (tnode: TNode) => headings.indexOf(tnode.tagName!) > -1;

export default class Scroller {
  public ref: MutableRefObject<FlatList<TNode> | null>;
  private entriesMap: Record<string, number> = {};
  private lastSelectedHeading: TNode | null = null;
  private topOffset: number = 0;

  private eventEmitter = new EventEmitter();

  constructor(ref: MutableRefObject<FlatList<any> | null>, topOffset: number) {
    this.ref = ref;
    this.topOffset = topOffset;
  }

  handlers: Partial<FlatListProps<TNode>> = {
    viewabilityConfig: {
      viewAreaCoveragePercentThreshold: 30,
    },
    onViewableItemsChanged: ({ viewableItems }) => {
      const first = viewableItems[0];
      if (first && isHeading(first.item)) {
        const tnode = first.item as TNode;
        if (tnode !== this.lastSelectedHeading) {
          this.eventEmitter.emit("select-entry", textContent(tnode.domNode!));
          this.lastSelectedHeading = tnode;
        }
      } else if (first && first.index === 0) {
        this.eventEmitter.emit("select-entry", "");
      }
    },
  };

  addSelectedEntryListener(listener: (entryName: string) => void) {
    this.eventEmitter.addListener("select-entry", listener);
  }

  removeSelectedEntryListener(listener: (entryName: string) => void) {
    this.eventEmitter.removeListener("select-entry", listener);
  }

  registerScrollEntry(name: string, ref: MutableRefObject<View>) {
    ref.current?.measureLayout(
      this.ref.current!.getScrollableNode(),
      (left, top) => {
        this.entriesMap[name] = top - this.topOffset;
      },
      () => {
        console.info("Failed to measure!");
      }
    );
  }

  scrollToTop() {
    this.ref.current?.scrollToOffset({ offset: 0, animated: true });
  }

  scrollToEntry(entryName: string) {
    if (entryName in this.entriesMap) {
      const offset = this.entriesMap[entryName] - MIN_DIST_FROM_TOP_EDG;
      this.ref.current?.scrollToOffset({
        offset,
        animated: true,
      });
    }
  }
}
