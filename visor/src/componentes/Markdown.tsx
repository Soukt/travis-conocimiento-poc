"use client";

import Box from "@mui/material/Box";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useMemo } from "react";

// El texto puede venir de una propuesta de la IA: se limpia antes de pintarlo.
export function Markdown({ texto }: { texto: string }) {
  const html = useMemo(() => {
    if (typeof window === "undefined") return "";
    return DOMPurify.sanitize(marked.parse(texto, { async: false, gfm: true }));
  }, [texto]);

  return (
    <Box
      sx={{
        fontSize: 14,
        lineHeight: 1.6,
        "& h1, & h2, & h3": { fontWeight: 600, mt: 2.5, mb: 1 },
        "& h2": { fontSize: 16 },
        "& h3": { fontSize: 15 },
        "& p": { my: 1 },
        "& ul, & ol": { pl: 3, my: 1 },
        "& li": { my: 0.25 },
        "& code": { bgcolor: "#f1f1f4", px: 0.5, borderRadius: 0.5, fontSize: 13 },
        "& pre": { bgcolor: "#f1f1f4", p: 1.5, borderRadius: 1, overflow: "auto" },
        "& pre code": { bgcolor: "transparent", p: 0 },
        "& > :first-of-type": { mt: 0 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
