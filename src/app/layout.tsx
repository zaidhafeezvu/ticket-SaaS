import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticket Marketplace - Buy and Sell Event Tickets",
  description: "A modern SaaS platform for buying and selling event tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
