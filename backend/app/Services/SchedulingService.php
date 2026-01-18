<?php

namespace App\Services;

use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\User;
use App\Models\JamPelajaran;
use App\Models\Jadwal;
use App\Models\KetersediaanGuru;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SchedulingService
{
    protected $tahunAjaran;
    protected $semester;
    protected $hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    protected $conflicts = [];
    protected $statistics = [];

    public function __construct()
    {
        $this->tahunAjaran = '2024/2025';
        $this->semester = 'Ganjil';
    }

    /**
     * Generate jadwal untuk semua kelas
     */
    public function generateSchedule($params = [])
    {
        $this->tahunAjaran = $params['tahun_ajaran'] ?? '2024/2025';
        $this->semester = $params['semester'] ?? 'Ganjil';
        $this->conflicts = [];
        $this->statistics = [
            'total_scheduled' => 0,
            'conflicts' => 0,
            'success_rate' => 0,
        ];

        DB::beginTransaction();
        
        try {
            // Clear existing schedule
            $this->clearExistingSchedule();

            // Get all data
            $kelasList = Kelas::with(['waliKelas'])->where('is_active', true)->get();
            $jamList = JamPelajaran::where('is_active', true)
                ->where('is_istirahat', false)
                ->orderBy('urutan')
                ->get();
            
            if ($kelasList->isEmpty() || $jamList->isEmpty()) {
                throw new \Exception('Data kelas atau jam pelajaran tidak tersedia');
            }

            // Generate schedule for each class
            foreach ($kelasList as $kelas) {
                $this->generateScheduleForKelas($kelas, $jamList);
            }

            DB::commit();

            $this->calculateStatistics();

            return [
                'success' => true,
                'message' => 'Jadwal berhasil di-generate',
                'statistics' => $this->statistics,
                'conflicts' => $this->conflicts,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Scheduling error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Gagal generate jadwal: ' . $e->getMessage(),
                'conflicts' => $this->conflicts,
            ];
        }
    }

    /**
     * Generate jadwal untuk satu kelas
     */
    protected function generateScheduleForKelas($kelas, $jamList)
    {
        // Get mata pelajaran untuk kelas ini berdasarkan jurusan
        $mataPelajaranList = $this->getMataPelajaranForKelas($kelas);

        if ($mataPelajaranList->isEmpty()) {
            $this->conflicts[] = [
                'type' => 'no_subjects',
                'message' => "Tidak ada mata pelajaran untuk kelas {$kelas->nama_kelas}",
            ];
            return;
        }

        // Siapkan slot scheduling (hari x jam)
        $slots = $this->prepareTimeSlots($jamList);

        // Sort mata pelajaran by jumlah jam (descending) - Greedy approach
        $mataPelajaranList = $mataPelajaranList->sortByDesc('jumlah_jam_perminggu');

        // Assign setiap mata pelajaran ke slot yang available
        foreach ($mataPelajaranList as $mapel) {
            $this->assignMataPelajaran($kelas, $mapel, $slots, $jamList);
        }
    }

    /**
     * Get mata pelajaran untuk kelas tertentu
     */
    protected function getMataPelajaranForKelas($kelas)
    {
        $query = MataPelajaran::where('is_active', true);

        // Filter berdasarkan tingkat dan jurusan
        // Semua kelas dapat: Wajib + Muatan Lokal
        // Kelas IPA: + Peminatan IPA (Fisika, Kimia, Biologi)
        // Kelas IPS: + Peminatan IPS (Sejarah, Geografi, Ekonomi, Sosiologi)

        return $query->get()->filter(function($mapel) use ($kelas) {
            if ($mapel->jenis === 'wajib' || $mapel->jenis === 'muatan_lokal') {
                return true;
            }

            if ($mapel->jenis === 'peminatan') {
                if ($kelas->jurusan === 'IPA' && in_array($mapel->kode_mapel, ['FIS', 'KIM', 'BIO'])) {
                    return true;
                }
                if ($kelas->jurusan === 'IPS' && in_array($mapel->kode_mapel, ['SEJ', 'GEO', 'EKO', 'SOS'])) {
                    return true;
                }
            }

            return false;
        });
    }

    /**
     * Prepare time slots (hari x jam)
     */
    protected function prepareTimeSlots($jamList)
    {
        $slots = [];
        
        foreach ($this->hari as $hari) {
            $slots[$hari] = [];
            foreach ($jamList as $jam) {
                $slots[$hari][$jam->id] = [
                    'available' => true,
                    'jam' => $jam,
                ];
            }
        }

        return $slots;
    }

    /**
     * Assign mata pelajaran ke slot
     */
    protected function assignMataPelajaran($kelas, $mapel, &$slots, $jamList)
    {
        $jumlahJam = $mapel->jumlah_jam_perminggu;
        $assigned = 0;

        // Get guru yang bisa mengajar mapel ini
        $guruList = $mapel->guru()->where('is_active', true)->get();

        if ($guruList->isEmpty()) {
            $this->conflicts[] = [
                'type' => 'no_teacher',
                'message' => "Tidak ada guru untuk {$mapel->nama_mapel} di kelas {$kelas->nama_kelas}",
                'kelas' => $kelas->nama_kelas,
                'mapel' => $mapel->nama_mapel,
            ];
            return;
        }

        // Pilih guru dengan beban paling sedikit (Greedy)
        $guru = $this->selectBestGuru($guruList);

        // Try to assign ke slot yang available
        foreach ($this->hari as $hari) {
            if ($assigned >= $jumlahJam) break;

            foreach ($slots[$hari] as $jamId => $slot) {
                if ($assigned >= $jumlahJam) break;
                
                if (!$slot['available']) continue;

                // Check conflicts (Rule-Based)
                if ($this->hasConflict($guru, $kelas, $hari, $jamId)) {
                    continue;
                }

                // Assign jadwal
                try {
                    Jadwal::create([
                        'kelas_id' => $kelas->id,
                        'mata_pelajaran_id' => $mapel->id,
                        'guru_id' => $guru->id,
                        'hari' => $hari,
                        'jam_pelajaran_id' => $jamId,
                        'ruangan' => $kelas->ruangan,
                        'semester' => $this->semester,
                        'tahun_ajaran' => $this->tahunAjaran,
                        'is_active' => true,
                    ]);

                    $slots[$hari][$jamId]['available'] = false;
                    $assigned++;
                    $this->statistics['total_scheduled']++;

                } catch (\Exception $e) {
                    // Conflict pada database level
                    continue;
                }
            }
        }

        // Check jika tidak semua jam bisa diassign
        if ($assigned < $jumlahJam) {
            $this->conflicts[] = [
                'type' => 'insufficient_slots',
                'message' => "Tidak cukup slot untuk {$mapel->nama_mapel} di kelas {$kelas->nama_kelas}",
                'kelas' => $kelas->nama_kelas,
                'mapel' => $mapel->nama_mapel,
                'required' => $jumlahJam,
                'assigned' => $assigned,
            ];
            $this->statistics['conflicts']++;
        }
    }

    /**
     * Select guru dengan beban paling sedikit
     */
    protected function selectBestGuru($guruList)
    {
        $bestGuru = null;
        $minLoad = PHP_INT_MAX;

        foreach ($guruList as $guru) {
            $load = Jadwal::where('guru_id', $guru->id)
                ->where('tahun_ajaran', $this->tahunAjaran)
                ->where('semester', $this->semester)
                ->count();

            if ($load < $minLoad) {
                $minLoad = $load;
                $bestGuru = $guru;
            }
        }

        return $bestGuru ?? $guruList->first();
    }

    /**
     * Check conflict (Rule-Based Constraints)
     */
    protected function hasConflict($guru, $kelas, $hari, $jamId)
    {
        // Check 1: Guru tidak bisa mengajar di 2 kelas berbeda pada jam yang sama
        $guruConflict = Jadwal::where('guru_id', $guru->id)
            ->where('hari', $hari)
            ->where('jam_pelajaran_id', $jamId)
            ->where('tahun_ajaran', $this->tahunAjaran)
            ->where('semester', $this->semester)
            ->exists();

        if ($guruConflict) {
            return true;
        }

        // Check 2: Kelas tidak bisa punya 2 mapel berbeda pada jam yang sama
        $kelasConflict = Jadwal::where('kelas_id', $kelas->id)
            ->where('hari', $hari)
            ->where('jam_pelajaran_id', $jamId)
            ->where('tahun_ajaran', $this->tahunAjaran)
            ->where('semester', $this->semester)
            ->exists();

        if ($kelasConflict) {
            return true;
        }

        // Check 3: Ketersediaan guru (jika ada data ketersediaan)
        $availability = KetersediaanGuru::where('guru_id', $guru->id)
            ->where('hari', $hari)
            ->where('jam_pelajaran_id', $jamId)
            ->first();

        if ($availability && !$availability->is_available) {
            return true;
        }

        return false;
    }

    /**
     * Clear existing schedule
     */
    protected function clearExistingSchedule()
    {
        Jadwal::where('tahun_ajaran', $this->tahunAjaran)
            ->where('semester', $this->semester)
            ->delete();
    }

    /**
     * Calculate statistics
     */
    protected function calculateStatistics()
    {
        $totalRequired = MataPelajaran::where('is_active', true)
            ->sum('jumlah_jam_perminggu') * Kelas::where('is_active', true)->count();

        $this->statistics['success_rate'] = $totalRequired > 0 
            ? round(($this->statistics['total_scheduled'] / $totalRequired) * 100, 2)
            : 0;
    }

    /**
     * Get jadwal by kelas
     */
    public function getJadwalByKelas($kelasId)
    {
        $jadwal = Jadwal::with(['mataPelajaran', 'guru', 'jamPelajaran'])
            ->where('kelas_id', $kelasId)
            ->where('tahun_ajaran', $this->tahunAjaran)
            ->where('semester', $this->semester)
            ->orderBy('hari')
            ->orderBy('jam_pelajaran_id')
            ->get();

        return $this->formatJadwalToWeekly($jadwal);
    }

    /**
     * Get jadwal by guru
     */
    public function getJadwalByGuru($guruId)
    {
        $jadwal = Jadwal::with(['kelas', 'mataPelajaran', 'jamPelajaran'])
            ->where('guru_id', $guruId)
            ->where('tahun_ajaran', $this->tahunAjaran)
            ->where('semester', $this->semester)
            ->orderBy('hari')
            ->orderBy('jam_pelajaran_id')
            ->get();

        return $this->formatJadwalToWeekly($jadwal);
    }

    /**
     * Format jadwal to weekly structure
     */
    protected function formatJadwalToWeekly($jadwal)
    {
        $weekly = [];

        foreach ($this->hari as $hari) {
            $weekly[$hari] = $jadwal->filter(function($j) use ($hari) {
                return $j->hari === $hari;
            })->values();
        }

        return $weekly;
    }
}