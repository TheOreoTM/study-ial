import { Baloo_2, Figtree } from "next/font/google";

// One type pairing for both tiers. Baloo 2 is the display voice (headings, numbers, buttons);
// Figtree carries body copy, labels and UI text.
export const display = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], variable: "--pp-display" });
export const body = Figtree({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--pp-body" });

export const fontVars = `${display.variable} ${body.variable}`;
