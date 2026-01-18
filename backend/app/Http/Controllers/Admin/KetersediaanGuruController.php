<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KetersediaanGuru;
use App\Models\User;
use App\Models\JamPelajaran;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class KetersediaanGuruController extends Controller
{
    /**
     * Get ketersediaan by guru
     */
    public function getByGuru($guruId): JsonResponse
    {
        try {
            $guru = User::where('role', 'guru')->findOrFail($guruId);
            
            $ketersediaan = KetersediaanGuru::with(['jamPelajaran'])
                ->where('guru_id', $guruId)
                ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
                ->orderBy('jam_pelajaran_id')
                ->get();

            // Group by hari
            $grouped = $ketersediaan->groupBy('hari');

            return ResponseHelper::success($grouped, 'Ketersediaan guru berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Guru tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Bulk set ketersediaan
     */
    public function bulkSet(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'guru_id' => 'required|exists:users,id',
                'ketersediaan' => 'required|array',
                'ketersediaan.*.hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
                'ketersediaan.*.jam_pelajaran_id' => 'required|exists:jam_pelajaran,id',
                'ketersediaan.*.is_available' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $guruId = $request->guru_id;

            // Clear existing
            KetersediaanGuru::where('guru_id', $guruId)->delete();

            // Insert new
            foreach ($request->ketersediaan as $item) {
                KetersediaanGuru::create([
                    'guru_id' => $guruId,
                    'hari' => $item['hari'],
                    'jam_pelajaran_id' => $item['jam_pelajaran_id'],
                    'is_available' => $item['is_available'],
                    'keterangan' => $item['keterangan'] ?? null,
                ]);
            }

            return ResponseHelper::success(
                null,
                'Ketersediaan guru berhasil disimpan',
                201
            );

        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Toggle single ketersediaan
     */
    public function toggle(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'guru_id' => 'required|exists:users,id',
                'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
                'jam_pelajaran_id' => 'required|exists:jam_pelajaran,id',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $ketersediaan = KetersediaanGuru::firstOrNew([
                'guru_id' => $request->guru_id,
                'hari' => $request->hari,
                'jam_pelajaran_id' => $request->jam_pelajaran_id,
            ]);

            $ketersediaan->is_available = !$ketersediaan->is_available;
            $ketersediaan->save();

            return ResponseHelper::success($ketersediaan, 'Ketersediaan berhasil diupdate');

        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}