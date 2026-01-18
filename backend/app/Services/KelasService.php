<?php

namespace App\Services;

use App\Models\Kelas;
use Illuminate\Support\Facades\DB;

class KelasService
{
    /**
     * Get all kelas with filters
     */
    public function getAll($filters = [])
    {
        $query = Kelas::with(['waliKelas']);

        // Filter by tingkat
        if (isset($filters['tingkat'])) {
            $query->where('tingkat', $filters['tingkat']);
        }

        // Filter by jurusan
        if (isset($filters['jurusan'])) {
            $query->where('jurusan', $filters['jurusan']);
        }

        // Filter by active status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Search by name
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where('nama_kelas', 'like', "%{$search}%");
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'nama_kelas';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 10;
        
        return $query->paginate($perPage);
    }

    /**
     * Get single kelas with relationships
     */
    public function getById($id)
    {
        return Kelas::with(['waliKelas', 'jadwal'])->findOrFail($id);
    }

    /**
     * Create new kelas
     */
    public function create($data)
    {
        return DB::transaction(function () use ($data) {
            return Kelas::create($data);
        });
    }

    /**
     * Update kelas
     */
    public function update($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $kelas = Kelas::findOrFail($id);
            $kelas->update($data);
            return $kelas->fresh(['waliKelas']);
        });
    }

    /**
     * Delete kelas
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $kelas = Kelas::findOrFail($id);
            
            // Check if kelas is being used in jadwal
            if ($kelas->jadwal()->exists()) {
                throw new \Exception('Kelas tidak dapat dihapus karena masih memiliki jadwal');
            }
            
            return $kelas->delete();
        });
    }

    /**
     * Get statistics
     */
    public function getStatistics()
    {
        return [
            'total' => Kelas::count(),
            'by_tingkat' => Kelas::select('tingkat', DB::raw('count(*) as total'))
                ->groupBy('tingkat')
                ->get(),
            'by_jurusan' => Kelas::select('jurusan', DB::raw('count(*) as total'))
                ->groupBy('jurusan')
                ->get(),
            'active' => Kelas::where('is_active', true)->count(),
        ];
    }
}