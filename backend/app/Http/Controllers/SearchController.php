<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MataPelajaran;
use App\Models\Kelas;
use App\Models\JamPelajaran;
use App\Models\Jadwal;

class SearchController extends Controller
{
    /**
     * Global search across multiple entities
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '');
            
            if (strlen($query) < 2) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            $results = [];

            // Search Guru
            $guru = User::where('role', 'guru')
                ->where(function($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                })
                ->limit(5)
                ->get();

            foreach ($guru as $g) {
                $results[] = [
                    'id' => $g->id,
                    'category' => 'guru',
                    'title' => $g->nama,
                    'subtitle' => $g->email
                ];
            }

            // Search Mata Pelajaran
            $mapel = MataPelajaran::where(function($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%")
                      ->orWhere('kode', 'like', "%{$query}%");
                })
                ->limit(5)
                ->get();

            foreach ($mapel as $m) {
                $results[] = [
                    'id' => $m->id,
                    'category' => 'mapel',
                    'title' => $m->nama,
                    'subtitle' => $m->kode . ' - ' . $m->kategori
                ];
            }

            // Search Kelas
            $kelas = Kelas::where(function($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%")
                      ->orWhere('tingkat', 'like', "%{$query}%");
                })
                ->limit(5)
                ->get();

            foreach ($kelas as $k) {
                $results[] = [
                    'id' => $k->id,
                    'category' => 'kelas',
                    'title' => $k->nama,
                    'subtitle' => 'Tingkat ' . $k->tingkat . ' - ' . $k->jurusan
                ];
            }

            // Search Jam Pelajaran
            $jam = JamPelajaran::where('jam', 'like', "%{$query}%")
                ->limit(5)
                ->get();

            foreach ($jam as $j) {
                $results[] = [
                    'id' => $j->id,
                    'category' => 'jam',
                    'title' => 'Jam ' . $j->urutan,
                    'subtitle' => $j->jam
                ];
            }

            // Search Jadwal (by guru or mapel name)
            $jadwal = Jadwal::with(['guru', 'mataPelajaran', 'kelas'])
                ->whereHas('guru', function($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%");
                })
                ->orWhereHas('mataPelajaran', function($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%");
                })
                ->limit(5)
                ->get();

            foreach ($jadwal as $jdl) {
                $results[] = [
                    'id' => $jdl->id,
                    'category' => 'jadwal',
                    'title' => $jdl->mataPelajaran->nama . ' - ' . $jdl->kelas->nama,
                    'subtitle' => $jdl->guru->nama
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan pencarian'
            ], 500);
        }
    }
}