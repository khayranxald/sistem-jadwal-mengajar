import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar as CalendarIcon, Download, Filter, Eye } from "lucide-react";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Badge from "../../../../components/ui/Badge";
import Modal from "../../../../components/ui/Modal";
import Loading from "../../../../components/ui/Loading";
import { schedulingApi, kelasApi } from "../../../../api/adminApi";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CalendarView = () => {
  const calendarRef = useRef(null);
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadKelasList();
  }, []);

  useEffect(() => {
    if (selectedKelas) {
      loadJadwal();
    }
  }, [selectedKelas]);

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

  const loadJadwal = async () => {
    setLoading(true);
    try {
      const response = await schedulingApi.getByKelas(selectedKelas);
      const jadwalData = response.data.data;

      // Convert jadwal to FullCalendar events
      const calendarEvents = [];
      const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

      hari.forEach((day, dayIndex) => {
        const schedules = jadwalData[day] || [];
        schedules.forEach((schedule) => {
          calendarEvents.push({
            id: schedule.id,
            title: `${schedule.mata_pelajaran.kode_mapel} - ${schedule.guru.name.split(",")[0]}`,
            start: getEventDateTime(dayIndex, schedule.jam_pelajaran.jam_mulai),
            end: getEventDateTime(dayIndex, schedule.jam_pelajaran.jam_selesai),
            backgroundColor: getColorForMapel(schedule.mata_pelajaran.kode_mapel),
            borderColor: getColorForMapel(schedule.mata_pelajaran.kode_mapel, true),
            extendedProps: {
              mapel: schedule.mata_pelajaran.nama_mapel,
              guru: schedule.guru.name,
              kelas: schedule.kelas?.nama_kelas,
              ruangan: schedule.ruangan,
              hari: day,
              jamMulai: schedule.jam_pelajaran.jam_mulai,
              jamSelesai: schedule.jam_pelajaran.jam_selesai,
            },
          });
        });
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error loading jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventDateTime = (dayIndex, time) => {
    // Week starts from Monday (dayIndex 0)
    const date = new Date();
    const currentDay = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - currentDay + 1 + dayIndex);

    const [hours, minutes] = time.split(":");
    monday.setHours(parseInt(hours), parseInt(minutes), 0);

    return monday.toISOString();
  };

  const getColorForMapel = (kodeMapel, border = false) => {
    const colors = {
      MTK: border ? "#2563eb" : "#3b82f6",
      FIS: border ? "#7c3aed" : "#8b5cf6",
      KIM: border ? "#059669" : "#10b981",
      BIO: border ? "#047857" : "#059669",
      BIN: border ? "#ea580c" : "#f97316",
      BING: border ? "#dc2626" : "#ef4444",
    };
    return colors[kodeMapel] || (border ? "#6b7280" : "#9ca3af");
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsDetailModalOpen(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const kelas = kelasList.find((k) => k.id === parseInt(selectedKelas));

    doc.setFontSize(16);
    doc.text(`Jadwal Pelajaran ${kelas?.nama_kelas || ""}`, 14, 15);
    doc.setFontSize(10);
    doc.text("Tahun Ajaran 2024/2025 - Semester Ganjil", 14, 22);

    const tableData = events.map((event) => [
      event.extendedProps.hari,
      event.extendedProps.jamMulai.substring(0, 5) + " - " + event.extendedProps.jamSelesai.substring(0, 5),
      event.extendedProps.mapel,
      event.extendedProps.guru,
      event.extendedProps.ruangan || "-",
    ]);

    doc.autoTable({
      startY: 28,
      head: [["Hari", "Waktu", "Mata Pelajaran", "Guru", "Ruangan"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`Jadwal_${kelas?.nama_kelas || "Kelas"}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar View</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Jadwal pelajaran dalam tampilan kalender</p>
        </div>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export PDF
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
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
          <Badge variant="info">Week View</Badge>
        </div>
      </Card>

      {/* Calendar */}
      <Card>
        {loading ? (
          <div className="py-12">
            <Loading size="lg" text="Memuat jadwal..." />
          </div>
        ) : (
          <div className="calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              slotMinTime="07:00:00"
              slotMaxTime="16:00:00"
              allDaySlot={false}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              locale="id"
              firstDay={1}
              slotDuration="00:45:00"
              slotLabelInterval="00:45"
              eventContent={(arg) => (
                <div className="p-1 text-xs">
                  <div className="font-semibold">{arg.event.title}</div>
                  <div className="text-[10px] opacity-90">{arg.event.extendedProps.ruangan}</div>
                </div>
              )}
            />
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Keterangan Warna:</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {["MTK", "FIS", "KIM", "BIO", "BIN", "BING"].map((kode) => (
            <div key={kode} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorForMapel(kode) }}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{kode}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Jadwal" size="md">
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mata Pelajaran</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.extendedProps.mapel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Guru</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.extendedProps.guru}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hari</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.extendedProps.hari}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Waktu</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedEvent.extendedProps.jamMulai.substring(0, 5)} - {selectedEvent.extendedProps.jamSelesai.substring(0, 5)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kelas</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.extendedProps.kelas}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ruangan</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedEvent.extendedProps.ruangan || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .calendar-container {
          background: white;
          border-radius: 8px;
        }

        .fc {
          font-family: inherit;
        }

        .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600;
        }

        .fc-button {
          background-color: #3b82f6 !important;
          border: none !important;
          text-transform: capitalize !important;
        }

        .fc-button:hover {
          background-color: #2563eb !important;
        }

        .fc-event {
          border-radius: 4px;
          cursor: pointer;
        }

        .fc-timegrid-slot {
          height: 3rem;
        }

        .dark .calendar-container {
          background: #1f2937;
        }

        .dark .fc {
          color: #f3f4f6;
        }

        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-color: #374151 !important;
        }

        .dark .fc-col-header-cell {
          background-color: #111827 !important;
        }

        .dark .fc-timegrid-slot {
          border-color: #374151 !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
