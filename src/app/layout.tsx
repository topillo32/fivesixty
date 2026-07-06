import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PinGate } from "@/lib/PinGate";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cup 5-60 Taper",
  description: "Cup 5-60 Taper App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PinGate>{children}</PinGate>
      </body>
    </html>
  );
}
