import React, { createContext, PropsWithChildren, useContext } from "react";
import Scroller from "./Scroller";

const scrollerContext = createContext<Scroller>(null as any);

export function useScroller(): Scroller {
  return useContext(scrollerContext);
}

export function ScrollerProvider({
  children,
  scroller,
}: PropsWithChildren<{ scroller: Scroller }>) {
  return (
    <scrollerContext.Provider value={scroller}>
      {children}
    </scrollerContext.Provider>
  );
}
