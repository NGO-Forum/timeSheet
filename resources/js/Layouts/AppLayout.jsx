import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import StaffLayout from "@/Layouts/StaffLayout";

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = (user?.role || "").toLowerCase();

    return role === "admin" ? (
        <AdminLayout title={title}>{children}</AdminLayout>
    ) : (
        <StaffLayout title={title}>{children}</StaffLayout>
    );
}