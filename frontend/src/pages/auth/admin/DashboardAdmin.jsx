import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import { Users, BookOpen, Calendar, Clock, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { schedulingApi, guruApi, mataPelajaranApi, kelasApi, jamPelajaranApi } from '../../../api/adminApi';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalGuru: 0,
    totalMapel: 0,
    totalKelas: 0,
    totalJam: 0,
  });
  
  const [chartData, setChartData] = useState({
    byHari: [],
    guruBeban: [],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [guruRes, mapelRes, kelasRes, jamRes, scheduleStatsRes] = await Promise.all([
        guruApi.getStatistics(),
        mataPelajaranApi.getStatistics(),
        kelasApi.getStatistics(),
        jamPelajaranApi.getStatistics(),
        schedulingApi.getStatistics({ tahun_ajaran: '2024/2025', semester: 'Ganjil' }),
      ]);

      setStats({
        totalGuru: guruRes.data.data.total_guru,
        totalMapel: mapelRes.data.data.total,
        totalKelas: kelasRes.data.data.total,
        totalJam: jamRes.data.data.jam_efektif,
      });

      const scheduleData = scheduleStatsRes.data.data;
      setChartData({
        byHari: scheduleData.by_hari.map(item => ({
          name: item.hari,
          total: item.total
        })),
        guruBeban: scheduleData.guru_beban.slice(0, 5).map(item => ({
          name: item.guru.name.split(',')[0],
          jam: item.total_jam
        }))
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statCards = [
    { icon: Users, label: 'Total Guru', value: stats.totalGuru, color: 'bg-blue-500', trend: '+0%', description: 'Guru aktif' },
    { icon: BookOpen, label: 'Mata Pelajaran', value: stats.totalMapel, color: 'bg-green-500', trend: '+0%', description: 'Mapel tersedia' },
    { icon: Calendar, label: 'Total Kelas', value: stats.totalKelas, color: 'bg-purple-500', trend: '+0%', description: 'Kelas aktif' },
    { icon: Clock, label: 'Jam Pelajaran', value: stats.totalJam, color: 'bg-orange-500', trend: '+0%', description: 'Jam efektif/hari' },
  ];

  const recentActivities = [
    { action: 'Setup project selesai', time: 'Baru saja', icon: Activity },
    { action: 'Dark mode aktif', time: '1 menit lalu', icon: Activity },
    { action: 'Struktur folder siap', time: '5 menit lalu', icon: Activity },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selamat datang di Sistem Rekomendasi Penjadwalan Mengajar
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {stat.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      {!loading && chartData.byHari.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Distribusi per Hari */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Distribusi Jadwal per Hari
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.byHari}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Pie Chart - Beban Guru */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Beban Mengajar Guru (Top 5)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.guruBeban}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.substring(0, 10)} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="jam"
                  >
                    {chartData.guruBeban.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Status Project - Minggu 5 SELESAI! 🎉
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  ✅ Minggu 1-5 Complete!
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>• Backend Laravel 12 dengan Sanctum</li>
                  <li>• Frontend React + Vite + TailwindCSS</li>
                  <li>• CRUD Data Master (Guru, Mapel, Kelas, Jam)</li>
                  <li>• Algoritma Scheduling (Rule-Based + Greedy)</li>
                  <li>• FullCalendar Integration</li>
                  <li>• Charts & Analytics</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  📋 Next: Minggu 6-8
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Fitur tambahan, testing, dan deployment.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Aktivitas Terbaru
            </h2>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <activity.icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Data Guru', icon: Users, path: '/admin/guru' },
              { label: 'Mata Pelajaran', icon: BookOpen, path: '/admin/mata-pelajaran' },
              { label: 'Kelas', icon: Calendar, path: '/admin/kelas' },
              { label: 'Generate Jadwal', icon: Clock, path: '/admin/jadwal/generate' },
            ].map((action, index) => (
              
              <a
                key={index}
                href={action.path}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
              >
                <action.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardAdmin;