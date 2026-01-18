import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, School, Clock, Calendar, Settings, User, X, FileText, BarChart3, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../../stores/authStore";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  // Menu items berdasarkan role
  const getMenuItems = () => {
    const role = user?.role;

    const adminMenu = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
      { icon: Users, label: "Data Guru", path: "/admin/guru" },
      { icon: BookOpen, label: "Mata Pelajaran", path: "/admin/mata-pelajaran" },
      { icon: School, label: "Kelas", path: "/admin/kelas" },
      { icon: Clock, label: "Jam Pelajaran", path: "/admin/jam-pelajaran" },
      { icon: Calendar, label: "Generate Jadwal", path: "/admin/jadwal/generate" },
      { icon: Calendar, label: "Table View", path: "/admin/jadwal/view" },
      { icon: Calendar, label: "Calendar View", path: "/admin/jadwal/calendar" },
      { icon: Settings, label: "Pengaturan", path: "/admin/settings", badge: "Soon" },
    ];

    const guruMenu = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/guru/dashboard" },
      { icon: Calendar, label: "Jadwal Saya", path: "/guru/jadwal" },
      { icon: CheckSquare, label: "Ketersediaan", path: "/guru/ketersediaan", badge: "Soon" },
      { icon: Settings, label: "Profil", path: "/guru/profile", badge: "Soon" },
    ];

    const kepsekMenu = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/kepsek/dashboard" },
      { icon: Calendar, label: "Lihat Jadwal", path: "/kepsek/jadwal", badge: "Week 5" },
      { icon: BarChart3, label: "Analisis", path: "/kepsek/analisis", badge: "Week 6" },
      { icon: FileText, label: "Laporan", path: "/kepsek/laporan", badge: "Week 6" },
      { icon: Settings, label: "Pengaturan", path: "/kepsek/settings", badge: "Soon" },
    ];

    switch (role) {
      case "admin":
        return adminMenu;
      case "guru":
        return guruMenu;
      case "kepsek":
        return kepsekMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Menu umum (semua role)
  const commonMenuItems = [
    {
      path: "/profile",
      icon: User,
      label: "Profil Saya",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Pengaturan",
    },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      <AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}</AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none transition-colors duration-200"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close menu">
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* User Info Mobile */}
          {user && (
            <div className="lg:hidden p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">{user.role}</span>
            </div>
          )}

          {/* Menu Items */}
          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Role-specific menu */}
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{item.badge}</span>}
                  </>
                )}
              </NavLink>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

            {/* Common menu (all roles) */}
            {commonMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Minggu 2: Login System ✅</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2025 Sistem Jadwal Mengajar</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
