<?php

namespace App\Services;

use App\Models\JamPelajaran;
use Illuminate\Support\Facades\DB;

class JamPelajaranService
{
    /**
     * Get all jam pelajaran with filters
     */
    public function getAll($filters = [])
    {
        $query = JamPelajaran::query();

        // Filter by istirahat
        if (isset($filters['is_istirahat'])) {
            $query->where('is_istirahat', $filters['is_istirahat']);
        }

        // Filter by active status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Search by name
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where('nama_jam', 'like', "%{$search}%");
        }

        // Sort by urutan by default
        $sortBy = $filters['sort_by'] ?? 'urutan';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 20;
        
        return $query->paginate($perPage);
    }

    /**
     * Get single jam pelajaran
     */
    public function getById($id)
    {
        return JamPelajaran::findOrFail($id);
    }

    /**
     * Create new jam pelajaran
     */
    public function create($data)
    {
        return DB::transaction(function () use ($data) {
            return JamPelajaran::create($data);
        });
    }

    /**
     * Update jam pelajaran
     */
    public function update($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $jam = JamPelajaran::findOrFail($id);
            $jam->update($data);
            return $jam->fresh();
        });
    }

    /**
     * Delete jam pelajaran
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $jam = JamPelajaran::findOrFail($id);
            
            // Check if jam is being used in jadwal
            if ($jam->jadwal()->exists()) {
                throw new \Exception('Jam pelajaran tidak dapat dihapus karena masih digunakan dalam jadwal');
            }
            
            // Check if jam is being used in ketersediaan
            if ($jam->ketersediaan()->exists()) {
                throw new \Exception('Jam pelajaran tidak dapat dihapus karena masih digunakan dalam ketersediaan guru');
            }
            
            return $jam->delete();
        });
    }

    /**
     * Get statistics
     */
    public function getStatistics()
    {
        return [
            'total' => JamPelajaran::count(),
            'jam_efektif' => JamPelajaran::where('is_istirahat', false)->count(),
            'jam_istirahat' => JamPelajaran::where('is_istirahat', true)->count(),
            'active' => JamPelajaran::where('is_active', true)->count(),
        ];
    }
}