import { useEffect, useState, useMemo } from "react";
import { useAmbientTRenderEngine } from "react-native-render-html";
import { findAll } from "domutils";
import { Element } from "domhandler";
import { useQuery } from "react-query";

function useFetchHtml(url: string) {
  const {
    isLoading,
    data: html,
    refetch: refresh,
  } = useQuery(
    url,
    async () => {
      const response = await fetch(url);
      if (response.ok) {
        return response.text();
      }
    },
    { staleTime: 24 * 60 * 60 }
  );
  return {
    refresh,
    isLoading,
    html,
  };
}

export default function useArticleDom(url: string) {
  const engine = useAmbientTRenderEngine();
  const [headings, setHeadings] = useState<Element[]>([]);
  const { html } = useFetchHtml(url);
  const dom = useMemo(() => {
    if (typeof html === "string") {
      return engine.parseDocument(html);
    }
    return null;
  }, [html, engine]);
  useEffect(
    function extractHeadings() {
      if (dom != null) {
        // We know the DOM hierarchy is going to be document → body → article
        // because the engine will always ensure that a root document
        // and a body are present. This process is called normalization.
        const article = (dom.children[0] as Element)?.children[0] as Element;
        const headers = findAll(
          (elm) => elm.tagName === "h2" || elm.tagName === "h3",
          article.children
        );
        setHeadings(headers);
      }
    },
    [dom]
  );
  return {
    dom,
    headings,
  };
}
