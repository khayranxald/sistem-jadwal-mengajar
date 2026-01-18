import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, AlertCircle, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Loading from "../../../../components/ui/Loading";
import Badge from "../../../../components/ui/Badge";
import Modal from "../../../../components/ui/Modal";
import { schedulingApi } from "../../../../api/adminApi";

const GenerateJadwal = () => {
  const [formData, setFormData] = useState({
    tahun_ajaran: "2024/2025",
    semester: "Ganjil",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await schedulingApi.generate(formData);

      if (response.data.status === "success") {
        setResult(response.data.data);
        loadStatistics();
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert(error.response?.data?.message || "Gagal generate jadwal");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);

    try {
      const response = await schedulingApi.clear(formData);

      if (response.data.status === "success") {
        alert(`${response.data.data.deleted_count} jadwal berhasil dihapus`);
        setResult(null);
        setStatistics(null);
        setShowClearModal(false);
      }
    } catch (error) {
      console.error("Error clearing schedule:", error);
      alert(error.response?.data?.message || "Gagal menghapus jadwal");
    } finally {
      setIsClearing(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await schedulingApi.getStatistics(formData);
      setStatistics(response.data.data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Generate Jadwal Otomatis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sistem akan membuat jadwal secara otomatis menggunakan algoritma Rule-Based & Greedy</p>
      </div>

      {/* Configuration Card */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Konfigurasi Jadwal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input label="Tahun Ajaran" name="tahun_ajaran" value={formData.tahun_ajaran} onChange={handleFormChange} placeholder="2024/2025" required />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
            <select name="semester" value={formData.semester} onChange={handleFormChange} className="input" required>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowConfirmModal(true)} disabled={isGenerating || isClearing} className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Generate Jadwal
          </Button>

          <Button variant="danger" onClick={() => setShowClearModal(true)} disabled={isGenerating || isClearing} className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Hapus Jadwal
          </Button>
        </div>
      </Card>

      {/* Loading */}
      {isGenerating && (
        <Card>
          <div className="py-12">
            <Loading size="lg" text="Sedang generate jadwal..." />
            <p className="text-center text-sm text-gray-500 mt-4">Proses ini membutuhkan waktu 2-5 detik</p>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && !isGenerating && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={result.success ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{result.message}</h3>

                {result.statistics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Terjadwal</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.statistics.total_scheduled}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.statistics.success_rate}%</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Konflik</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.statistics.conflicts}</p>
                    </div>
                  </div>
                )}

                {/* Conflicts */}
                {result.conflicts && result.conflicts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Konflik yang Terdeteksi:</h4>
                    <div className="space-y-2">
                      {result.conflicts.map((conflict, index) => (
                        <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800 dark:text-yellow-300">
                              <p className="font-semibold">{conflict.type}</p>
                              <p>{conflict.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Hari */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribusi per Hari</h3>
            </div>
            <div className="space-y-3">
              {statistics.by_hari.map((item) => (
                <div key={item.hari} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.hari}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(item.total / statistics.total_jadwal) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-12 text-right">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Guru Beban */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Beban Mengajar Guru (Top 5)</h3>
            </div>
            <div className="space-y-3">
              {statistics.guru_beban.slice(0, 5).map((item) => (
                <div key={item.guru_id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{item.guru.name}</span>
                  <Badge variant="info">{item.total_jam} jam</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold mb-1">Cara Kerja Algoritma:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>Rule-Based:</strong> Memastikan tidak ada konflik (guru/kelas bersamaan)
              </li>
              <li>
                <strong>Greedy:</strong> Prioritaskan mapel dengan jam terbanyak
              </li>
              <li>
                <strong>Optimasi:</strong> Distribusi merata beban mengajar guru
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Confirm Generate Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Konfirmasi Generate Jadwal" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Proses ini akan menghapus jadwal lama (jika ada) dan membuat jadwal baru untuk:</p>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm">
              <strong>Tahun Ajaran:</strong> {formData.tahun_ajaran}
            </p>
            <p className="text-sm mt-1">
              <strong>Semester:</strong> {formData.semester}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin melanjutkan?</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Batal
            </Button>
            <Button variant="primary" onClick={handleGenerate} className="flex-1" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Ya, Generate"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Clear Modal */}
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Konfirmasi Hapus Jadwal" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Anda akan menghapus semua jadwal untuk:</p>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Tahun Ajaran:</strong> {formData.tahun_ajaran}
            </p>
            <p className="text-sm mt-1 text-red-800 dark:text-red-300">
              <strong>Semester:</strong> {formData.semester}
            </p>
          </div>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowClearModal(false)} className="flex-1">
              Batal
            </Button>
            <Button variant="danger" onClick={handleClear} className="flex-1" disabled={isClearing}>
              {isClearing ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GenerateJadwal;
