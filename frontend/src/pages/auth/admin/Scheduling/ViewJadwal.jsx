import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen, Download } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Badge from "../../../../components/ui/Badge";
import Loading from "../../../../components/ui/Loading";
import { schedulingApi, kelasApi } from "../../../../api/adminApi";

const ViewJadwal = () => {
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(false);

  const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  useEffect(() => {
    loadKelasList();
  }, []);

  const loadKelasList = async () => {
    try {
      const response = await kelasApi.getAll({ per_page: 100 });
      setKelasList(response.data.data.data);

      if (response.data.data.data.length > 0) {
        setSelectedKelas(response.data.data.data[0].id);
      }
    } catch (error) {
      console.error("Error loading kelas:", error);
    }
  };

  useEffect(() => {
    if (selectedKelas) {
      loadJadwal();
    }
  }, [selectedKelas]);

  const loadJadwal = async () => {
    setLoading(true);
    try {
      const response = await schedulingApi.getByKelas(selectedKelas);
      setJadwal(response.data.data);
    } catch (error) {
      console.error("Error loading jadwal:", error);
      setJadwal(null);
    } finally {
      setLoading(false);
    }
  };

  const getColorForMapel = (kodeMapel) => {
    const colors = {
      MTK: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      FIS: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
      KIM: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700",
      BIO: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
      BIN: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700",
      BING: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
      default: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    };
    return colors[kodeMapel] || colors.default;
  };

  const getKelasName = () => {
    const kelas = kelasList.find((k) => k.id === parseInt(selectedKelas));
    return kelas?.nama_kelas || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Jadwal Pelajaran</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Lihat jadwal pelajaran per kelas</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export PDF
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Kelas</label>
            <select value={selectedKelas || ""} onChange={(e) => setSelectedKelas(e.target.value)} className="input max-w-xs">
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <div className="py-12">
            <Loading size="lg" text="Memuat jadwal..." />
          </div>
        </Card>
      )}

      {/* No Data */}
      {!loading && jadwal && Object.values(jadwal).every((day) => day.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Belum ada jadwal untuk kelas ini</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Generate jadwal terlebih dahulu</p>
          </div>
        </Card>
      )}

      {/* Jadwal Table */}
      {!loading && jadwal && Object.values(jadwal).some((day) => day.length > 0) && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Jadwal Kelas {getKelasName()}</h2>
            <Badge variant="primary">Tahun Ajaran 2024/2025 - Ganjil</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-32">Jam</th>
                  {hari.map((h) => (
                    <th key={h} className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, jamIndex) => {
                  const jamKe = jamIndex + 1;

                  return (
                    <tr key={jamKe} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Jam {jamKe}</span>
                        </div>
                      </td>

                      {hari.map((h) => {
                        const scheduleForDay = jadwal[h] || [];
                        const scheduleForJam = scheduleForDay.find((s) => s.jam_pelajaran.urutan === jamKe);

                        return (
                          <td key={h} className="border border-gray-200 dark:border-gray-700 p-2">
                            {scheduleForJam ? (
                              <div className={`p-3 rounded-lg border-2 ${getColorForMapel(scheduleForJam.mata_pelajaran.kode_mapel)}`}>
                                <div className="font-semibold text-sm mb-1 flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {scheduleForJam.mata_pelajaran.kode_mapel}
                                </div>
                                <div className="text-xs opacity-90 flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {scheduleForJam.guru.name.split(",")[0]}
                                </div>
                                {scheduleForJam.ruangan && <div className="text-xs opacity-75 mt-1">📍 {scheduleForJam.ruangan}</div>}
                              </div>
                            ) : (
                              <div className="h-20 flex items-center justify-center text-gray-300 dark:text-gray-600">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Keterangan:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["MTK", "FIS", "KIM", "BIO", "BIN", "BING"].map((kode) => (
                <div key={kode} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 ${getColorForMapel(kode)}`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{kode}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ViewJadwal;
