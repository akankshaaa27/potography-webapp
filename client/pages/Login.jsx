import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        if (username === "admin" && password === "admin") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", username);
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            }
            navigate("/dashboard");
        } else {
            setError("Invalid username or password (use admin/admin)");
        }
    };

    return (
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Section - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="space-y-8">
                        {/* Heading */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Login</h1>
                            <p className="text-gray-600">Enter your credentials to get in</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="•••••••"
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.538-1.15a3.375 3.375 0 01-5.577 5.577m0 0a3 3 0 10-4.24 4.24" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-gold-600 rounded focus:ring-2 focus:ring-gold-500 cursor-pointer"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                            >
                                Login
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Not a member?{" "}
                                <Link to="/register" className="font-semibold text-gray-900 hover:text-purple-600">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Image/Illustration */}
                <div className="hidden lg:flex relative bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 p-8 items-end justify-center overflow-hidden">
                    {/* Background gradients */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                    </div>

                    {/* Camera Icon and Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full w-full">
                        {/* App Logo Image */}
                        <div className="mb-12 flex items-center justify-center">
                            <img 
                                src="/assets/img/logo.PNG" 
                                alt="Patil Photography Logo"
                                className="w-48 h-48 object-contain drop-shadow-lg"
                            />
                        </div>

                        {/* Mountain/Triangle Shape - CSS generated */}
                        {/* <div className="mb-8 relative w-40 h-40 flex items-center justify-center">
                            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#ff69b4', stopOpacity: 1 }} />
                                        <stop offset="50%" style={{ stopColor: '#ff1493', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#8b008b', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <polygon points="100,20 180,160 20,160" fill="url(#mountainGradient)" />
                            </svg>
                        </div> */}

                        {/* Text Content */}
                        <h2 className="text-4xl font-bold leading-tight mb-2">
                            Be a Part of Something
                        </h2>
                        <h2 className="text-4xl font-bold mb-4">
                            Beautiful
                        </h2>
                        <p className="text-lg opacity-90 max-w-xs">
                            Capture moments, create memories, manage your photography studio with ease
                        </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full opacity-20" />
                    <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white rounded-full opacity-20" />
                </div>
            </div>
    );
};

export default Login;
