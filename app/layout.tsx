import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/Navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "HorecaSeek",
  description: "site de partage horeca",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col font-manrope">
       <NavBar/> 
      <main className="flex-grow">
{children}
      </main>
      </body>
    </html>
  );
}
