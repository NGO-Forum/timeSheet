import { Head, Link, usePage } from "@inertiajs/react";
import { LogOut, ShieldCheck, UserCircle2, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function StaffLayout({ title, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    // handle click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // image handling
    const imageSrc = user?.image
        ? user.image.startsWith("http")
            ? user.image
            : `/storage/${user.image}`
        : null;

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gray-100">
                <div className="relative">

                    {/* HEADER */}
                    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        FlowTrack
                                    </h1>
                                    <p className="text-sm text-slate-500">
                                        Staff workspace · Timesheet
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="relative" ref={dropdownRef}>

                                {/* AVATAR BUTTON */}
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center justify-center rounded-full focus:outline-none"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 hover:ring-2 hover:ring-emerald-500 transition">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={user?.name ?? "User"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UserCircle2 className="h-6 w-6 text-slate-600" />
                                        )}
                                    </div>
                                </button>

                                {/* DROPDOWN */}
                                {open && (
                                    <div className="absolute right-0 mt-1 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50">

                                        {/* USER INFO */}
                                        <div className="flex items-center gap-3 px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={user?.name ?? "User"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-semibold text-slate-600">
                                                        {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="leading-tight">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {user?.name ?? "User"}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {user?.email ?? ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100" />

                                        {/* MENU */}
                                        <div className="py-2">

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                            >
                                                <Settings className="h-4 w-4 text-slate-500" />
                                                <span>Profile Settings</span>
                                            </Link>

                                        </div>

                                        <div className="border-t border-slate-100" />

                                        {/* LOGOUT */}
                                        <div className="py-2">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* MAIN CONTENT */}
                    <main className="h-[88vh] overflow-auto custom-scroll px-4 py-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </>
    );
}