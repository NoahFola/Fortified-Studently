import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
import localFont from "next/font/local";
import Head from "next/head";
import MainLayout from "@/components/MainLayout";

const monaSans = localFont({
  src: [
    {
      path: "../public/fonts/MonaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MonaSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/MonaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mona-sans",
});

export const metadata: Metadata = {
  title: "Studently",
  description: "AI Study Assistant",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* KaTeX CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-Nn/8i6z5w/9fR9sN6w/79sF95x0n9F6y+fHj7A0V8LHR8gLP73e52tkUlJXrHj2T"
          crossOrigin="anonymous"
        />
        {/* KaTeX and Auto-render JS scripts in the head */}
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"
          integrity="sha384-cb2Yl5N7cM5y1y+/HRqTtYY0rHk5kFhX7BxohbEvmA0zI4R/nOlW0tW4GojRm23k"
          crossOrigin="anonymous"
          strategy="beforeInteractive" // Ensures the script is loaded before React renders
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
          integrity="sha384-A4qzKJZ6nFY8HXJXx5mjUQg1ZLPt8yNC7S+bTgfqDE8OBV1QzdDFz6iJ02VGXj07"
          crossOrigin="anonymous"
          strategy="beforeInteractive" // Load before React rendering
        />
      </Head>

      <body className={`${monaSans.variable} antialiased`}>
        <Providers>
          {/* <ThemeToggle /> */}

          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>

      {/* Inline Script for KaTeX Rendering (after Interactive) */}
      <Script
        id="katex-math-render"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof renderMathInElement !== "undefined") {
              renderMathInElement(document.body, {
                delimiters: [
                  { left: "<math>", right: "</math>", display: false },
                  { left: "$$", right: "$$", display: true },
                  { left: "$", right: "$", display: false },
                  { left: "\\[", right: "\\]", display: true },
                  { left: "\\(", right: "\\)", display: false },
                ],
              });
            }
          `,
        }}
      />
      <Script src="https://js.puter.com/v2/"></Script>
    </html>
  );
}
