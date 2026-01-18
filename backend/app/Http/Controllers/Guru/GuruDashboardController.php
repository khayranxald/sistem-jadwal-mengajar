<?php
// backend/app/Http/Controllers/Guru/GuruDashboardController.php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseHelper;
use App\Models\Jadwal;
use App\Models\KetersediaanGuru;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GuruDashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Total mata pelajaran yang diajar
            $totalMapel = DB::table('guru_mapel')
                ->where('user_id', $user->id)
                ->count();
            
            // Total kelas yang diajar
            $totalKelas = Jadwal::where('user_id', $user->id)
                ->distinct('kelas_id')
                ->count('kelas_id');
            
            // Total jam mengajar minggu ini
            $totalJamMingguIni = Jadwal::where('user_id', $user->id)
                ->whereRaw('WEEK(created_at) = WEEK(NOW())')
                ->count();
            
            // Jadwal hari ini
            $hariIni = now()->locale('id')->dayName;
            $jadwalHariIni = Jadwal::with(['kelas', 'mataPelajaran', 'jamPelajaran'])
                ->where('user_id', $user->id)
                ->where('hari', $hariIni)
                ->orderBy('jam_pelajaran_id')
                ->get();
            
            // Ketersediaan yang belum diisi
            $ketersediaanBelumDiisi = KetersediaanGuru::where('user_id', $user->id)
                ->whereNull('status')
                ->orWhere('status', '')
                ->count();

            return ResponseHelper::success([
                'statistik' => [
                    'total_mapel' => $totalMapel,
                    'total_kelas' => $totalKelas,
                    'total_jam_minggu_ini' => $totalJamMingguIni,
                    'ketersediaan_belum_diisi' => $ketersediaanBelumDiisi,
                ],
                'jadwal_hari_ini' => $jadwalHariIni,
                'nama_guru' => $user->name,
            ], 'Data dashboard berhasil diambil');
            
        } catch (\Exception $e) {
            return ResponseHelper::error('Gagal mengambil data dashboard: ' . $e->getMessage(), 500);
        }
    }
    
    public function jadwal()
    {
        try {
            $user = Auth::user();
            
            $jadwal = Jadwal::with(['kelas', 'mataPelajaran', 'jamPelajaran'])
                ->where('user_id', $user->id)
                ->orderBy('hari')
                ->orderBy('jam_pelajaran_id')
                ->get();
            
            // Grouping by hari
            $jadwalPerHari = $jadwal->groupBy('hari');
            
            return ResponseHelper::success([
                'jadwal' => $jadwalPerHari,
            ], 'Data jadwal berhasil diambil');
            
        } catch (\Exception $e) {
            return ResponseHelper::error('Gagal mengambil data jadwal: ' . $e->getMessage(), 500);
        }
    }
    
    public function ketersediaan()
    {
        try {
            $user = Auth::user();
            
            $ketersediaan = KetersediaanGuru::with('jamPelajaran')
                ->where('user_id', $user->id)
                ->orderBy('hari')
                ->orderBy('jam_pelajaran_id')
                ->get();
            
            return ResponseHelper::success([
                'ketersediaan' => $ketersediaan,
            ], 'Data ketersediaan berhasil diambil');
            
        } catch (\Exception $e) {
            return ResponseHelper::error('Gagal mengambil data ketersediaan: ' . $e->getMessage(), 500);
        }
    }
    
    public function updateKetersediaan(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'ketersediaan' => 'required|array',
                'ketersediaan.*.id' => 'required|exists:ketersediaan_guru,id',
                'ketersediaan.*.status' => 'required|in:tersedia,tidak_tersedia',
            ]);
            
            DB::beginTransaction();
            
            foreach ($validated['ketersediaan'] as $item) {
                KetersediaanGuru::where('id', $item['id'])
                    ->where('user_id', $user->id)
                    ->update(['status' => $item['status']]);
            }
            
            DB::commit();
            
            return ResponseHelper::success(null, 'Ketersediaan berhasil diperbarui');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseHelper::error('Gagal memperbarui ketersediaan: ' . $e->getMessage(), 500);
        }
    }
}