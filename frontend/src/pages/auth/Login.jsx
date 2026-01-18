import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useDarkMode from "../../hooks/useDarkMode";
import useAuthStore from "../../stores/authStore";
import { authApi } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    setIsLoading(true);

    // Client-side validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Call login API
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status === "success") {
        const { user, token } = response.data.data;

        // Save to store
        setAuth(user, token);

        // Redirect based on role
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server responded with error
        const { data } = error.response;

        if (data.errors) {
          // Validation errors
          setErrors(data.errors);
        } else {
          // General error
          setApiError(data.message || "Login gagal. Silakan coba lagi.");
        }
      } else if (error.request) {
        // No response from server
        setApiError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        // Other errors
        setApiError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "guru":
        return "/guru/dashboard";
      case "kepsek":
        return "/kepsek/dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear API error
    if (apiError) setApiError("");
  };

  const quickLogin = (email) => {
    setFormData({
      email,
      password: "password",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 transition-colors duration-200">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Sistem Jadwal Mengajar</h1>
              <p className="text-gray-600 dark:text-gray-400">Silakan login untuk melanjutkan</p>
            </motion.div>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">{apiError}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" name="email" placeholder="admin@example.com" value={formData.email} onChange={handleChange} icon={Mail} error={errors.email} disabled={isLoading} required />

            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} icon={Lock} error={errors.password} disabled={isLoading} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button type="submit" variant="primary" disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-6">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Demo Accounts:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => quickLogin("admin@example.com")}
                disabled={isLoading}
                className="w-full p-3 text-left rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors disabled:opacity-50"
              >
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">👨‍💼 Admin</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-mono">admin@example.com</p>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("guru1@example.com")}
                disabled={isLoading}
                className="w-full p-3 text-left rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 transition-colors disabled:opacity-50"
              >
                <p className="text-sm font-medium text-green-900 dark:text-green-200">👨‍🏫 Guru</p>
                <p className="text-xs text-green-700 dark:text-green-400 font-mono">guru1@example.com</p>
              </button>

              <button
                type="button"
                onClick={() => quickLogin("kepsek@example.com")}
                disabled={isLoading}
                className="w-full p-3 text-left rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-colors disabled:opacity-50"
              >
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200">🎓 Kepala Sekolah</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 font-mono">kepsek@example.com</p>
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-3">
              Password untuk semua: <span className="font-mono font-semibold">password</span>
            </p>
          </div>
        </div>

        {/* Version Info */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Minggu 2: Sistem Login 3 Role ✅
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
