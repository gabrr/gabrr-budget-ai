"use client";

import { Box, ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Toaster } from "@/components/ui/toaster";
import type { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <Box className="chakra-theme" minH="100vh" bg="bg" color="fg">
          {children}
          <Toaster />
        </Box>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
