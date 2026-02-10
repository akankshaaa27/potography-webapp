import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

const ResetPassword = () => {
    const { data: settings } = useSettings();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get("token");

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Link</h1>
                    <p className="text-gray-600 mb-6">
                        The password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link 
                        to="/forgot-password" 
                        className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Section - Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="space-y-8">
                        {/* Heading */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Reset Password</h1>
                            <p className="text-gray-600">Enter your new password below.</p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                <div className="flex gap-3 mb-4">
                                    <div className="text-green-600 text-2xl">✓</div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 mb-1">Password Reset Successfully</h3>
                                        <p className="text-green-700 text-sm">
                                            Your password has been updated. You will be redirected to login shortly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your new password"
                                            className="w-full px-4 py-3 pl-11 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition p-1"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 6 characters long.
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter your password"
                                            className="w-full px-4 py-3 pl-11 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition p-1"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        )}

                        <div className="text-center text-gray-600 text-sm">
                            <p>
                                Remember your password?{" "}
                                <Link to="/login" className="font-semibold text-gray-900 hover:text-gold-600">
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Hero */}
                <div
                    className="hidden lg:flex relative p-8 items-center justify-center overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: settings?.backgroundImage ? `url('${settings.backgroundImage}')` : "url('/assets/img/default-bg.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-40" />

                    {/* Hero Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full w-full px-8">
                        <div className="mb-8">
                            {settings?.primaryLogo ? (
                                <img src={settings.primaryLogo} alt={`${settings.businessName || 'Logo'}`} className="w-40 h-40 object-contain drop-shadow-xl rounded-md bg-white/10 p-2" />
                            ) : (
                                <img src="/assets/img/logo.PNG" alt="Logo" className="w-40 h-40 object-contain drop-shadow-xl rounded-md bg-white/10 p-2" />
                            )}
                        </div>

                        <h2 className="text-3xl font-bold leading-tight mb-2">
                            Secure Your Account
                        </h2>
                        <p className="text-lg opacity-90 max-w-xs">
                            Create a strong password to protect your photography studio
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
