import { Head } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Building2,
    Loader2,
    Users,
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
            <div className="w-full max-w-lg rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
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

function DonorForm({
    form,
    setForm,
    errors,
    onSubmit,
    onCancel,
    submitText,
    submitClass,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Donor Name
                </label>

                <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter donor name"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                />

                {errors.name && (
                    <p className="mt-2 text-sm text-red-500">{errors.name[0]}</p>
                )}
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

export default function DonorPage() {
    const [donors, setDonors] = useState([]);
    const [links, setLinks] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [createForm, setCreateForm] = useState({ name: "" });
    const [editForm, setEditForm] = useState({ id: null, name: "" });

    const [errors, setErrors] = useState({});

    const totalDonors = useMemo(() => meta?.total ?? 0, [meta]);
    const currentPage = useMemo(() => meta?.current_page ?? 1, [meta]);
    const perPage = useMemo(
        () => meta?.per_page ?? donors.length ?? 0,
        [meta, donors]
    );

    const fetchDonors = async (url = "/donors", customQuery = query) => {
        try {
            setLoading(true);

            let endpoint = url;
            let params = {};

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

            if (Array.isArray(payload)) {
                setDonors(payload);
                setLinks([]);
                setMeta({
                    total: payload.length,
                    current_page: 1,
                    per_page: payload.length,
                });
            } else {
                setDonors(payload.data || []);
                setLinks(payload.links || []);
                setMeta(payload || {});
            }
        } catch (error) {
            console.error("Fetch donors error:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors("/donors", query);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        setQuery(search);
    };

    const resetCreate = () => {
        setCreateForm({ name: "" });
        setErrors({});
    };

    const resetEdit = () => {
        setEditForm({ id: null, name: "" });
        setErrors({});
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await api.post("/donors", createForm);

            setOpenCreate(false);
            resetCreate();
            fetchDonors("/donors", query);

            Swal.fire({
                icon: "success",
                title: "Created!",
                text: "Donor created successfully.",
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
                    text: "Something went wrong while creating the donor.",
                    confirmButtonColor: "#dc2626",
                });
                console.error("Create donor error:", error.response || error);
            }
        }
    };

    const handleEditOpen = (donor) => {
        setEditForm({
            id: donor.id,
            name: donor.name,
        });
        setErrors({});
        setOpenEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await api.put(`/donors/${editForm.id}`, {
                name: editForm.name,
            });

            setOpenEdit(false);
            resetEdit();
            fetchDonors("/donors", query);

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Donor updated successfully.",
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
                    text: "Something went wrong while updating the donor.",
                    confirmButtonColor: "#dc2626",
                });
                console.error("Update donor error:", error.response || error);
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
            await api.delete(`/donors/${id}`);
            fetchDonors("/donors", query);

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Donor deleted successfully.",
                confirmButtonColor: "#166534",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text: "Something went wrong while deleting the donor.",
                confirmButtonColor: "#dc2626",
            });
            console.error("Delete donor error:", error.response || error);
        }
    };

    const goToPage = (url) => {
        if (!url) return;
        fetchDonors(url, query);
    };

    return (
        <>
            <Head title="Donors" />

            <AppLayout title="Donors">
                <div className="custom-scroll h-[82vh] space-y-6 overflow-auto pr-1">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            title="Total Donors"
                            value={totalDonors}
                            subtitle="All donor records in the system"
                            icon={Building2}
                        />
                        <StatCard
                            title="Current Page"
                            value={currentPage}
                            subtitle="Current pagination position"
                            icon={Users}
                        />
                    </div>

                    <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-green-700">
                                    Donor Management
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Manage and organize donor records easily.
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
                                            placeholder="Search donor name..."
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
                                    {donors.length}
                                </span>{" "}
                                donor{donors.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-slate-500">
                                Total:{" "}
                                <span className="font-semibold text-slate-800">
                                    {totalDonors}
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
                                                Donor Name
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
                                                    colSpan="3"
                                                    className="px-6 py-14 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
                                                        <p className="text-sm font-medium">
                                                            Loading donors...
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : donors.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="px-6 py-14 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                            <Building2 className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-700">
                                                                No donors found
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                Try searching with another keyword
                                                                or add a new donor.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            donors.map((donor, index) => (
                                                <tr
                                                    key={donor.id}
                                                    className="transition hover:bg-emerald-50/70"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                                        {(currentPage - 1) * perPage + index + 1}
                                                    </td>

                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                                                <Building2 className="h-5 w-5" />
                                                            </div>

                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    {donor.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    Donor ID: {donor.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditOpen(donor)
                                                                }
                                                                title="Edit"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 hover:shadow-sm"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(donor.id)
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
                title="Add Donor"
                onClose={() => {
                    setOpenCreate(false);
                    resetCreate();
                }}
            >
                <DonorForm
                    form={createForm}
                    setForm={setCreateForm}
                    errors={errors}
                    onSubmit={handleCreate}
                    onCancel={() => {
                        setOpenCreate(false);
                        resetCreate();
                    }}
                    submitText="Save Donor"
                    submitClass="bg-green-600 hover:bg-green-700"
                />
            </Modal>

            <Modal
                open={openEdit}
                title="Edit Donor"
                onClose={() => {
                    setOpenEdit(false);
                    resetEdit();
                }}
            >
                <DonorForm
                    form={editForm}
                    setForm={setEditForm}
                    errors={errors}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                        setOpenEdit(false);
                        resetEdit();
                    }}
                    submitText="Update Donor"
                    submitClass="bg-green-600 hover:bg-green-700"
                />
            </Modal>
        </>
    );
}