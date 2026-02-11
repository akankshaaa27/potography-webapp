import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

const ForgotPassword = () => {
    const { data: settings } = useSettings();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to send reset email");
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
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Forgot Password?</h1>
                            <p className="text-gray-600">No worries, we'll help you reset it.</p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                <div className="flex gap-3 mb-4">
                                    <div className="text-green-600 text-2xl">✓</div>
                                    <div>
                                        <h3 className="font-semibold text-green-900 mb-1">Check your email</h3>
                                        <p className="text-green-700 text-sm">
                                            We've sent a password reset link to <strong>{email}</strong>. 
                                            Please check your inbox and follow the instructions.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-green-600 text-sm mt-4">
                                    Didn't receive the email? Check your spam folder or {" "}
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="underline hover:text-green-800 font-semibold"
                                    >
                                        try another email
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@studio.com"
                                            className="w-full px-4 py-3 pl-11 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter the email address associated with your account.
                                    </p>
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
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        )}

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-sm"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
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
                            Reset Your Access
                        </h2>
                        <p className="text-lg opacity-90 max-w-xs">
                            We'll guide you through the process to regain access to your account
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
