import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subjects",
    description: "Explore comprehensive resources for IAL A-Level Mathematics, Physics, Chemistry, and Biology.",
};

export default function SubjectsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
