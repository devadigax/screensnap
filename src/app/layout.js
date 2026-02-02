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
  title: "WebSnap - Website Screenshot Tool",
  description: "Generate high-quality website screenshots instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning={true} to the body */}
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}