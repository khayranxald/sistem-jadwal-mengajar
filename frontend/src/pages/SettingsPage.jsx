import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Globe, Palette, Database, Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [notifications, setNotifications] = useState({
    schedule_changes: true,
    email_notifications: false,
    push_notifications: true,
  });
  const [language, setLanguage] = useState("id");
  const [theme, setTheme] = useState("blue");
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const themes = [
    { id: "blue", name: "Biru", color: "bg-blue-600" },
    { id: "purple", name: "Ungu", color: "bg-purple-600" },
    { id: "green", name: "Hijau", color: "bg-green-600" },
    { id: "red", name: "Merah", color: "bg-red-600" },
    { id: "orange", name: "Orange", color: "bg-orange-600" },
  ];

  const handleExportData = () => {
    alert("Export data akan segera tersedia!");
  };

  const handleImportData = () => {
    alert("Import data akan segera tersedia!");
  };

  const handleResetSettings = () => {
    setDarkMode(false);
    setNotifications({
      schedule_changes: true,
      email_notifications: false,
      push_notifications: true,
    });
    setLanguage("id");
    setTheme("blue");
    setShowConfirmReset(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sesuaikan aplikasi sesuai preferensi Anda</p>
      </div>

      {/* Appearance Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tampilan</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Atur tema dan warna aplikasi</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Mode Gelap</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktifkan tema gelap untuk kenyamanan mata</p>
              </div>
            </div>

            <button onClick={() => setDarkMode(!darkMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-200"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Warna Tema</label>
            <div className="grid grid-cols-5 gap-3">
              {themes.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(t.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${theme === t.id ? "border-gray-900 dark:border-white" : "border-gray-200 dark:border-gray-700"}`}
                >
                  <div className={`w-full h-12 ${t.color} rounded`}></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">{t.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kelola preferensi notifikasi</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Perubahan Jadwal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notifikasi saat jadwal mengajar berubah</p>
            </div>

            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  schedule_changes: !notifications.schedule_changes,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.schedule_changes ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.schedule_changes ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Email Notifikasi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Terima notifikasi melalui email</p>
            </div>

            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  email_notifications: !notifications.email_notifications,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email_notifications ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email_notifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Push Notifikasi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notifikasi browser dan mobile</p>
            </div>

            <button
              onClick={() =>
                setNotifications({
                  ...notifications,
                  push_notifications: !notifications.push_notifications,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.push_notifications ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push_notifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Language Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bahasa</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pilih bahasa aplikasi</p>
          </div>
        </div>

        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </motion.div>

      {/* Data Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manajemen Data</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Export dan import data aplikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImportData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Import Data
          </motion.button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-red-700 dark:text-red-500">Tindakan berikut bersifat permanen</p>
          </div>
        </div>

        {!showConfirmReset ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Reset Semua Pengaturan
          </motion.button>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">Apakah Anda yakin ingin reset semua pengaturan?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Semua preferensi akan kembali ke pengaturan default.</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowConfirmReset(false)} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button onClick={handleResetSettings} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ya, Reset
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-end">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg font-medium">
          Simpan Semua Pengaturan
        </motion.button>
      </motion.div>
    </div>
  );
}


