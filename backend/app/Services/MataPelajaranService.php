<?php

namespace App\Services;

use App\Models\MataPelajaran;
use Illuminate\Support\Facades\DB;

class MataPelajaranService
{
    /**
     * Get all mata pelajaran with filters
     */
    public function getAll($filters = [])
    {
        $query = MataPelajaran::query();

        // Filter by jenis
        if (isset($filters['jenis'])) {
            $query->where('jenis', $filters['jenis']);
        }

        // Filter by active status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Search by name or code
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('nama_mapel', 'like', "%{$search}%")
                  ->orWhere('kode_mapel', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'nama_mapel';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 10;
        
        return $query->paginate($perPage);
    }

    /**
     * Get single mata pelajaran with relationships
     */
    public function getById($id)
    {
        return MataPelajaran::with(['guru'])->findOrFail($id);
    }

    /**
     * Create new mata pelajaran
     */
    public function create($data)
    {
        return DB::transaction(function () use ($data) {
            return MataPelajaran::create($data);
        });
    }

    /**
     * Update mata pelajaran
     */
    public function update($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $mapel = MataPelajaran::findOrFail($id);
            $mapel->update($data);
            return $mapel->fresh();
        });
    }

    /**
     * Delete mata pelajaran
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $mapel = MataPelajaran::findOrFail($id);
            
            // Check if mapel is being used in jadwal
            if ($mapel->jadwal()->exists()) {
                throw new \Exception('Mata pelajaran tidak dapat dihapus karena masih digunakan dalam jadwal');
            }
            
            // Detach all guru relationships
            $mapel->guru()->detach();
            
            return $mapel->delete();
        });
    }

    /**
     * Get statistics
     */
    public function getStatistics()
    {
        return [
            'total' => MataPelajaran::count(),
            'by_jenis' => MataPelajaran::select('jenis', DB::raw('count(*) as total'))
                ->groupBy('jenis')
                ->get(),
            'active' => MataPelajaran::where('is_active', true)->count(),
            'inactive' => MataPelajaran::where('is_active', false)->count(),
        ];
    }
}