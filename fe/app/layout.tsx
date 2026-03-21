import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModuleProvider } from "@/context/ModuleContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModernHMS | Dashboard",
  description: "Production-ready Hospital Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModuleProvider>{children}</ModuleProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4000 }}
        />
      </body>
    </html>
  );
}
