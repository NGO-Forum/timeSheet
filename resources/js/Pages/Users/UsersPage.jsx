import { Head } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Users,
    ShieldCheck,
    Mail,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../API/api";
import AppLayout from "../../Layouts/AppLayout";

function StatCard({ title, value, icon: Icon, subtitle }) {
    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
            <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-emerald-100/70 blur-2xl" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="mt-3 text-3xl font-bold leading-none text-slate-800">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                    )}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-700 shadow-inner">
                    <Icon className="h-7 w-7" />
                </div>
            </div>
        </div>
    );
}

function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="custom-scroll max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-[#166534]">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Fill in the information below.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

function UserForm({
    form,
    setForm,
    errors,
    onSubmit,
    onCancel,
    submitText,
    submitClass,
    isEdit = false,
}) {
    const imagePreview =
        form.image instanceof File
            ? URL.createObjectURL(form.image)
            : form.image_preview || form.image_url || null;

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Enter full name"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-500">{errors.name[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="Enter email address"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Password{" "}
                        {isEdit && <span className="text-slate-400">(Optional)</span>}
                    </label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder={
                            isEdit
                                ? "Leave blank to keep current password"
                                : "Enter password"
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-500">{errors.password[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Confirm Password{" "}
                        {isEdit && <span className="text-slate-400">(Optional)</span>}
                    </label>
                    <input
                        type="password"
                        value={form.password_confirmation || ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                password_confirmation: e.target.value,
                            }))
                        }
                        placeholder={
                            isEdit ? "Repeat password if changing" : "Confirm password"
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.password_confirmation[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Role
                    </label>
                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                    </select>
                    {errors.role && (
                        <p className="mt-2 text-sm text-red-500">{errors.role[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Program
                    </label>
                    <select
                        value={form.program}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, program: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    >
                        <option value="">Select program</option>
                        <option value="MACOR Program">MACOR Program</option>
                        <option value="PALI Program">PALI Program</option>
                        <option value="SACHAS Program">SACHAS Program</option>
                        <option value="RITI Program">RITI Program</option>
                    </select>
                    {errors.program && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.program[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Position
                    </label>
                    <input
                        type="text"
                        value={form.position}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, position: e.target.value }))
                        }
                        placeholder="Enter position"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                    {errors.position && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.position[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Gender
                    </label>
                    <select
                        value={form.gender}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.gender[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                image: e.target.files?.[0] || null,
                            }))
                        }
                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-[0.9rem] text-sm text-slate-800 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {errors.image && (
                        <p className="mt-2 text-sm text-red-500">{errors.image[0]}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Preview
                    </label>

                    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-20 w-20 rounded-2xl border border-emerald-100 object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700">
                                <ImageIcon className="h-8 w-8" />
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                User profile preview
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Upload JPG, JPEG, PNG, or WEBP image.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${submitClass}`}
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
}

function RoleBadge({ role }) {
    const styles = {
        admin: "border-red-200 bg-red-50 text-red-700",
        manager: "border-amber-200 bg-amber-50 text-amber-700",
        staff: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[role] || "border-slate-200 bg-slate-50 text-slate-700"
                }`}
        >
            {role || "-"}
        </span>
    );
}

export default function UsersPage() {
    const emptyForm = {
        id: null,
        name: "",
        email: "",
        password: "",
        role: "",
        program: "",
        position: "",
        gender: "",
        image: null,
        image_url: "",
        image_preview: "",
    };

    const [users, setUsers] = useState([]);
    const [links, setLinks] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [createForm, setCreateForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const totalUsers = useMemo(() => meta?.total ?? 0, [meta]);
    const currentPage = useMemo(() => meta?.current_page ?? 1, [meta]);
    const perPage = useMemo(
        () => meta?.per_page ?? users.length ?? 0,
        [meta, users]
    );

    const adminCount = useMemo(
        () => users.filter((item) => item.role === "admin").length,
        [users]
    );

    const fetchUsers = async (url = "/users", customQuery = query) => {
        try {
            setLoading(true);

            let endpoint = url;
            const params = {};

            if (url.startsWith("http")) {
                const parsedUrl = new URL(url);
                endpoint = parsedUrl.pathname.replace(/^\/api/, "");
                parsedUrl.searchParams.forEach((value, key) => {
                    params[key] = value;
                });
            }

            if (customQuery) {
                params.search = customQuery;
            }

            const res = await api.get(endpoint, { params });
            const payload = res.data.data;

            setUsers(payload.data || []);
            setLinks(payload.links || []);
            setMeta(payload);
        } catch (error) {
            console.error("Fetch users error:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers("/users", query);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(search);
    };

    const resetCreate = () => {
        setCreateForm(emptyForm);
        setErrors({});
    };

    const resetEdit = () => {
        setEditForm(emptyForm);
        setErrors({});
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const formData = new FormData();
            formData.append("name", createForm.name || "");
            formData.append("email", createForm.email || "");
            formData.append("password", createForm.password || "");
            formData.append(
                "password_confirmation",
                createForm.password_confirmation || ""
            );
            formData.append("role", createForm.role || "");
            formData.append("program", createForm.program || "");
            formData.append("position", createForm.position || "");
            formData.append("gender", createForm.gender || "");

            if (createForm.image) {
                formData.append("image", createForm.image);
            }

            await api.post("/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setOpenCreate(false);
            resetCreate();
            fetchUsers("/users", query);

            Swal.fire({
                icon: "success",
                title: "Created!",
                text: "User created successfully.",
                confirmButtonColor: "#166534",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Create failed",
                    text: "Something went wrong while creating the user.",
                    confirmButtonColor: "#dc2626",
                });
                console.error("Create user error:", error.response || error);
            }
        }
    };

    const handleEditOpen = (user) => {
        setEditForm({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            password: "",
            password_confirmation: "",
            role: user.role || "",
            program: user.program || "",
            position: user.position || "",
            gender: user.gender || "",
            image: null,
            image_url: user.image_url || "",
            image_preview: user.image_url || "",
        });
        setErrors({});
        setOpenEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const formData = new FormData();
            formData.append("name", editForm.name || "");
            formData.append("email", editForm.email || "");
            formData.append("role", editForm.role || "");
            formData.append("program", editForm.program || "");
            formData.append("position", editForm.position || "");
            formData.append("gender", editForm.gender || "");

            if (editForm.password) {
                formData.append("password", editForm.password);
                formData.append(
                    "password_confirmation",
                    editForm.password_confirmation || ""
                );
            }

            if (editForm.image) {
                formData.append("image", editForm.image);
            }

            formData.append("_method", "PUT");

            await api.post(`/users/${editForm.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setOpenEdit(false);
            resetEdit();
            fetchUsers("/users", query);

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "User updated successfully.",
                confirmButtonColor: "#166534",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update failed",
                    text: "Something went wrong while updating the user.",
                    confirmButtonColor: "#dc2626",
                });
                console.error("Update user error:", error.response || error);
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this action.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers("/users", query);

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "User deleted successfully.",
                confirmButtonColor: "#166534",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: "Something went wrong while deleting the user.",
                confirmButtonColor: "#dc2626",
            });
            console.error("Delete user error:", error.response || error);
        }
    };

    const goToPage = (url) => {
        if (!url) return;
        fetchUsers(url, query);
    };

    return (
        <>
            <Head title="Users" />

            <AppLayout title="Users">
                <div className="custom-scroll h-[82vh] space-y-6 overflow-auto pr-1">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            title="Total Users"
                            value={totalUsers}
                            subtitle="All user records in the system"
                            icon={Users}
                        />
                        <StatCard
                            title="Current Page"
                            value={currentPage}
                            subtitle="Current pagination position"
                            icon={ShieldCheck}
                        />
                        <StatCard
                            title="Admins On Page"
                            value={adminCount}
                            subtitle="Admin users in current result"
                            icon={Mail}
                        />
                    </div>

                    <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-green-700">
                                    User Management
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Manage user accounts, roles, and staff information.
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-3 lg:flex-row xl:w-auto">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex w-full items-center gap-3 xl:min-w-[420px]"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search name or email..."
                                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="h-12 rounded-2xl bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#14532d]"
                                    >
                                        Search
                                    </button>
                                </form>

                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#16a34a] to-[#15803d] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(22,163,74,0.28)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(22,163,74,0.34)]"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                            <p className="text-sm text-slate-600">
                                Showing{" "}
                                <span className="font-semibold text-slate-800">
                                    {users.length}
                                </span>{" "}
                                user{users.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-slate-500">
                                Total:{" "}
                                <span className="font-semibold text-slate-800">
                                    {totalUsers}
                                </span>
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-emerald-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-green-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Program
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-14 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
                                                        <p className="text-sm font-medium">
                                                            Loading users...
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-14 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                            <Users className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-700">
                                                                No users found
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                Try searching with another keyword
                                                                or add a new user.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user, index) => (
                                                <tr
                                                    key={user.id}
                                                    className="transition hover:bg-emerald-50/70"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                                        {(currentPage - 1) * perPage + index + 1}
                                                    </td>

                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-3">
                                                            {user.image_url ? (
                                                                <img
                                                                    src={user.image_url}
                                                                    alt={user.name}
                                                                    className="h-11 w-11 rounded-2xl border border-emerald-100 object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 font-semibold text-emerald-700">
                                                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                                                        "U"}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-3">
                                                        <RoleBadge role={user.role} />
                                                    </td>

                                                    <td className="px-6 py-3 text-sm text-slate-700">
                                                        {user.program || "-"}
                                                    </td>

                                                    <td className="px-6 py-3 text-sm text-slate-700">
                                                        {user.position || "-"}
                                                    </td>

                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditOpen(user)
                                                                }
                                                                title="Edit"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 hover:shadow-sm"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(user.id)
                                                                }
                                                                title="Delete"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 hover:shadow-sm"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {links.length > 3 && (
                            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                                {links.map((link, index) => {
                                    const label = link.label
                                        .replace("&laquo; Previous", "Previous")
                                        .replace("Next &raquo;", "Next");

                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url}
                                            onClick={() => goToPage(link.url)}
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${link.active
                                                ? "bg-[#166534] text-white shadow-md"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                } ${!link.url
                                                    ? "cursor-not-allowed opacity-50"
                                                    : ""
                                                }`}
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>

            <Modal
                open={openCreate}
                title="Add User"
                onClose={() => {
                    setOpenCreate(false);
                    resetCreate();
                }}
            >
                <UserForm
                    form={createForm}
                    setForm={setCreateForm}
                    errors={errors}
                    onSubmit={handleCreate}
                    onCancel={() => {
                        setOpenCreate(false);
                        resetCreate();
                    }}
                    submitText="Save User"
                    submitClass="bg-green-600 hover:bg-green-700"
                />
            </Modal>

            <Modal
                open={openEdit}
                title="Edit User"
                onClose={() => {
                    setOpenEdit(false);
                    resetEdit();
                }}
            >
                <UserForm
                    form={editForm}
                    setForm={setEditForm}
                    errors={errors}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                        setOpenEdit(false);
                        resetEdit();
                    }}
                    submitText="Update User"
                    submitClass="bg-green-600 hover:bg-green-700"
                    isEdit
                />
            </Modal>
        </>
    );
}