import type { Metadata } from "next";
import "@/index.css";
import { Inter, Prompt } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "DCC Budget Manager",
  description: "ระบบจัดการงบประมาณ DCC",
};

import { Providers } from "@/components/shared/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${inter.variable} ${prompt.variable}`}
    >
      <body className="antialiased text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
