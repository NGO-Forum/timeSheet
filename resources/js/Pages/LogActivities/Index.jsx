import AppLayout from "@/Layouts/AppLayout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function Index() {
    const [logActivities, setLogActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        month: "",
        user_id: "",
        donor_id: "",
        task: "",
    });

    const extractArray = (responseData) => {
        if (Array.isArray(responseData)) return responseData;
        if (Array.isArray(responseData?.data)) return responseData.data;
        if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
        if (Array.isArray(responseData?.users)) return responseData.users;
        if (Array.isArray(responseData?.donors)) return responseData.donors;
        return [];
    };

    const fetchFilterData = async () => {
        try {
            const [usersRes, donorsRes] = await Promise.all([
                axios.get("/api/users"),
                axios.get("/api/donors"),
            ]);

            setUsers(extractArray(usersRes.data));
            setDonors(extractArray(donorsRes.data));
        } catch (error) {
            console.error("Failed to fetch filter data:", error);
            console.error("Filter response:", error.response?.data);
            setUsers([]);
            setDonors([]);
        }
    };

    const fetchData = async (customFilters = filters) => {
        try {
            setLoading(true);

            const params = {};

            if (customFilters.user_id) params.user_id = customFilters.user_id;
            if (customFilters.donor_id) params.donor_id = customFilters.donor_id;
            if (customFilters.task) params.task = customFilters.task;
            if (customFilters.month) params.month = customFilters.month;

            const res = await axios.get("/ajax/log-activities", { params });

            setLogActivities(extractArray(res.data));
        } catch (error) {
            console.error("Failed to fetch log activities:", error);
            console.error("Data response:", error.response?.data);
            setLogActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchFilterData(), fetchData()]);
        };

        init();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        fetchData(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            month: "",
            user_id: "",
            donor_id: "",
            task: "",
        };

        setFilters(resetFilters);
        fetchData(resetFilters);
    };

    const totalHours = useMemo(() => {
        return logActivities.reduce((sum, item) => sum + Number(item.hours || 0), 0);
    }, [logActivities]);

    const totalRecords = useMemo(() => {
        return logActivities.length;
    }, [logActivities]);

    const totalProjects = useMemo(() => {
        const uniqueProjects = new Set(
            logActivities
                .map((item) => item.project)
                .filter((project) => project && String(project).trim() !== "")
        );

        return uniqueProjects.size;
    }, [logActivities]);

    const totalUsers = useMemo(() => {
        const uniqueUsers = new Set(
            logActivities
                .map((item) => item.user?.id || item.user_id)
                .filter(Boolean)
        );

        return uniqueUsers.size;
    }, [logActivities]);

    return (
        <AppLayout title="Log Activities">
            <div className="custom-scroll h-[82vh] overflow-auto bg-slate-50 p-4 md:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-green-700 md:text-3xl">
                                Log Activities
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Manage and review staff activity logs with filters and summaries.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Records</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-800">
                                {totalRecords}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Hours</p>
                            <h3 className="mt-2 text-2xl font-bold text-green-600">
                                {totalHours.toFixed(2)} hrs
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Projects</p>
                            <h3 className="mt-2 text-2xl font-bold text-purple-600">
                                {totalProjects}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Users</p>
                            <h3 className="mt-2 text-2xl font-bold text-blue-600">
                                {totalUsers}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Selected Month</p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-800">
                                {filters.month || "All Months"}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Status</p>
                            <h3 className="mt-2 text-lg font-semibold text-blue-600">
                                {loading ? "Loading..." : "Ready"}
                            </h3>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-green-700">
                                Filter Activities
                            </h2>
                            <p className="text-sm text-slate-500">
                                Search by month, user, donor, or task.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Month
                                </label>
                                <input
                                    type="month"
                                    name="month"
                                    value={filters.month}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    User
                                </label>
                                <select
                                    name="user_id"
                                    value={filters.user_id}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Users</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-green-700">
                                Activity Records
                            </h2>
                            <p className="text-sm text-slate-500">
                                Detailed list of all activity logs
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                                <p className="mt-4 text-slate-500">Loading activities...</p>
                            </div>
                        ) : logActivities.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Task</th>
                                            <th className="px-6 py-4">Project</th>
                                            <th className="px-6 py-4">Donor</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Hours</th>
                                            <th className="px-6 py-4">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {logActivities.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                                                    {item.date || "-"}
                                                </td>

                                                <td className="min-w-[220px] truncate px-6 py-4">
                                                    <div className="font-medium text-slate-800">
                                                        {item.task || "-"}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.project ? (
                                                        <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                                            {item.project}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.donor?.name ? (
                                                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                            {item.donor.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.user?.name ? (
                                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                            {item.user.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="inline-flex rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        {item.hours || 0} hrs
                                                    </span>
                                                </td>

                                                <td className="max-w-[280px] px-6 py-4 text-slate-600">
                                                    <p className="truncate">
                                                        {item.remarks || "-"}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                    <svg
                                        className="h-8 w-8 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.8}
                                            d="M9 17v-6h13M9 5v6h13M5 5h.01M5 12h.01M5 19h.01"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-700">
                                    No activity records found
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing the filters or add new activity records.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}