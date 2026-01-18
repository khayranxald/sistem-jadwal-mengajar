<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KetersediaanGuru;
use App\Models\JamPelajaran;
use Illuminate\Support\Facades\DB;

class KetersediaanGuruController extends Controller
{
    /**
     * Get ketersediaan for authenticated guru
     */
    public function index(Request $request)
    {
        try {
            // Make sure user is a guru
            if ($request->user()->role !== 'guru') {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            $ketersediaan = KetersediaanGuru::where('guru_id', $request->user()->id)
                ->get();

            // If no data exists, create default (all available)
            if ($ketersediaan->isEmpty()) {
                $jamPelajaran = JamPelajaran::all();
                $defaultData = [];

                for ($hari = 1; $hari <= 6; $hari++) {
                    foreach ($jamPelajaran as $jam) {
                        $defaultData[] = [
                            'guru_id' => $request->user()->id,
                            'hari' => $hari,
                            'jam_id' => $jam->id,
                            'tersedia' => true,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }

                KetersediaanGuru::insert($defaultData);
                $ketersediaan = KetersediaanGuru::where('guru_id', $request->user()->id)->get();
            }

            return response()->json([
                'success' => true,
                'data' => $ketersediaan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat ketersediaan'
            ], 500);
        }
    }

    /**
     * Update ketersediaan
     */
    public function store(Request $request)
    {
        try {
            // Make sure user is a guru
            if ($request->user()->role !== 'guru') {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak'
                ], 403);
            }

            $validated = $request->validate([
                'ketersediaan' => 'required|array',
                'ketersediaan.*.hari' => 'required|integer|between:1,6',
                'ketersediaan.*.jam_id' => 'required|exists:jam_pelajaran,id',
                'ketersediaan.*.tersedia' => 'required|boolean'
            ]);

            DB::beginTransaction();

            // Delete existing ketersediaan
            KetersediaanGuru::where('guru_id', $request->user()->id)->delete();

            // Insert new ketersediaan
            $ketersediaanData = [];
            foreach ($validated['ketersediaan'] as $item) {
                $ketersediaanData[] = [
                    'guru_id' => $request->user()->id,
                    'hari' => $item['hari'],
                    'jam_id' => $item['jam_id'],
                    'tersedia' => $item['tersedia'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            KetersediaanGuru::insert($ketersediaanData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ketersediaan berhasil diperbarui'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui ketersediaan'
            ], 500);
        }
    }
}