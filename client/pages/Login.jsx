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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 lg:gap-0 items-center">
        {/* Left Section - Login Form Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 lg:rounded-r-none shadow-lg h-full">
          <div className="max-w-md mx-auto lg:mx-0 space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.72-7 8.77V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
            </div>

            {/* Heading */}

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back 👋
              </h1>
              <p className="text-gray-600 text-sm">
                Please enter your details.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:border-gold-400 focus:bg-white text-gray-900 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:border-gold-400 focus:bg-white text-gray-900 placeholder-gray-400 transition pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.538-1.15a3.375 3.375 0 01-5.577 5.577m0 0a3 3 0 10-4.24 4.24"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
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

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-bold py-3 rounded-full transition duration-200 mt-6"
              >
                Log in
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-gray-900 hover:text-gold-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Image with Overlay and Logo */}
        <div
          className="hidden lg:flex items-center justify-center relative rounded-3xl rounded-l-none bg-cover bg-center overflow-hidden shadow-lg"
          style={{
            backgroundImage: "url(/website/assets/img/slider/hero6.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "600px",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <img
              src="/website/assets/img/logo.PNG"
              alt="Logo"
              className="w-32 h-32 lg:w-48 lg:h-48 object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
