import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CalTrack - Calorie Tracker",
  description: "Track your calories, macros, and reach your fitness goals with CalTrack",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen bg-gradient-warm noise-overlay overflow-hidden">
          {/* Decorative background blobs */}
          <div className="blob-shape fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-coral/30 dark:bg-coral/10" />
          <div className="blob-shape fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-peach/25 dark:bg-peach/8" style={{ animationDelay: '-4s' }} />
          <div className="blob-shape fixed top-[40%] left-[60%] w-[400px] h-[400px] bg-rose/20 dark:bg-rose/5" style={{ animationDelay: '-2s' }} />

          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  );
}
