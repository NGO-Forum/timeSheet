import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function Login({ status, canResetPassword = true }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.15)]">
                        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
                            <div className="w-full">
                                <div className="mb-8 text-center">
                                    <img
                                        src="/ngof.png"
                                        alt="NGOF Logo"
                                        className="mx-auto mb-4 h-28 w-auto object-contain"
                                    />
                                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                                        Sign in
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Enter your email and password to continue.
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
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
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

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                                <Lock className="h-5 w-5" />
                                            </span>

                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={data.password}
                                                autoComplete="current-password"
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                                placeholder="Enter your password"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData("remember", e.target.checked)
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                            />
                                            Remember me
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm font-medium text-sky-600 transition hover:text-sky-700"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(37,99,235,0.28)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_35px_rgba(37,99,235,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? "Signing in..." : "Sign In"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}