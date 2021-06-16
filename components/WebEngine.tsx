import * as React from "react";
import {
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
} from "react-native-render-html";
import { findOne } from "domutils";

export default function WebEngine({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <TRenderEngineProvider
      ignoredDomTags={["button"]}
      selectDomRoot={(node) =>
        findOne((e) => e.name === "article", node.children, true)
      }
    >
      <RenderHTMLConfigProvider
        enableExperimentalMarginCollapsing
      >
        {children}
      </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  );
}