"use client";

import { ReactNode } from "react";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";

export default function Joy({ children }: { children: ReactNode }) {
  return (
    <CssVarsProvider
      theme={extendTheme({
        fontFamily: {
          display: "var(--font-inter)",
          body: "var(--font-inter)",
        },
      })}
    >
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
