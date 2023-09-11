import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "./_providers/Providers";
import { AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoteChain",
  description: "Donation Reimagined.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <AnimatePresence initial={false} mode="popLayout"> */}
        <Providers>{children}</Providers>
        {/* </AnimatePresence> */}
      </body>
    </html>
  );
}
