import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Joy from "@/app/_components/Joy";
import Navbar from "@/app/_components/Navbar";
import { Stack } from "@mui/joy";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Birding by the Numbers",
  description: "Birding by the Numbers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Joy>
          <Stack sx={{ height: "100vh" }}>
            <Navbar />
            {children}
          </Stack>
        </Joy>
      </body>
    </html>
  );
}
