import { useEffect, useMemo, useState } from "react";
import api from "../../API/api";
import axios from "axios";
import AppLayout from "@/Layouts/AppLayout";
import Swal from "sweetalert2";
import { ensureCsrfCookie } from "../../API/csrf";
import CreatableSelect from "react-select/creatable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ngofLogo from "../../../../public/ngof.png";
import {
    CalendarDays,
    CalendarRange,
    Calendar,
    Plus,
    FileSpreadsheet,
    Pencil,
    Trash2,
    Filter,
    X,
} from "lucide-react";

const COUNTRY_CODE = "KH";

const initialForm = {
    donor_id: "",
    donor_id_label: "",
    leave_type_id: "",
    leave_type_label: "",
    date: new Date().toISOString().split("T")[0],
    task: "",
    project: "",
    hours: "",
    remarks: "",
};

const selectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: "50px",
        borderRadius: "1rem",
        borderColor: state.isFocused ? "#10b981" : "#e2e8f0",
        boxShadow: state.isFocused ? "0 0 0 2px #d1fae5" : "none",
        "&:hover": {
            borderColor: "#10b981",
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: "0 12px",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#94a3b8",
        fontSize: "0.875rem",
    }),
    singleValue: (base) => ({
        ...base,
        fontSize: "0.875rem",
        color: "#334155",
    }),
    input: (base) => ({
        ...base,
        fontSize: "0.875rem",
        color: "#334155",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "1rem",
        overflow: "hidden",
        zIndex: 60,
    }),
    menuList: (base) => ({
        ...base,
        padding: "6px",
    }),
    option: (base, state) => ({
        ...base,
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        backgroundColor: state.isFocused ? "#ecfdf5" : "white",
        color: "#334155",
        cursor: "pointer",
    }),
};

const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const normalizeText = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

const getExcelColumnLetter = (num) => {
    let columnName = "";
    while (num > 0) {
        const remainder = (num - 1) % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        num = Math.floor((num - 1) / 26);
    }
    return columnName;
};

