import React from "react";
import { motion } from "framer-motion";
import Card from "../../../components/ui/Card.jsx";
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle, User } from "lucide-react";

const DashboardGuru = () => {
  const teacherInfo = {
    name: "Nama Guru",
    nip: "-",
    subject: "Mata Pelajaran",
    totalClasses: 0,
    totalHours: 0,
  };

  const schedule = [
    { day: "Senin", classes: 0 },
    { day: "Selasa", classes: 0 },
    { day: "Rabu", classes: 0 },
    { day: "Kamis", classes: 0 },
    { day: "Jumat", classes: 0 },
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Guru</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola jadwal mengajar dan ketersediaan Anda</p>
      </motion.div>

      {/* Teacher Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{teacherInfo.name}</h2>
              <p className="text-primary-100 mt-1">NIP: {teacherInfo.nip}</p>
              <p className="text-primary-100">Pengampu: {teacherInfo.subject}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{teacherInfo.totalClasses}</div>
              <div className="text-sm text-primary-100">Total Kelas</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="text-center">
            <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{teacherInfo.totalClasses}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelas Diampu</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Data akan muncul minggu 4</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="text-center">
            <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
              <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{teacherInfo.totalHours}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Jam Mengajar/Minggu</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Dihitung otomatis</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="text-center">
            <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mata Pelajaran</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Setup di minggu 3</p>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Jadwal Minggu Ini</h2>
            </div>

            <div className="space-y-2">
              {schedule.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{day.day}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{day.classes} kelas</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-semibold mb-1">Belum Ada Jadwal</p>
                  <p>Jadwal mengajar akan ditampilkan setelah sistem penjadwalan dijalankan (Minggu 5)</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Availability Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Status Ketersediaan</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📋 Fitur Ketersediaan</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">Anda dapat mengatur jam dan hari ketersediaan mengajar di minggu ke-3</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ketersediaan Terdaftar</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">0 slot</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Jam Terisi</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">0 jam</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Jam Kosong</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">0 jam</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Information Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Informasi Penting</h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
                <li>• Dashboard ini akan menampilkan jadwal mengajar Anda setelah sistem aktif</li>
                <li>• Anda dapat melihat dan mengatur ketersediaan mengajar</li>
                <li>• Notifikasi perubahan jadwal akan muncul di sini</li>
                <li>• Fitur lengkap akan tersedia di minggu 5-6</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardGuru;
