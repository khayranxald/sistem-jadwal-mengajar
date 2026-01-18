import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, LogOut, User } from "lucide-react";
import useDarkMode from "../../../hooks/useDarkMode";
import useAuthStore from "../../../stores/authStore";
import { authApi } from "../../../api/authApi";
import Button from "../../ui/Button";
import GlobalSearch from "../../GlobalSearch";
import NotificationDropdown from "../../NotificationDropdown";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, clearAuth } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "guru":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "kepsek":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "guru":
        return "Guru";
      case "kepsek":
        return "Kepala Sekolah";
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle menu">
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Sistem Jadwal Mengajar</h1>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <GlobalSearch />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <NotificationDropdown />

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={isDarkMode ? "Light Mode" : "Dark Mode"}>
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>

            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                    <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(user.role)}`}>{getRoleLabel(user.role)}</span>
              </div>
            )}

            {/* Logout */}
            <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
