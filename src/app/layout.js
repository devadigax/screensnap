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

export const metadata = {
  title: "Screensnap - Website Screenshot Tool",
  description: "Generate high-quality website screenshots instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* FIX: Added the font variables to className. 
          Without this, the fonts defined above are never applied.
      */}
      <body 
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}