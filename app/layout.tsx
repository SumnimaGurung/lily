import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lily Studio",
  description: "Minimal fashion e-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

        <div className="flex-1">{children}</div>

        <footer className="bg-white border-t border-gray-200 px-6 md:px-10 py-10">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wider">
                Lily Studio
              </h4>
              <p className="text-neutral-700 leading-6">
                Minimal, elegant fashion for women who value quality, simplicity,
                and timeless style.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wider">Help</h4>
              <div className="space-y-2 text-neutral-700">
                <p>Contact Us</p>
                <p>Shipping</p>
                <p>Returns</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 uppercase tracking-wider">Follow</h4>
              <div className="space-y-2 text-neutral-700">
                <p>Instagram</p>
                <p>Facebook</p>
                <p>Pinterest</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}