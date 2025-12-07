import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money n Play",
  description: "Next.js app with TypeScript, Tailwind CSS, Material UI, and Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
