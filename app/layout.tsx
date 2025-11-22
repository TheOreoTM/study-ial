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
    metadataBase: new URL("https://study-ial.vercel.app"), // Replace with actual domain
    title: {
        default: "Study Hub | AI-Powered IAL A-Level Learning",
        template: "%s | Study Hub",
    },
    description:
        "Master your IAL A-Levels with Study Hub. AI-powered study plans, past paper parsing, and intelligent question extraction for Math, Physics, Chemistry, and Biology.",
    keywords: [
        "IAL",
        "A-Level",
        "Edexcel",
        "Study Hub",
        "AI Learning",
        "Past Papers",
        "Chemistry",
        "Physics",
        "Biology",
        "Mathematics",
    ],
    authors: [{ name: "Study Hub Team" }],
    creator: "Study Hub",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://study-ial.vercel.app",
        title: "Study Hub | AI-Powered IAL A-Level Learning",
        description:
            "Master your IAL A-Levels with Study Hub. AI-powered study plans, past paper parsing, and intelligent question extraction.",
        siteName: "Study Hub",
        images: [
            {
                url: "/og-image.png", // Ensure this image exists or create a placeholder
                width: 1200,
                height: 630,
                alt: "Study Hub - AI Powered Learning",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Study Hub | AI-Powered IAL A-Level Learning",
        description:
            "Master your IAL A-Levels with Study Hub. AI-powered study plans and intelligent question extraction.",
        images: ["/og-image.png"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-icon.png",
    },
    manifest: "/manifest.json",
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
