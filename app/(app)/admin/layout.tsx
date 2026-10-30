import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Pages also call requireAdmin(); this keeps the nav from ever rendering for non-admins.
    await requireAdmin();
    return (
        <div>
            <AdminNav />
            {children}
        </div>
    );
}
