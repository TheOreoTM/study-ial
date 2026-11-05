import type { Metadata, Viewport } from "next";
import { Baloo_2, Figtree, Noto_Naskh_Arabic, Noto_Sans_Thaana } from "next/font/google";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

// Baloo 2 is the display voice (headings, numbers, buttons); Figtree carries everything people read.
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["600", "700", "800"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
// Dhivehi and Arabic text. Not preloaded: browsers only download these on pages that actually show those scripts.
const thaana = Noto_Sans_Thaana({ variable: "--font-thaana", subsets: ["thaana"], preload: false });
const naskh = Noto_Naskh_Arabic({ variable: "--font-naskh", subsets: ["arabic"], preload: false });

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
    description: site.description,
    applicationName: site.name,
    openGraph: { title: site.name, description: site.description, siteName: site.name, type: "website" },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fffaf4" },
        { media: "(prefers-color-scheme: dark)", color: "#1b1026" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${baloo.variable} ${figtree.variable} ${thaana.variable} ${naskh.variable} font-sans`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
