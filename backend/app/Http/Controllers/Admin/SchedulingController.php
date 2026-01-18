<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SchedulingService;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Jadwal;
use Illuminate\Support\Facades\Validator;

class SchedulingController extends Controller
{
    protected $schedulingService;

    public function __construct(SchedulingService $schedulingService)
    {
        $this->schedulingService = $schedulingService;
    }

    /**
     * Generate jadwal otomatis
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'tahun_ajaran' => 'required|string',
                'semester' => 'required|in:Ganjil,Genap',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $result = $this->schedulingService->generateSchedule($request->only(['tahun_ajaran', 'semester']));

            if (!$result['success']) {
                return ResponseHelper::error($result['message'], $result, 400);
            }

            return ResponseHelper::success($result, 'Jadwal berhasil di-generate');

        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Get jadwal by kelas
     */
    public function getByKelas($kelasId): JsonResponse
    {
        try {
            $jadwal = $this->schedulingService->getJadwalByKelas($kelasId);

            return ResponseHelper::success($jadwal, 'Jadwal kelas berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Get jadwal by guru
     */
    public function getByGuru($guruId): JsonResponse
    {
        try {
            $jadwal = $this->schedulingService->getJadwalByGuru($guruId);

            return ResponseHelper::success($jadwal, 'Jadwal guru berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Get all jadwal with filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Jadwal::with(['kelas', 'mataPelajaran', 'guru', 'jamPelajaran']);

            // Filters
            if ($request->has('kelas_id')) {
                $query->where('kelas_id', $request->kelas_id);
            }

            if ($request->has('guru_id')) {
                $query->where('guru_id', $request->guru_id);
            }

            if ($request->has('hari')) {
                $query->where('hari', $request->hari);
            }

            if ($request->has('tahun_ajaran')) {
                $query->where('tahun_ajaran', $request->tahun_ajaran);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            $query->orderBy('hari')->orderBy('jam_pelajaran_id');

            $perPage = $request->input('per_page', 50);
            $jadwal = $query->paginate($perPage);

            return ResponseHelper::success($jadwal, 'Data jadwal berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Update single jadwal (manual adjustment)
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'guru_id' => 'sometimes|exists:users,id',
                'jam_pelajaran_id' => 'sometimes|exists:jam_pelajaran,id',
                'hari' => 'sometimes|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
                'ruangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $jadwal = Jadwal::findOrFail($id);
            
            // Check conflicts before update
            if ($request->has('guru_id') || $request->has('jam_pelajaran_id') || $request->has('hari')) {
                $guruId = $request->input('guru_id', $jadwal->guru_id);
                $jamId = $request->input('jam_pelajaran_id', $jadwal->jam_pelajaran_id);
                $hari = $request->input('hari', $jadwal->hari);

                // Check guru conflict
                $conflict = Jadwal::where('guru_id', $guruId)
                    ->where('hari', $hari)
                    ->where('jam_pelajaran_id', $jamId)
                    ->where('id', '!=', $id)
                    ->exists();

                if ($conflict) {
                    return ResponseHelper::error('Guru sudah memiliki jadwal pada waktu yang sama', null, 400);
                }
            }

            $jadwal->update($request->only(['guru_id', 'jam_pelajaran_id', 'hari', 'ruangan']));
            $jadwal->load(['kelas', 'mataPelajaran', 'guru', 'jamPelajaran']);

            return ResponseHelper::success($jadwal, 'Jadwal berhasil diupdate');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Jadwal tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Delete jadwal
     */
    public function destroy($id): JsonResponse
    {
        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->delete();

            return ResponseHelper::success(null, 'Jadwal berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Jadwal tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Clear all jadwal
     */
    public function clear(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'tahun_ajaran' => 'required|string',
                'semester' => 'required|in:Ganjil,Genap',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $deleted = Jadwal::where('tahun_ajaran', $request->tahun_ajaran)
                ->where('semester', $request->semester)
                ->delete();

            return ResponseHelper::success(
                ['deleted_count' => $deleted],
                'Jadwal berhasil dihapus'
            );
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Get scheduling statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $tahunAjaran = $request->input('tahun_ajaran', '2024/2025');
            $semester = $request->input('semester', 'Ganjil');

            $stats = [
                'total_jadwal' => Jadwal::where('tahun_ajaran', $tahunAjaran)
                    ->where('semester', $semester)
                    ->count(),
                'by_hari' => Jadwal::selectRaw('hari, count(*) as total')
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->where('semester', $semester)
                    ->groupBy('hari')
                    ->get(),
                'by_kelas' => Jadwal::selectRaw('kelas_id, count(*) as total')
                    ->with('kelas:id,nama_kelas')
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->where('semester', $semester)
                    ->groupBy('kelas_id')
                    ->get(),
                'guru_beban' => Jadwal::selectRaw('guru_id, count(*) as total_jam')
                    ->with('guru:id,name')
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->where('semester', $semester)
                    ->groupBy('guru_id')
                    ->orderByDesc('total_jam')
                    ->limit(10)
                    ->get(),
            ];

            return ResponseHelper::success($stats, 'Statistik jadwal berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}