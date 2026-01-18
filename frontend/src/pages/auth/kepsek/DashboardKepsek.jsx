import React from "react";
import { motion } from "framer-motion";
import Card from "../../../components/ui/Card.jsx";
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Users, BookOpen, Clock, FileText, CheckCircle } from "lucide-react";

const DashboardKepsek = () => {
  const summaryStats = [
    {
      label: "Total Guru",
      value: "0",
      icon: Users,
      color: "bg-blue-500",
      change: "+0%",
    },
    {
      label: "Total Kelas",
      value: "0",
      icon: Calendar,
      color: "bg-green-500",
      change: "+0%",
    },
    {
      label: "Mata Pelajaran",
      value: "0",
      icon: BookOpen,
      color: "bg-purple-500",
      change: "+0%",
    },
    {
      label: "Jadwal Aktif",
      value: "0",
      icon: Clock,
      color: "bg-orange-500",
      change: "+0%",
    },
  ];

  const scheduleStatus = [
    { status: "Sudah Terjadwal", count: 0, percentage: 0, color: "bg-green-500" },
    { status: "Menunggu", count: 0, percentage: 0, color: "bg-yellow-500" },
    { status: "Konflik", count: 0, percentage: 0, color: "bg-red-500" },
  ];

  const recentReports = [
    { title: "Laporan Jadwal Bulanan", date: "-", status: "pending" },
    { title: "Analisis Beban Mengajar", date: "-", status: "pending" },
    { title: "Rekapitulasi Ketersediaan", date: "-", status: "pending" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Kepala Sekolah</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor dan analisis penjadwalan mengajar sekolah</p>
        </div>
        <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Download className="h-5 w-5" />
          Export Laporan
        </button>
      </motion.div>

      {/* Summary Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        {summaryStats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-3 ${stat.color} bg-opacity-10 rounded-lg mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</p>
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Status */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Status Penjadwalan</h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Per Hari Ini</span>
            </div>

            <div className="space-y-4">
              {scheduleStatus.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.count}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Informasi:</strong> Statistik penjadwalan akan otomatis terupdate setelah sistem rekomendasi dijalankan (Minggu 4-5)
              </p>
            </div>
          </Card>

          {/* Analytics Chart Placeholder */}
          <Card className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Analisis Beban Mengajar</h2>
            </div>

            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chart akan muncul di sini</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Visualisasi data minggu 6</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Reports & Quick Actions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button disabled className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Lihat Jadwal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Minggu 5</p>
                </div>
              </button>

              <button disabled className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Generate Laporan</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Minggu 6</p>
                </div>
              </button>

              <button disabled className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Analisis Detail</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Minggu 6</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Laporan Terbaru</h2>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{report.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{report.date}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full whitespace-nowrap">Pending</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button disabled className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                Lihat Semua Laporan →
              </button>
            </div>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">Status Sistem</h3>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                  <li>✓ Sistem berjalan normal</li>
                  <li>✓ Database terhubung</li>
                  <li>✓ Backup otomatis aktif</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Information Banner */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Dashboard Analytics Coming Soon</h3>
              <p className="text-blue-100 text-sm">
                Fitur analisis mendalam, visualisasi data interaktif, dan laporan komprehensif akan tersedia di minggu 6. Anda akan dapat memantau efisiensi penjadwalan, beban kerja guru, dan optimasi ruang kelas.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardKepsek;
