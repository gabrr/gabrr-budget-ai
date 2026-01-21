"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import type { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
      <Toaster />
    </ChakraProvider>
  );
}
