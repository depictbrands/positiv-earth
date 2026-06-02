import type { Metadata } from "next";
import { Merriweather, Open_Sans, Raleway } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--ff-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--ff-raleway",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--ff-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Positiv Earth",
  description: "A boutique travel advisory for the culturally curious. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${raleway.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
