import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, Printer, FileSpreadsheet, CheckCircle } from "lucide-react";
import axios from "../api/axios";

const EXPORT_FORMATS = [
  {
    id: "pdf",
    name: "PDF Document",
    icon: FileText,
    description: "Format standar untuk print & share",
    color: "red",
  },
  {
    id: "excel",
    name: "Excel Spreadsheet",
    icon: FileSpreadsheet,
    description: "Format untuk edit lebih lanjut",
    color: "green",
  },
  {
    id: "print",
    name: "Print Preview",
    icon: Printer,
    description: "Langsung print dari browser",
    color: "blue",
  },
];

const EXPORT_TYPES = [
  { id: "per-guru", name: "Jadwal Per Guru", description: "Jadwal mengajar setiap guru" },
  { id: "per-kelas", name: "Jadwal Per Kelas", description: "Jadwal pelajaran setiap kelas" },
  { id: "lengkap", name: "Jadwal Lengkap", description: "Semua jadwal dalam satu file" },
];

export default function ExportModal({ isOpen, onClose, type = "schedule" }) {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedType, setSelectedType] = useState("lengkap");
  const [loading, setLoading] = useState(false);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      if (selectedFormat === "print") {
        // Open print preview
        const response = await axios.get(`/api/admin/jadwal/export/print`, {
          params: {
            type: selectedType,
            details: includeDetails,
            statistics: includeStatistics,
          },
        });

        // Open print window
        const printWindow = window.open("", "_blank");
        printWindow.document.write(response.data);
        printWindow.document.close();
        printWindow.print();

        onClose();
        return;
      }

      // Download file
      const response = await axios.get(`/api/admin/jadwal/export/${selectedFormat}`, {
        params: {
          type: selectedType,
          details: includeDetails,
          statistics: includeStatistics,
        },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const extension = selectedFormat === "excel" ? "xlsx" : "pdf";
      link.setAttribute("download", `jadwal-${selectedType}-${Date.now()}.${extension}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      onClose();
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export jadwal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

          {/* Modal */}
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Jadwal</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pilih format dan tipe export yang diinginkan</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pilih Format Export</label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPORT_FORMATS.map((format) => {
                      const Icon = format.icon;
                      const isSelected = selectedFormat === format.id;

                      return (
                        <motion.button
                          key={format.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />

                          <h3 className={`font-semibold text-sm ${isSelected ? "text-blue-900 dark:text-blue-400" : "text-gray-900 dark:text-gray-300"}`}>{format.name}</h3>

                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{format.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tipe Jadwal</label>
                  <div className="space-y-2">
                    {EXPORT_TYPES.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedType === type.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-semibold ${selectedType === type.id ? "text-blue-900 dark:text-blue-400" : "text-gray-900 dark:text-gray-300"}`}>{type.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{type.description}</p>
                          </div>
                          {selectedType === type.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Opsi Tambahan</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input type="checkbox" checked={includeDetails} onChange={(e) => setIncludeDetails(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Sertakan Detail Lengkap</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Termasuk nama guru, ruangan, dan keterangan</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input type="checkbox" checked={includeStatistics} onChange={(e) => setIncludeStatistics(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Sertakan Statistik</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total jam, beban mengajar, dll</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <button onClick={onClose} className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Batal
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {loading ? "Exporting..." : "Export Sekarang"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
