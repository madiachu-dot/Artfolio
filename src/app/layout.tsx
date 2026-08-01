import type { Metadata } from "next";
import { Gaegu, Hi_Melody, Inter, Sunshiney } from "next/font/google";
import { Navbar } from "~/components/navbar";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const hiMelody = Hi_Melody({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});
const gaegu = Gaegu({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gaegu",
});
const sunshiney = Sunshiney({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sunshiney",
});

export const metadata: Metadata = {
  title: "Artfolio",
  description: "Showcase your art portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${hiMelody.variable} ${gaegu.variable} ${sunshiney.variable}`}
      >
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
