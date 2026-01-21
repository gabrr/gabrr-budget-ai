import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabrr Budget AI",
  description: "Budget management done simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="color-mode-init"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (isDark) => {
      const className = isDark ? "dark" : "light";
      const root = document.documentElement;
      const body = document.body;
      root.classList.remove("dark", "light");
      root.classList.add(className);
      root.setAttribute("data-theme", className);
      if (body) {
        body.classList.remove("dark", "light");
        body.classList.add(className);
        body.setAttribute("data-theme", className);
      }
      root.style.colorScheme = isDark ? "dark" : "light";
      try {
        window.localStorage.setItem("chakra-ui-color-mode", className);
      } catch {}
    };

    apply(media.matches);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", (event) => apply(event.matches));
    } else if (typeof media.addListener === "function") {
      media.addListener((event) => apply(event.matches));
    }
  } catch {}
})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
