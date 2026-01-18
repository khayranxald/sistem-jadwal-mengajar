// frontend/src/pages/guru/JadwalGuru.jsx
import { useState, useEffect } from "react";
import { getJadwalGuru } from "../../../api/guruApi";
import Card from "../../../components/ui/Card";
import Loading from "../../../components/ui/Loading";
import Badge from "../../../components/ui/Badge";

export default function JadwalGuru() {
  const [loading, setLoading] = useState(true);
  const [jadwal, setJadwal] = useState({});
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'calendar'
  const [selectedDay, setSelectedDay] = useState("Senin");

  const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const response = await getJadwalGuru();
      setJadwal(response.data.jadwal || {});
    } catch (error) {
      console.error("Error fetching jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportJadwal = () => {
    // TODO: Implement export functionality
    alert("Fitur export akan segera hadir");
  };

  const printJadwal = () => {
    window.print();
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jadwal Mengajar Saya</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Lihat jadwal mengajar Anda</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {viewMode === "table" ? (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Kalender</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Tabel</span>
              </span>
            )}
          </button>
          <button onClick={printJadwal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Cetak</span>
            </span>
          </button>
          <button onClick={exportJadwal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </span>
          </button>
        </div>
      </div>

      {/* View Mode: Table */}
      {viewMode === "table" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jam</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Get all unique jam pelajaran */}
                {Array.from(
                  new Set(
                    Object.values(jadwal)
                      .flat()
                      .map((j) => j.jam_pelajaran?.jam_ke)
                      .filter(Boolean)
                  )
                )
                  .sort((a, b) => a - b)
                  .map((jamKe) => (
                    <tr key={jamKe}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Jam {jamKe}</td>
                      {daysOfWeek.map((day) => {
                        const jadwalItem = jadwal[day]?.find((j) => j.jam_pelajaran?.jam_ke === jamKe);
                        return (
                          <td key={day} className="px-6 py-4 whitespace-nowrap">
                            {jadwalItem ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900 dark:text-white">{jadwalItem.mata_pelajaran?.nama}</div>
                                <div className="text-gray-500 dark:text-gray-400">Kelas {jadwalItem.kelas?.nama}</div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  {jadwalItem.jam_pelajaran?.waktu_mulai} - {jadwalItem.jam_pelajaran?.waktu_selesai}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-600">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {Object.keys(jadwal).length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Belum ada jadwal tersedia</p>
            </div>
          )}
        </Card>
      )}

      {/* View Mode: Calendar */}
      {viewMode === "calendar" && (
        <div className="space-y-4">
          {/* Day Selector */}
          <Card>
            <div className="flex items-center space-x-2 overflow-x-auto">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedDay === day ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>

          {/* Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jadwal[selectedDay]?.length > 0 ? (
              jadwal[selectedDay].map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-xs font-medium">Jam</div>
                          <div className="text-xl font-bold">{item.jam_pelajaran?.jam_ke}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{item.mata_pelajaran?.nama}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Kelas {item.kelas?.nama}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item.jam_pelajaran?.waktu_mulai} - {item.jam_pelajaran?.waktu_selesai}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge variant="success">Terjadwal</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <Card>
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Tidak ada jadwal untuk hari {selectedDay}</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
