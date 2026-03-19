import { Head, usePage } from "@inertiajs/react";
import {
    Users,
    Building2,
    FolderKanban,
    ShieldCheck,
    ClipboardList,
    CalendarDays,
    Activity,
    ArrowUpRight,
    Briefcase,
    UserCog,
    Bell,
} from "lucide-react";
import AppLayout from "../Layouts/AppLayout";

function StatCard({ title, value, icon: Icon, subtitle, color = "sky" }) {
    const colorMap = {
        sky: "bg-sky-50 text-sky-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
    };

    return (
        <div className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
                        {value}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[color]}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

function ActionCard({ title, desc, icon: Icon }) {
    return (
        <button className="group rounded-[26px] border border-slate-200/70 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)]">
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-sky-50 group-hover:text-sky-600">
                    <Icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-sky-500" />
            </div>

            <h4 className="mt-5 text-base font-semibold text-slate-800">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
        </button>
    );
}

function ActivityItem({ item }) {
    return (
        <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="mt-1 h-3 w-3 rounded-full bg-green-500"></div>
            <div className="flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-800">
                        {item.task || "New activity recorded"}
                    </p>
                    <span className="text-xs text-slate-400">
                        {item.date || "No date"}
                    </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    {item.user?.name || "Unknown user"} • {item.donor?.name || "No donor"} •{" "}
                    {item.hours} hrs
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { auth, stats, recentActivities } = usePage().props;
    const user = auth?.user;

    const statItems = [
        {
            title: "Total Users",
            value: stats?.totalUsers ?? 0,
            subtitle: "Registered staff and admins",
            icon: Users,
            color: "sky",
        },
        {
            title: "Total Donors",
            value: stats?.totalDonors ?? 0,
            subtitle: "Active donor organizations",
            icon: Building2,
            color: "emerald",
        },
        {
            title: "Projects",
            value: stats?.totalProjects ?? 0,
            subtitle: "Unique project records",
            icon: FolderKanban,
            color: "violet",
        },
        {
            title: "Total Logs",
            value: stats?.totalLogs ?? 0,
            subtitle: "All activity submissions",
            icon: ClipboardList,
            color: "amber",
        },
    ];

    const quickActions = [
        {
            title: "Manage Users",
            desc: "Add, update, and organize system users and permissions.",
            icon: UserCog,
        },
        {
            title: "Manage Donors",
            desc: "Maintain donor records and related information.",
            icon: Building2,
        },
        {
            title: "Track Projects",
            desc: "Review ongoing projects and implementation progress.",
            icon: Briefcase,
        },
        {
            title: "Activity Logs",
            desc: "Monitor daily staff logs, hours, and remarks.",
            icon: ClipboardList,
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <AppLayout title="Dashboard">
                <div className="custom-scroll h-[82vh] overflow-auto">
                    <div className="grid gap-6 xl:grid-cols-12">
                        <div className="space-y-6 xl:col-span-8">
                            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-green-600 via-green-700 to-slate-900 p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)] sm:p-8">
                                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl"></div>

                                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/75">
                                            Welcome back
                                        </p>
                                        <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                                            {user?.name ?? "User"}
                                        </h2>
                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                            Manage users, donors, projects, and daily operational data from one central dashboard.
                                        </p>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                                                Role:{" "}
                                                <span className="font-semibold capitalize">
                                                    {user?.role ?? "staff"}
                                                </span>
                                            </div>
                                            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                                                Position:{" "}
                                                <span className="font-semibold">
                                                    {user?.position ?? "System User"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur lg:w-[280px]">
                                        <p className="text-sm text-white/70">Total Hours</p>
                                        <h3 className="mt-2 text-2xl font-bold">
                                            {stats?.totalHours ?? "0.00"} hrs
                                        </h3>
                                        <p className="mt-3 text-sm leading-6 text-white/75">
                                            Combined hours from all submitted log activities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {statItems.map((stat) => (
                                    <StatCard key={stat.title} {...stat} />
                                ))}
                            </div>

                            <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Quick Actions
                                    </p>
                                    <h3 className="mt-1 text-2xl font-bold text-slate-800">
                                        Manage Core Modules
                                    </h3>
                                </div>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {quickActions.map((action) => (
                                        <ActionCard key={action.title} {...action} />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Recent Activity
                                        </p>
                                        <h3 className="mt-1 text-2xl font-bold text-green-800">
                                            Latest Log Updates
                                        </h3>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-green-600">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {recentActivities?.length > 0 ? (
                                        recentActivities.map((item) => (
                                            <ActivityItem key={item.id} item={item} />
                                        ))
                                    ) : (
                                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                                            No recent activity found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 xl:col-span-4">
                            <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                                <p className="text-sm font-medium text-slate-500">
                                    Account Summary
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                                    User Profile
                                </h3>

                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-green-700 text-xl font-bold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-800">
                                            {user?.name ?? "User"}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            {user?.email ?? "No email"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Role
                                        </p>
                                        <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                                            {user?.role ?? "staff"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Program
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {user?.program ?? "Not assigned"}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Position
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {user?.position ?? "Not assigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                                <p className="text-sm font-medium text-slate-500">
                                    System Status
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                                    Platform Summary
                                </h3>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    Security
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Access protection enabled
                                                </p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            Active
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    Scheduling
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Calendar and events available
                                                </p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                            Ready
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                                <Bell className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    Notifications
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    System reminders operational
                                                </p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                            Enabled
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}