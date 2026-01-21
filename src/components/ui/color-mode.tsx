"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

const COLOR_MODE_QUERY = "(prefers-color-scheme: dark)";
const DARK_CLASS = "dark";
const LIGHT_CLASS = "light";
const THEME_ATTRIBUTE = "data-theme";
const THEME_ROOT_SELECTOR = ".chakra-theme";

const applyColorModeClass = (isDark: boolean) => {
  const theme = isDark ? DARK_CLASS : LIGHT_CLASS;
  const targets: Array<HTMLElement | null> = [
    document.documentElement,
    document.body,
  ];

  targets.forEach((target) => {
    if (!target) return;
    target.classList.remove(DARK_CLASS, LIGHT_CLASS);
    target.classList.add(theme);
    target.setAttribute(THEME_ATTRIBUTE, theme);
  });

  document.querySelectorAll<HTMLElement>(THEME_ROOT_SELECTOR).forEach((root) => {
    root.classList.remove(DARK_CLASS, LIGHT_CLASS);
    root.classList.add(theme);
    root.setAttribute(THEME_ATTRIBUTE, theme);
  });

  document.documentElement.style.colorScheme = theme;

  try {
    window.localStorage.setItem("chakra-ui-color-mode", theme);
  } catch {}
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
