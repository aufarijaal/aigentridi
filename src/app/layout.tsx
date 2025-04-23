import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aigentridi",
  description: "Collection of AI generated 3D images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link href="https://api.fontshare.com/v2/css?f[]=switzer@1,2&display=swap" rel="stylesheet"/>
      <body>
        {children}
      </body>
    </html>
  );
}
