import AppLayout from "@/Layouts/AppLayout";
import { useEffect, useState, useRef } from "react";
import {
    UserCircle2,
    Mail,
    Briefcase,
    ShieldCheck,
    VenusAndMars,
    CalendarDays,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import api from "../../API/api";


export default function ProfilePage() {
    const { auth } = usePage().props;
    const authUser = auth?.user;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fileRef = useRef();

    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (authUser?.id) {
            fetchProfile();
        }
    }, [authUser?.id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/users/${authUser.id}`);
            setUser(response.data.data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return;

        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("image", imageFile);

            await api.post(`/users/${authUser.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setImageFile(null);
            setPreview(null);
            fetchProfile();
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error);
        }
    };

    const imageSrc = user?.image
        ? user.image.startsWith("http")
            ? user.image
            : `/storage/${user.image}`
        : null;

    if (loading) {
        return (
            <AppLayout title="Profile">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 text-slate-500">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Loading profile...</span>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout title="Profile">
                <div className="mx-auto max-w-6xl space-y-4">
                    <Link
                        href="/timesheet"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                        {error}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Profile">
            <div className="mx-auto max-w-full space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-green-700">
                            My Profile
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            View your personal, work, and system information.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/timesheet"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>

                        <button
                            type="button"
                            onClick={fetchProfile}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div
                                        onClick={() => fileRef.current.click()}
                                        className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-emerald-100 group"
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UserCircle2 className="h-16 w-16 text-slate-400" />
                                        )}

                                        {/* hover overlay */}
                                        <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white text-xs font-medium group-hover:flex">
                                            Change
                                        </div>
                                    </div>

                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            setImageFile(file);
                                            setPreview(URL.createObjectURL(file));
                                        }}
                                    />

                                    {/* SAVE BUTTON */}
                                    {imageFile && (
                                        <button
                                            onClick={uploadImage}
                                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>

                                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                                    {user?.name || "-"}
                                </h2>

                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="h-4 w-4" />
                                    {user?.email || "-"}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                                        {user?.role || "-"}
                                    </span>

                                    {user?.program && (
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {user.program}
                                        </span>
                                    )}

                                    {user?.position && (
                                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                                            {user.position}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <div className="space-y-4">
                                    <MiniInfo
                                        icon={ShieldCheck}
                                        label="Role"
                                        value={user?.role}
                                    />
                                    <MiniInfo
                                        icon={Briefcase}
                                        label="Program"
                                        value={user?.program}
                                    />
                                    <MiniInfo
                                        icon={Briefcase}
                                        label="Position"
                                        value={user?.position}
                                    />
                                    <MiniInfo
                                        icon={VenusAndMars}
                                        label="Gender"
                                        value={user?.gender}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-5 text-lg font-semibold text-green-800">
                                Personal Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Info label="Full Name" value={user?.name} />
                                <Info label="Email Address" value={user?.email} />
                                <Info label="Gender" value={user?.gender} />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-5 text-lg font-semibold text-green-800">
                                Work Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Info label="Role" value={user?.role} />
                                <Info label="Program" value={user?.program} />
                                <Info label="Position" value={user?.position} />
                                <Info label="Status" value="Active" />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-800">
                                        Account Summary
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        This page shows the information currently
                                        stored in your account, including personal
                                        details, work assignment, and system metadata.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                {value || "-"}
            </p>
        </div>
    );
}

function MiniInfo({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold capitalize text-slate-800">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString();
}