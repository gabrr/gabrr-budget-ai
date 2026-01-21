"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import { useMemo } from "react";

type UseColorModeReturn = {
  colorMode: "light" | "dark";
  setColorMode: (value: "light" | "dark" | "system") => void;
  toggleColorMode: () => void;
};

export function ColorModeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}

export function useColorMode(): UseColorModeReturn {
  const { theme, systemTheme, setTheme } = useTheme();

  const colorMode = useMemo(() => {
    if (theme === "system") {
      return systemTheme === "dark" ? "dark" : "light";
    }
    return theme === "dark" ? "dark" : "light";
  }, [theme, systemTheme]);

  const toggleColorMode = () => {
    setTheme(colorMode === "dark" ? "light" : "dark");
  };

  return { colorMode, setColorMode: setTheme, toggleColorMode };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}
