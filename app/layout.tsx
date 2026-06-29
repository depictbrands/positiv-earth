import type { Metadata } from "next";
import { Merriweather, Merriweather_Sans, Open_Sans, Raleway } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getLogo } from "@/sanity/lib/getLogo";

const merriweather = Merriweather({
  variable: "--ff-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const merriweatherSans = Merriweather_Sans({
  variable: "--ff-merriweather-sans",
  subsets: ["latin"],
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

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getLogo();

  return {
    title: "Positiv Earth",
    description: "A boutique travel advisory for the culturally curious. ",
    ...(logo.faviconUrl
      ? {
          icons: {
            icon: logo.faviconUrl,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logo = await getLogo();

  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${merriweatherSans.variable} ${raleway.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome logo={logo}>{children}</SiteChrome>
      </body>
    </html>
  );
}
