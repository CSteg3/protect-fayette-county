import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Protect Fayette County | Community Data Center Watch", description: "A community resource for Fayette County residents following a proposed data center near La Grange, Texas.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
