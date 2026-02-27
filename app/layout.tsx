import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Outfit for headings, Inter for body
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veda Kaveri Teerthashram | A Temple Beyond Time",
  description:
    "Experience the divine energy of Veda Kaveri Teerthashram. Home of the world's largest Panchaloha Sree Chakra Maha Meru.",
};

import { CartProvider } from "@/context/CartContext";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
       <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
