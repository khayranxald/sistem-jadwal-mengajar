import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Save, RefreshCw, CheckCircle, XCircle, Calendar } from "lucide-react";
import axios from "../../../api/axios";

const DAYS = [
  { id: 1, name: "Senin" },
  { id: 2, name: "Selasa" },
  { id: 3, name: "Rabu" },
  { id: 4, name: "Kamis" },
  { id: 5, name: "Jumat" },
  { id: 6, name: "Sabtu" },
];

const TIME_SLOTS = [
  { id: 1, jam: "07:00 - 07:45" },
  { id: 2, jam: "07:45 - 08:30" },
  { id: 3, jam: "08:30 - 09:15" },
  { id: 4, jam: "09:15 - 10:00" },
  { id: 5, jam: "10:15 - 11:00" },
  { id: 6, jam: "11:00 - 11:45" },
  { id: 7, jam: "11:45 - 12:30" },
  { id: 8, jam: "12:30 - 13:15" },
  { id: 9, jam: "13:15 - 14:00" },
  { id: 10, jam: "14:00 - 14:45" },
];

export default function KetersediaanGuru() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKetersediaan();
  }, []);

  const fetchKetersediaan = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/guru/ketersediaan");

      // Convert array to object for easier manipulation
      const availabilityMap = {};
      response.data.data.forEach((item) => {
        const key = `${item.hari}-${item.jam_id}`;
        availabilityMap[key] = item.tersedia;
      });

      setAvailability(availabilityMap);
    } catch (err) {
      setError("Gagal memuat data ketersediaan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = (hari, jamId) => {
    const key = `${hari}-${jamId}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllDay = (hari) => {
    const allAvailable = TIME_SLOTS.every((slot) => {
      const key = `${hari}-${slot.id}`;
      return availability[key];
    });

    const newAvailability = { ...availability };
    TIME_SLOTS.forEach((slot) => {
      const key = `${hari}-${slot.id}`;
      newAvailability[key] = !allAvailable;
    });

    setAvailability(newAvailability);
  };

  const toggleAllTime = (jamId) => {
    const allAvailable = DAYS.every((day) => {
      const key = `${day.id}-${jamId}`;
      return availability[key];
    });

    const newAvailability = { ...availability };
    DAYS.forEach((day) => {
      const key = `${day.id}-${jamId}`;
      newAvailability[key] = !allAvailable;
    });

    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Convert object back to array
      const ketersediaanArray = [];
      Object.keys(availability).forEach((key) => {
        const [hari, jamId] = key.split("-");
        ketersediaanArray.push({
          hari: parseInt(hari),
          jam_id: parseInt(jamId),
          tersedia: availability[key] || false,
        });
      });

      await axios.post("/api/guru/ketersediaan", {
        ketersediaan: ketersediaanArray,
      });

      setSuccess("Ketersediaan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan ketersediaan");
    } finally {
      setSaving(false);
    }
  };

  const isAvailable = (hari, jamId) => {
    const key = `${hari}-${jamId}`;
    return availability[key] || false;
  };

  const getAvailabilityStats = () => {
    const total = DAYS.length * TIME_SLOTS.length;
    const available = Object.values(availability).filter((v) => v).length;
    return {
      total,
      available,
      percentage: ((available / total) * 100).toFixed(1),
    };
  };

  const stats = getAvailabilityStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ketersediaan Mengajar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Atur waktu ketersediaan Anda untuk mengajar</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchKetersediaan}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan"}
          </motion.button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {/* Statistics Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Ketersediaan</p>
            <h3 className="text-3xl font-bold mt-1">
              {stats.available} / {stats.total}
            </h3>
            <p className="text-blue-100 text-sm mt-1">{stats.percentage}% slot waktu tersedia</p>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Cara Penggunaan:</h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li>• Klik pada sel untuk menandai waktu tersedia (hijau) atau tidak tersedia (merah)</li>
          <li>• Klik header hari untuk mengatur semua jam pada hari tersebut</li>
          <li>• Klik header jam untuk mengatur semua hari pada jam tersebut</li>
          <li>• Klik tombol "Simpan" untuk menyimpan perubahan</li>
        </ul>
      </div>

      {/* Availability Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Jam / Hari
                  </div>
                </th>
                {DAYS.map((day) => (
                  <th key={day.id} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={() => toggleAllDay(day.id)}>
                    <div className="flex flex-col items-center">
                      <span>{day.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Klik untuk toggle</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, idx) => (
                <tr key={slot.id} className={`border-b border-gray-200 dark:border-gray-700 ${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-inherit cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" onClick={() => toggleAllTime(slot.id)}>
                    <div className="flex flex-col">
                      <span>Jam {slot.id}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{slot.jam}</span>
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const available = isAvailable(day.id, slot.id);
                    return (
                      <td key={`${day.id}-${slot.id}`} className="px-2 py-2 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleAvailability(day.id, slot.id)}
                          className={`w-full h-12 rounded-lg transition-all duration-200 flex items-center justify-center ${available ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
                        >
                          {available ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </motion.button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Tidak Tersedia</span>
        </div>
      </div>
    </div>
  );
}
