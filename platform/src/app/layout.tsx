import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InstallPromptIOS } from "@/components/InstallPromptIOS";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#142238",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ALTUS Checador Digital | Control de Asistencia",
  description: "Plataforma SaaS de Control de Asistencia Laboral en la Nube y Cumplimiento LFT",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ALTUS Checador",
  },
  icons: {
    icon: "/logo-altus.jpg",
    apple: "/logo-altus.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ALTUS Checador" />
        <link rel="apple-touch-icon" href="/logo-altus.jpg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        {children}
        <InstallPromptIOS />
      </body>
    </html>
  );
}
