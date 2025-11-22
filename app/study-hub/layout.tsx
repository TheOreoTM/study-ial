import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage your study progress, access resources, and track your learning journey.",
};

export default function StudyHubLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
