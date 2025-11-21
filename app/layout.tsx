import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/lib/auth/UserProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Study Hub",
    description: "Your personal study companion",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Study Hub",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <UserProvider>
                <html lang="en">
                    <body>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            <Navbar />
                            {children}
                        </ThemeProvider>
                    </body>
                </html>
            </UserProvider>
        </ClerkProvider>
    );
}
