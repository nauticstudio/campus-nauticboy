import type { Metadata } from "next";
import { Toaster } from "sonner";
import { fontSans, fontDisplay, fontMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nautic Campus — Academia de Producción Musical",
  description: "Campus virtual de producción musical premium de Nautic Boy Academy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-coral-500/20 selection:text-coral-100">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
