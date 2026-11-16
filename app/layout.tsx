
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FidelizaPRO | Fideliza clientes",
  description:
    "Plataforma inteligente de fidelización de clientes para todos los negocios.",
  applicationName: "FidelizaPRO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