export default function TimesheetPage() {
    const [rows, setRows] = useState([]);
    const [donors, setDonors] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [filters, setFilters] = useState({
        month: new Date().toISOString().slice(0, 7),
        from: "",
        to: "",
        donor_id: "",
        task: "",
    });

    const [form, setForm] = useState(initialForm);

    const donorOptions = useMemo(
        () =>
            Array.isArray(donors)
                ? donors.map((donor) => ({
                    value: String(donor.id),
                    label: donor.name,
                }))
                : [],
        [donors]
    );

    const leaveTypeOptions = useMemo(
        () =>
            Array.isArray(leaveTypes)
                ? leaveTypes.map((leaveType) => ({
                    value: String(leaveType.id),
                    label: leaveType.name,
                }))
                : [],
        [leaveTypes]
    );

    const hasDonor = Boolean(form.donor_id);
    const hasLeaveType = Boolean(form.leave_type_id);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            await ensureCsrfCookie();
        } catch (error) {
            console.error(
                "Failed to initialize CSRF cookie:",
                error.response?.data || error
            );
        }

        await Promise.all([fetchActivities(), fetchDonors(), fetchLeaveTypes()]);
    };

    const fetchActivities = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/ajax/log-activities", {
                params: {
                    month: filters.month || undefined,
                    from: filters.month ? undefined : filters.from || undefined,
                    to: filters.month ? undefined : filters.to || undefined,
                    donor_id: filters.donor_id || undefined,
                    task: filters.task || undefined,
                    per_page: 1000,
                },
            });

            const activities = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

            setRows(activities);
        } catch (error) {
            console.error(
                "Failed to fetch activities:",
                error.response?.data || error
            );
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonors = async () => {
        try {
            const response = await api.get("/donors");

            const donorData = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : Array.isArray(response.data?.data?.data)
                        ? response.data.data.data
                        : [];

            setDonors(donorData);
        } catch (error) {
            console.error(
                "Failed to fetch donors:",
                error.response?.data || error
            );
            setDonors([]);
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get("/leave-types");

            const leaveTypeData = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : Array.isArray(response.data?.data?.data)
                        ? response.data.data.data
                        : [];

            setLeaveTypes(leaveTypeData);
        } catch (error) {
            console.error(
                "Failed to fetch leave types:",
                error.response?.data || error
            );
            setLeaveTypes([]);
        }
    };

    const openCreateModal = () => {
        const today = new Date().toISOString().split("T")[0];

        setForm({
            ...initialForm,
            date: today,
        });
        setErrors({});
        setEditingId(null);
        setShowModal(true);
    };

    const openEditModal = (row) => {
        const donorId = row.donor_id || row.donor?.id || "";
        const donorLabel = row.donor?.name || "";

        const leaveTypeId =
            row.leave_type_id || row.leave_type?.id || row.leaveType?.id || "";
        const leaveTypeLabel =
            row.leave_type?.name || row.leaveType?.name || "";

        setForm({
            donor_id: donorId ? String(donorId) : "",
            donor_id_label: donorLabel,
            leave_type_id: leaveTypeId ? String(leaveTypeId) : "",
            leave_type_label: leaveTypeLabel,
            date: row.date || "",
            task: row.task || "",
            project: row.project || "",
            hours: row.hours ? String(row.hours) : "",
            remarks: row.remarks || "",
        });

        setErrors({});
        setEditingId(row.id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm(initialForm);
        setErrors({});
        setEditingId(null);
    };

    const getCreatableValue = (value, label, options) => {
        if (!value) return null;

        const found = options.find((option) => option.value === String(value));
        if (found) return found;

        return {
            value: String(value),
            label: label || String(value),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.donor_id && form.leave_type_id) {
            setErrors({
                donor_id: ["Please choose only one: donor or leave type."],
                leave_type_id: ["Please choose only one: donor or leave type."],
            });

            Swal.fire({
                icon: "warning",
                title: "Invalid selection",
                text: "Please choose only one: donor or leave type.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        if (!form.donor_id && !form.leave_type_id) {
            setErrors({
                donor_id: ["Please choose donor or leave type."],
                leave_type_id: ["Please choose donor or leave type."],
            });

            Swal.fire({
                icon: "warning",
                title: "Missing selection",
                text: "Please choose donor or leave type.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        try {
            setSaving(true);
            setErrors({});

            await ensureCsrfCookie();

            const payload = {
                donor_id: form.donor_id || null,
                leave_type_id: form.leave_type_id || null,
                date: form.date,
                task: form.task?.trim() || "",
                project: form.project?.trim() || null,
                hours: form.hours === "" ? null : Number(form.hours),
                remarks: form.remarks?.trim() || null,
            };

            if (editingId) {
                await axios.put(`/ajax/log-activities/${editingId}`, payload);

                await Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Timesheet entry updated successfully.",
                    confirmButtonColor: "#059669",
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                await axios.post("/ajax/log-activities", payload);

                await Swal.fire({
                    icon: "success",
                    title: "Created",
                    text: "Timesheet entry created successfully.",
                    confirmButtonColor: "#059669",
                    timer: 1800,
                    showConfirmButton: false,
                });
            }

            closeModal();
            await Promise.all([fetchActivities(), fetchDonors(), fetchLeaveTypes()]);
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 422) {
                setErrors(data?.errors || {});

                Swal.fire({
                    icon: "error",
                    title: "Validation error",
                    text: "Please check the form fields and try again.",
                    confirmButtonColor: "#dc2626",
                });
            } else if (status === 401) {
                console.error("Unauthenticated:", data || error);

                Swal.fire({
                    icon: "error",
                    title: "Unauthenticated",
                    text: "You are not authenticated. Please log in again.",
                    confirmButtonColor: "#dc2626",
                });
            } else if (status === 419) {
                console.error("CSRF error:", data || error);

                Swal.fire({
                    icon: "error",
                    title: "Session expired",
                    text: "Please refresh the page and try again.",
                    confirmButtonColor: "#dc2626",
                });
            } else {
                console.error("Save failed:", data || error);

                Swal.fire({
                    icon: "error",
                    title: "Save failed",
                    text: data?.message || "Failed to save timesheet entry.",
                    confirmButtonColor: "#dc2626",
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This timesheet entry will be deleted.",
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
            await ensureCsrfCookie();
            await axios.delete(`/ajax/log-activities/${id}`);
            await fetchActivities();

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Timesheet entry deleted successfully.",
                confirmButtonColor: "#059669",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Unauthenticated",
                    text: "You are not authenticated. Please log in again.",
                    confirmButtonColor: "#dc2626",
                });
            } else if (status === 419) {
                Swal.fire({
                    icon: "error",
                    title: "Session expired",
                    text: "Please refresh the page and try again.",
                    confirmButtonColor: "#dc2626",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Delete failed",
                    text: data?.message || "Failed to delete entry.",
                    confirmButtonColor: "#dc2626",
                });
            }

            console.error("Delete failed:", data || error);
        }
    };

    const getImageBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const fetchPublicHolidays = async (year, countryCode = COUNTRY_CODE) => {
        try {
            const response = await fetch(
                `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
            );

            if (!response.ok) {
                throw new Error(`Holiday API failed with ${response.status}`);
            }

            const data = await response.json();
            const holidayMap = new Map();

            (Array.isArray(data) ? data : []).forEach((item) => {
                if (item?.date) {
                    holidayMap.set(item.date, {
                        name: item.localName || item.name || "Public Holiday",
                    });
                }
            });

            return holidayMap;
        } catch (error) {
            console.error("Failed to fetch public holidays:", error);
            return new Map();
        }
    };

    const exportStyledTimesheet = async () => {
        if (!filters.month) {
            Swal.fire({
                icon: "warning",
                title: "Month required",
                text: "Please select a month before exporting.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        if (!rows || rows.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No data",
                text: "There is no timesheet data to export.",
                confirmButtonColor: "#059669",
            });
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = "NGO Forum Timesheet";
            workbook.created = new Date();

            const worksheet = workbook.addWorksheet("Timesheet", {
                views: [{ showGridLines: true }],
                pageSetup: {
                    paperSize: 9,
                    orientation: "landscape",
                    fitToPage: true,
                    fitToWidth: 1,
                    fitToHeight: 0,
                    margins: {
                        left: 0.25,
                        right: 0.25,
                        top: 0.4,
                        bottom: 0.4,
                        header: 0.2,
                        footer: 0.2,
                    },
                },
            });

            const selectedMonth = filters.month;
            const [yearStr, monthStr] = selectedMonth.split("-");
            const year = Number(yearStr);
            const month = Number(monthStr);
            const daysInMonth = new Date(year, month, 0).getDate();

            const monthTitle = new Date(year, month - 1, 1).toLocaleString(
                "en-US",
                {
                    month: "long",
                    year: "numeric",
                }
            );

            const monthRows = rows.filter((item) =>
                item?.date?.startsWith(`${selectedMonth}-`)
            );

            const holidayMap = await fetchPublicHolidays(year, COUNTRY_CODE);

            const exportUsers = Array.from(
                new Map(
                    monthRows
                        .filter((item) => item.user?.id)
                        .map((item) => [item.user.id, item.user])
                ).values()
            );

            const currentExportUser = exportUsers.length === 1 ? exportUsers[0] : null;

            const exportUserName = currentExportUser?.name || "All Users";
            const exportUserPosition = currentExportUser?.position || "-";
            const exportUserProgram =
                currentExportUser?.program?.name ||
                currentExportUser?.program ||
                "-";

            const leaveTypeHeaders = Array.isArray(leaveTypes)
                ? leaveTypes.map((leave) => leave?.name?.trim()).filter(Boolean)
                : [];

            const donorHeadersFromDb = Array.isArray(donors)
                ? donors.map((donor) => donor?.name?.trim()).filter(Boolean)
                : [];

            const generalHeaders = ["Date", ...new Set(leaveTypeHeaders)];
            const donorHeaders = [...new Set(donorHeadersFromDb)];
            const headers = [...generalHeaders, ...donorHeaders];

            const leaveTypeColumnMap = {};
            generalHeaders.forEach((header, index) => {
                if (index === 0) return;
                leaveTypeColumnMap[normalizeText(header)] = index + 1;
            });

            const donorColumnMap = {};
            donorHeaders.forEach((name, index) => {
                donorColumnMap[normalizeText(name)] = generalHeaders.length + index + 1;
            });

            const totalColumnIndex = headers.length + 1;
            const descriptionColumnIndex = headers.length + 2;
            const lastColumnIndex = descriptionColumnIndex;

            const generalStartCol = 1;
            const generalEndCol = generalHeaders.length;
            const donorStartCol = generalHeaders.length + 1;
            const donorEndCol = headers.length;

            const generalStartLetter = getExcelColumnLetter(generalStartCol);
            const generalEndLetter = getExcelColumnLetter(generalEndCol);
            const donorStartLetter = getExcelColumnLetter(donorStartCol);
            const donorEndLetter = getExcelColumnLetter(donorEndCol);
            const totalColLetter = getExcelColumnLetter(totalColumnIndex);
            const descriptionColLetter = getExcelColumnLetter(descriptionColumnIndex);

            worksheet.columns = [
                { width: 5 },
                ...Array(Math.max(generalHeaders.length - 1, 0))
                    .fill(null)
                    .map(() => ({ width: 5 })),
                ...Array(donorHeaders.length)
                    .fill(null)
                    .map(() => ({ width: 8 })),
                { width: 7 },
                { width: 45 },
            ];

            const border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            const fills = {
                gray: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "D9D9D9" },
                },
                softPink: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "E6B8B7" },
                },
                red: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF0000" },
                },
                black: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "000000" },
                },
                blue: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "163A52" },
                },
            };

            const fonts = {
                whiteBold: {
                    bold: true,
                    color: { argb: "FFFFFF" },
                },
                bold: {
                    bold: true,
                },
            };

            const align = {
                center: { horizontal: "center", vertical: "middle" },
                left: { horizontal: "left", vertical: "middle" },
                leftWrap: {
                    horizontal: "left",
                    vertical: "middle",
                    wrapText: true,
                },
                centerWrap: {
                    horizontal: "center",
                    vertical: "middle",
                    wrapText: true,
                },
            };

            for (let r = 1; r <= 5; r++) {
                for (let c = 1; c <= lastColumnIndex; c++) {
                    const cell = worksheet.getCell(r, c);
                    cell.border = border;
                    cell.alignment = align.center;
                }
            }

            worksheet.getRow(1).height = 22;
            worksheet.getRow(2).height = 22;
            worksheet.getRow(3).height = 22;
            worksheet.getRow(4).height = 20;
            worksheet.getRow(5).height = 80;

            try {
                const imageBase64 = await getImageBase64(ngofLogo);
                const imageId = workbook.addImage({
                    base64: imageBase64,
                    extension: "png",
                });

                worksheet.mergeCells("A1:F3");
                worksheet.addImage(imageId, {
                    tl: { col: 0.15, row: 0.15 },
                    ext: { width: 220, height: 70 },
                });
            } catch (imageError) {
                console.error("Logo load failed:", imageError);
                worksheet.mergeCells("A1:F3");
                worksheet.getCell("A1").value = "NGO FORUM ON CAMBODIA";
                worksheet.getCell("A1").font = { bold: true, size: 14 };
                worksheet.getCell("A1").alignment = align.center;
            }

            worksheet.mergeCells("G1:J1");
            worksheet.getCell("G1").value = "Name:";
            worksheet.getCell("G1").font = fonts.bold;
            worksheet.getCell("G1").alignment = align.left;

            worksheet.mergeCells("K1:N1");
            worksheet.getCell("K1").value = exportUserName;
            worksheet.getCell("K1").font = fonts.bold;
            worksheet.getCell("K1").alignment = align.left;

            worksheet.mergeCells("G2:J2");
            worksheet.getCell("G2").value = "Position:";
            worksheet.getCell("G2").font = fonts.bold;
            worksheet.getCell("G2").alignment = align.left;

            worksheet.mergeCells("K2:N2");
            worksheet.getCell("K2").value = exportUserPosition;
            worksheet.getCell("K2").alignment = align.left;

            worksheet.mergeCells("G3:J3");
            worksheet.getCell("G3").value = "Program:";
            worksheet.getCell("G3").font = fonts.bold;
            worksheet.getCell("G3").alignment = align.left;

            worksheet.mergeCells("K3:N3");
            worksheet.getCell("K3").value = exportUserProgram;
            worksheet.getCell("K3").alignment = align.left;

            worksheet.mergeCells(`O1:${descriptionColLetter}2`);
            worksheet.getCell("O1").value = "TIMESHEET";
            worksheet.getCell("O1").font = { bold: true, size: 18 };
            worksheet.getCell("O1").alignment = align.center;

            worksheet.mergeCells(`O3:${descriptionColLetter}3`);
            worksheet.getCell("O3").value = `For the month of: ${monthTitle}`;
            worksheet.getCell("O3").font = { bold: true, size: 12 };
            worksheet.getCell("O3").alignment = align.center;

            worksheet.mergeCells(`${generalStartLetter}4:${generalEndLetter}4`);
            worksheet.getCell(`${generalStartLetter}4`).value = "General";
            worksheet.getCell(`${generalStartLetter}4`).font = fonts.bold;
            worksheet.getCell(`${generalStartLetter}4`).fill = fills.gray;
            worksheet.getCell(`${generalStartLetter}4`).alignment = align.center;

            if (donorStartCol <= donorEndCol) {
                worksheet.mergeCells(`${donorStartLetter}4:${donorEndLetter}4`);
                worksheet.getCell(`${donorStartLetter}4`).value =
                    "Donor Allocation Programme Activity";
                worksheet.getCell(`${donorStartLetter}4`).font = fonts.bold;
                worksheet.getCell(`${donorStartLetter}4`).fill = fills.gray;
                worksheet.getCell(`${donorStartLetter}4`).alignment = align.center;
            }

            worksheet.getCell(`${totalColLetter}4`).value = "Total";
            worksheet.getCell(`${totalColLetter}4`).font = fonts.bold;
            worksheet.getCell(`${totalColLetter}4`).fill = fills.gray;
            worksheet.getCell(`${totalColLetter}4`).alignment = align.center;
            worksheet.getCell(`${totalColLetter}4`).border = border;

            worksheet.getCell(`${descriptionColLetter}4`).value = "Description";
            worksheet.getCell(`${descriptionColLetter}4`).font = fonts.bold;
            worksheet.getCell(`${descriptionColLetter}4`).fill = fills.gray;
            worksheet.getCell(`${descriptionColLetter}4`).alignment = align.center;
            worksheet.getCell(`${descriptionColLetter}4`).border = border;

            headers.forEach((header, index) => {
                const cell = worksheet.getCell(5, index + 1);
                cell.value = header;
                cell.font = { bold: true, size: 9 };
                cell.fill = fills.gray;
                cell.border = border;
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                    textRotation: 90,
                    wrapText: true,
                };
            });

            worksheet.getCell(5, totalColumnIndex).fill = fills.gray;
            worksheet.getCell(5, totalColumnIndex).border = border;
            worksheet.getCell(5, descriptionColumnIndex).fill = fills.gray;
            worksheet.getCell(5, descriptionColumnIndex).border = border;

            const startRow = 6;

            for (let day = 1; day <= daysInMonth; day++) {
                const rowNumber = startRow + day - 1;
                const currentDate = `${selectedMonth}-${String(day).padStart(2, "0")}`;
                const currentDateObj = parseLocalDate(currentDate);
                const dayOfWeek = currentDateObj.getDay();
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;
                const holiday = holidayMap.get(currentDate);

                const dayRows = monthRows.filter((item) => item.date === currentDate);

                worksheet.getCell(rowNumber, 1).value = day;
                worksheet.getCell(rowNumber, 1).alignment = align.center;

                let total = 0;
                const descriptions = [];

                dayRows.forEach((item) => {
                    const hours = Number(item.hours || 0);
                    total += hours;

                    const donorName = normalizeText(item.donor?.name);
                    const leaveTypeName = normalizeText(
                        item.leave_type?.name || item.leaveType?.name
                    );

                    if (donorName) {
                        const donorCol =
                            donorColumnMap[donorName] ??
                            donorColumnMap["others"] ??
                            donorColumnMap["other"];

                        if (donorCol) {
                            const existing = Number(
                                worksheet.getCell(rowNumber, donorCol).value || 0
                            );
                            worksheet.getCell(rowNumber, donorCol).value =
                                existing + hours;
                        }
                    }

                    if (leaveTypeName && leaveTypeColumnMap[leaveTypeName]) {
                        const leaveCol = leaveTypeColumnMap[leaveTypeName];
                        const existing = Number(
                            worksheet.getCell(rowNumber, leaveCol).value || 0
                        );
                        worksheet.getCell(rowNumber, leaveCol).value =
                            existing + hours;
                    }

                    const desc = [item.task, item.project, item.remarks]
                        .filter((v) => v && String(v).trim() !== "")
                        .join(" - ");

                    if (desc) descriptions.push(desc);
                });

                if (holiday) {
                    descriptions.unshift(`Holiday: ${holiday.name}`);
                }

                worksheet.getCell(rowNumber, totalColumnIndex).value = total || 0;
                worksheet.getCell(rowNumber, descriptionColumnIndex).value =
                    descriptions.join("; ");

                for (let col = 1; col <= lastColumnIndex; col++) {
                    const cell = worksheet.getCell(rowNumber, col);
                    cell.border = border;
                    cell.font = { size: 10 };
                    cell.alignment =
                        col === descriptionColumnIndex
                            ? align.leftWrap
                            : align.centerWrap;
                }

                if (holiday || isSunday) {
                    for (let col = 1; col <= lastColumnIndex; col++) {
                        worksheet.getCell(rowNumber, col).fill = fills.red;
                    }
                } else if (isSaturday) {
                    for (let col = 1; col <= lastColumnIndex; col++) {
                        worksheet.getCell(rowNumber, col).fill = fills.softPink;
                    }
                }

                worksheet.getRow(rowNumber).height = holiday ? 28 : 22;
            }

            const totalRowIndex = startRow + daysInMonth;
            worksheet.getCell(totalRowIndex, 1).value = "Total";

            for (let col = 2; col <= totalColumnIndex; col++) {
                const letter = worksheet.getColumn(col).letter;
                worksheet.getCell(totalRowIndex, col).value = {
                    formula: `SUM(${letter}${startRow}:${letter}${startRow + daysInMonth - 1
                        })`,
                };
            }

            for (let col = 1; col <= totalColumnIndex; col++) {
                const cell = worksheet.getCell(totalRowIndex, col);
                cell.fill = fills.black;
                cell.font = fonts.whiteBold;
                cell.alignment = align.center;
                cell.border = border;
            }

            worksheet.getCell(totalRowIndex, descriptionColumnIndex).border = border;
            worksheet.getCell(totalRowIndex, descriptionColumnIndex).alignment =
                align.left;

            const percentRowIndex = totalRowIndex + 1;

            if (donorStartCol <= donorEndCol) {
                for (let col = donorStartCol; col <= donorEndCol; col++) {
                    const letter = worksheet.getColumn(col).letter;
                    const cell = worksheet.getCell(percentRowIndex, col);
                    cell.value = {
                        formula: `IF($${totalColLetter}$${totalRowIndex}=0,0,${letter}${totalRowIndex}/$${totalColLetter}$${totalRowIndex})`,
                    };
                    cell.numFmt = "0%";
                    cell.fill = fills.blue;
                    cell.font = fonts.whiteBold;
                    cell.alignment = align.center;
                    cell.border = border;
                }
            }

            worksheet.getCell(percentRowIndex, totalColumnIndex).value = 1;
            worksheet.getCell(percentRowIndex, totalColumnIndex).numFmt = "0%";
            worksheet.getCell(percentRowIndex, totalColumnIndex).fill = fills.blue;
            worksheet.getCell(percentRowIndex, totalColumnIndex).font =
                fonts.whiteBold;
            worksheet.getCell(percentRowIndex, totalColumnIndex).alignment =
                align.center;
            worksheet.getCell(percentRowIndex, totalColumnIndex).border = border;

            for (let col = 1; col < donorStartCol; col++) {
                worksheet.getCell(percentRowIndex, col).border = border;
            }
            worksheet.getCell(percentRowIndex, descriptionColumnIndex).border =
                border;

            const signatureStartRow = percentRowIndex + 3;

            worksheet.mergeCells(`A${signatureStartRow}:D${signatureStartRow}`);
            worksheet.getCell(`A${signatureStartRow}`).value = "Prepared By:";
            worksheet.getCell(`A${signatureStartRow}`).font = fonts.bold;

            worksheet.mergeCells(`F${signatureStartRow}:I${signatureStartRow}`);
            worksheet.getCell(`F${signatureStartRow}`).value = "Reviewed By:";
            worksheet.getCell(`F${signatureStartRow}`).font = fonts.bold;

            worksheet.mergeCells(`L${signatureStartRow}:N${signatureStartRow}`);
            worksheet.getCell(`L${signatureStartRow}`).value = "Checked By:";
            worksheet.getCell(`L${signatureStartRow}`).font = fonts.bold;

            worksheet.mergeCells(`P${signatureStartRow}:S${signatureStartRow}`);
            worksheet.getCell(`P${signatureStartRow}`).value = "Approved By:";
            worksheet.getCell(`P${signatureStartRow}`).font = fonts.bold;

            worksheet.getCell(`A${signatureStartRow + 1}`).value = "Date:";
            worksheet.getCell(`A${signatureStartRow + 2}`).value = "Name:";
            worksheet.getCell(`F${signatureStartRow + 1}`).value = "Date:";
            worksheet.getCell(`F${signatureStartRow + 2}`).value = "Name:";
            worksheet.getCell(`L${signatureStartRow + 1}`).value = "Date:";
            worksheet.getCell(`L${signatureStartRow + 2}`).value = "Name:";
            worksheet.getCell(`P${signatureStartRow + 1}`).value = "Date:";
            worksheet.getCell(`P${signatureStartRow + 2}`).value = "Name:";

            for (let r = signatureStartRow; r <= signatureStartRow + 2; r++) {
                for (let c = 1; c <= lastColumnIndex; c++) {
                    const cell = worksheet.getCell(r, c);
                    cell.border = border;
                    cell.alignment = { vertical: "middle" };
                }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(blob, `timesheet_${selectedMonth}.xlsx`);

            Swal.fire({
                icon: "success",
                title: "Exported",
                text: "Timesheet exported successfully.",
                confirmButtonColor: "#059669",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Export failed:", error);

            Swal.fire({
                icon: "error",
                title: "Export failed",
                text: error?.message || "Could not export Excel file.",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    const todayHours = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);

        return rows
            .filter((row) => row.date === today)
            .reduce((sum, row) => sum + Number(row.hours || 0), 0)
            .toFixed(1);
    }, [rows]);

    const weekHours = useMemo(() => {
        const now = new Date();
        const currentDay = now.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        const mondayString = monday.toISOString().slice(0, 10);

        return rows
            .filter((row) => row.date >= mondayString)
            .reduce((sum, row) => sum + Number(row.hours || 0), 0)
            .toFixed(1);
    }, [rows]);

    const monthHours = useMemo(() => {
        const month = filters.month || new Date().toISOString().slice(0, 7);

        return rows
            .filter((row) => row.date?.startsWith(month))
            .reduce((sum, row) => sum + Number(row.hours || 0), 0)
            .toFixed(1);
    }, [rows, filters.month]);

    return (
        <AppLayout title="Timesheet">
            <div className="space-y-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-green-800">
                            Timesheet Overview
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Track daily working hours, review previous entries,
                            and manage timesheet records.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add New
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={CalendarDays}
                        label="Today"
                        value={todayHours}
                        note="Hours logged today"
                    />

                    <StatCard
                        icon={CalendarRange}
                        label="This Week"
                        value={weekHours}
                        note="Total weekly hours"
                    />

                    <StatCard
                        icon={Calendar}
                        label="This Month"
                        value={monthHours}
                        note="Accumulated monthly hours"
                    />

                    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
                        <div className="flex h-full flex-col justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-emerald-600" />
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                    Export Filter
                                </h2>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <input
                                    type="month"
                                    value={filters.month}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            month: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />

                                <button
                                    type="button"
                                    onClick={fetchActivities}
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-green-700">
                                Recent Entries
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Review, edit, or remove previously logged activities.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={exportStyledTimesheet}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:w-auto"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Export Excel
                        </button>
                    </div>

                    {loading ? (
                        <div className="px-6 py-8 text-center text-sm text-slate-500">
                            Loading...
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="px-6 py-8 text-center text-sm text-slate-500">
                            No timesheet data found.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 p-4 md:hidden">
                                {rows.map((row) => (
                                    <div
                                        key={row.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Date
                                                </p>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {row.date || "-"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(row)}
                                                    className="rounded-xl p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(row.id)}
                                                    className="rounded-xl p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Task
                                                </p>
                                                <p className="truncate text-sm text-slate-700">
                                                    {row.task || "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Project
                                                </p>
                                                <p className="truncate text-sm text-slate-700">
                                                    {row.project || "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Donor
                                                </p>
                                                <p className="truncate text-sm text-slate-700">
                                                    {row.donor?.name || "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Leave Type
                                                </p>
                                                <p className="truncate text-sm text-slate-700">
                                                    {row.leave_type?.name ||
                                                        row.leaveType?.name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Hours
                                                </p>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {row.hours || 0}
                                                </p>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Remarks
                                                </p>
                                                <p className="truncate text-sm text-slate-700">
                                                    {row.remarks || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full text-left">
                                    <thead className="bg-green-700 text-sm text-white">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Date
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Task
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Project
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Donor
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Leave Type
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Hours
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 font-semibold lg:px-6">
                                                Remarks
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-4 text-center font-semibold lg:px-6">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200">
                                        {rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="text-sm text-slate-700 transition hover:bg-slate-50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-800 lg:px-6">
                                                    {row.date}
                                                </td>

                                                <td className="max-w-[180px] px-4 py-4 lg:px-6">
                                                    <p className="truncate">{row.task || "-"}</p>
                                                </td>

                                                <td className="max-w-[140px] px-4 py-4 lg:px-6">
                                                    <p className="truncate">{row.project || "-"}</p>
                                                </td>

                                                <td className="max-w-[140px] px-4 py-4 lg:px-6">
                                                    <p className="truncate">{row.donor?.name || "-"}</p>
                                                </td>

                                                <td className="max-w-[140px] px-4 py-4 lg:px-6">
                                                    <p className="truncate">
                                                        {row.leave_type?.name ||
                                                            row.leaveType?.name ||
                                                            "-"}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900 lg:px-6">
                                                    {row.hours}
                                                </td>

                                                <td className="max-w-[220px] px-4 py-4 lg:px-6">
                                                    <p className="truncate">{row.remarks || "-"}</p>
                                                </td>

                                                <td className="px-4 py-4 lg:px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(row)}
                                                            className="rounded-xl p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(row.id)}
                                                            className="rounded-xl p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? "Edit Timesheet Entry" : "Create Timesheet Entry"}
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                            <FormField label="Date" error={errors.date?.[0]}>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </FormField>

                            <FormField label="Task" error={errors.task?.[0]}>
                                <input
                                    type="text"
                                    value={form.task}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            task: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    placeholder="Enter task"
                                />
                            </FormField>

                            <FormField label="Project" error={errors.project?.[0]}>
                                <input
                                    type="text"
                                    value={form.project}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            project: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    placeholder="Enter project"
                                />
                            </FormField>

                            <FormField label="Hours" error={errors.hours?.[0]}>
                                <input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    max="8"
                                    value={form.hours}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            hours: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    placeholder="0.00"
                                />
                            </FormField>

                            <FormField label="Donor" error={errors.donor_id?.[0]}>
                                <CreatableSelect
                                    isClearable
                                    isDisabled={hasLeaveType}
                                    placeholder={
                                        hasLeaveType
                                            ? "Leave type selected"
                                            : "Select or type donor"
                                    }
                                    options={donorOptions}
                                    value={getCreatableValue(
                                        form.donor_id,
                                        form.donor_id_label,
                                        donorOptions
                                    )}
                                    onChange={(selected) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            donor_id: selected ? selected.value : "",
                                            donor_id_label: selected ? selected.label : "",
                                            leave_type_id: "",
                                            leave_type_label: "",
                                        }));
                                    }}
                                    onCreateOption={(inputValue) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            donor_id: inputValue,
                                            donor_id_label: inputValue,
                                            leave_type_id: "",
                                            leave_type_label: "",
                                        }));
                                    }}
                                    styles={selectStyles}
                                />
                            </FormField>

                            <FormField label="Leave Type" error={errors.leave_type_id?.[0]}>
                                <CreatableSelect
                                    isClearable
                                    isDisabled={hasDonor}
                                    placeholder={
                                        hasDonor
                                            ? "Donor selected"
                                            : "Select or type leave type"
                                    }
                                    options={leaveTypeOptions}
                                    value={getCreatableValue(
                                        form.leave_type_id,
                                        form.leave_type_label,
                                        leaveTypeOptions
                                    )}
                                    onChange={(selected) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            leave_type_id: selected ? selected.value : "",
                                            leave_type_label: selected ? selected.label : "",
                                            donor_id: "",
                                            donor_id_label: "",
                                        }));
                                    }}
                                    onCreateOption={(inputValue) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            leave_type_id: inputValue,
                                            leave_type_label: inputValue,
                                            donor_id: "",
                                            donor_id_label: "",
                                        }));
                                    }}
                                    styles={selectStyles}
                                />
                            </FormField>

                            <div className="md:col-span-2">
                                <p className="text-xs text-slate-500">
                                    Choose either Donor or Leave Type.
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <FormField label="Remarks" error={errors.remarks?.[0]}>
                                    <textarea
                                        rows="4"
                                        value={form.remarks}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                remarks: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        placeholder="Write remarks..."
                                    />
                                </FormField>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : editingId ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function StatCard({ icon: Icon, label, value, note }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600">
                <Icon className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {value}
            </div>

            <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>
    );
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}