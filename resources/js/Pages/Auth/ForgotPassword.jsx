import { Head, Link, useForm } from "@inertiajs/react";
import { Mail } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post("/forgot-password");
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.15)]">
                        <div className="p-6 sm:p-10 lg:p-14">
                            <div className="mb-8 text-center">
                                <img
                                    src="/ngof.png"
                                    alt="NGOF Logo"
                                    className="mx-auto mb-4 h-28 w-auto object-contain"
                                />
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Forgot Password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your email address and we will send you a password reset link.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                            <Mail className="h-5 w-5" />
                                        </span>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(37,99,235,0.28)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_35px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? "Sending..." : "Email Password Reset Link"}
                                </button>

                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-sky-600 transition hover:text-sky-700"
                                    >
                                        Back to login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}