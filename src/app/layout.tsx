import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Heart2Heart",
  description: "Conversa privada entre mãe e filho. Termina com Adeus e tudo é apagado.",
  applicationName: "Heart2Heart",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Heart2Heart",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <div className="flex min-h-full flex-1 flex-col bg-gradient-to-b from-rose-50 via-white to-amber-50">
          {children}
        </div>
      </body>
    </html>
  );
}
