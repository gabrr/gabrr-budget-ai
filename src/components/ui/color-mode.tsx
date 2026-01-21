"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

const COLOR_MODE_QUERY = "(prefers-color-scheme: dark)";
const DARK_CLASS = "dark";
const LIGHT_CLASS = "light";

const applyColorModeClass = (isDark: boolean) => {
  const className = isDark ? DARK_CLASS : LIGHT_CLASS;
  const targets: Array<HTMLElement | null> = [
    document.documentElement,
    document.body,
  ];

  targets.forEach((target) => {
    if (!target) return;
    target.classList.remove(DARK_CLASS, LIGHT_CLASS);
    target.classList.add(className);
  });

  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};

export function ColorModeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(COLOR_MODE_QUERY);

    const update = (event?: MediaQueryList | MediaQueryListEvent) => {
      const matches =
        event && "matches" in event ? event.matches : media.matches;
      applyColorModeClass(matches);
    };

    update(media);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return children;
}
