import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Little Us Quiz",
  description: "A quiz made with love.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
