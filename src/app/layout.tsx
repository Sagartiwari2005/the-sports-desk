
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THE SPORTS DESK | More Than the Game",
    template: "%s | THE SPORTS DESK",
  },
  description:
    "Independent sports journalism. Football reporting, thoughtful analysis, opinion and stories that go beyond the final score.",
  applicationName: "THE SPORTS DESK",
  keywords: [
    "sports journalism",
    "football news",
    "football analysis",
    "match reports",
    "sports opinion",
  ],
  openGraph: {
    title: "THE SPORTS DESK",
    description: "More than the game. More than the score.",
    type: "website",
    siteName: "THE SPORTS DESK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
