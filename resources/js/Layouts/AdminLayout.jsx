import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Building2,
    LogOut,
    Menu,
    X,
    UserCircle2,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
    ClipboardList,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ title, children }) {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url || "";
    const user = auth?.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menus = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Activities",
            href: "/log-activities",
            icon: ClipboardList,
        },
        {
            name: "Donors",
            href: "/donors",
            icon: Building2,
        },
        {
            name: "Users",
            href: "/users",
            icon: Users,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f8fafc] to-[#ecfdf5]">
            <div className="flex min-h-screen">
                <aside
                    className={`fixed inset-y-0 left-0 z-50 transform border-r border-white/10 bg-green-900 text-white shadow-2xl transition-all duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } ${sidebarCollapsed ? "lg:w-20" : "lg:w-56"} w-56`}
                >
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
                            <div
                                className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? "lg:justify-center lg:w-full" : ""
                                    }`}
                            >
                                {!sidebarCollapsed && (
                                    <h2 className="whitespace-nowrap text-lg font-bold tracking-wide">
                                        NGOF System
                                    </h2>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSidebarCollapsed((prev) => !prev)}
                                    className="hidden rounded-xl p-2 text-white transition hover:bg-white/10 lg:flex"
                                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                    type="button"
                                >
                                    {sidebarCollapsed ? (
                                        <PanelLeftOpen className="h-5 w-5" />
                                    ) : (
                                        <PanelLeftClose className="h-5 w-5" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="rounded-xl p-2 text-white transition hover:bg-white/10 lg:hidden"
                                    type="button"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2 px-3 py-5">
                            {menus.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    currentUrl === item.href ||
                                    currentUrl.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${active
                                                ? "bg-green-600 text-white shadow-lg"
                                                : "text-emerald-50 hover:bg-green-600 hover:text-white"
                                            } ${sidebarCollapsed
                                                ? "lg:justify-center lg:px-0"
                                                : "gap-3"
                                            }`}
                                        title={sidebarCollapsed ? item.name : ""}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {!sidebarCollapsed && (
                                            <span className="truncate">{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="border-t border-white/10 p-3">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className={`flex w-full items-center rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 ${sidebarCollapsed
                                        ? "justify-center px-0"
                                        : "justify-center gap-2 px-4"
                                    }`}
                                title={sidebarCollapsed ? "Logout" : ""}
                            >
                                <LogOut className="h-4 w-4 shrink-0" />
                                {!sidebarCollapsed && <span>Logout</span>}
                            </Link>
                        </div>
                    </div>
                </aside>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/80 backdrop-blur">
                        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-2xl p-2 text-green-700 transition hover:bg-emerald-100 lg:hidden"
                                    type="button"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>

                                <div>
                                    <p className="text-sm font-medium text-emerald-600">
                                        Admin Panel
                                    </p>
                                    <h1 className="text-base font-bold tracking-tight text-green-700 md:text-2xl">
                                        {title}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl px-4 py-2">
                                <UserCircle2 className="h-6 w-6 text-green-700 md:h-9 md:w-9" />
                                <div className="hidden sm:block">
                                    <p className="text-lg font-semibold text-slate-800">
                                        {user?.name ?? "User"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 bg-gray-100 px-4 py-4">{children}</main>
                </div>
            </div>
        </div>
    );
}