<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Kelas\StoreKelasRequest;
use App\Http\Requests\Kelas\UpdateKelasRequest;
use App\Services\KelasService;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KelasController extends Controller
{
    protected $kelasService;

    public function __construct(KelasService $kelasService)
    {
        $this->kelasService = $kelasService;
    }

    /**
     * Display a listing of kelas
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['tingkat', 'jurusan', 'is_active', 'search', 'sort_by', 'sort_order', 'per_page']);
            $kelas = $this->kelasService->getAll($filters);

            return ResponseHelper::success($kelas, 'Data kelas berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Store a newly created kelas
     */
    public function store(StoreKelasRequest $request): JsonResponse
    {
        try {
            $kelas = $this->kelasService->create($request->validated());

            return ResponseHelper::success($kelas, 'Kelas berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Display the specified kelas
     */
    public function show($id): JsonResponse
    {
        try {
            $kelas = $this->kelasService->getById($id);

            return ResponseHelper::success($kelas, 'Data kelas berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Kelas tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Update the specified kelas
     */
    public function update(UpdateKelasRequest $request, $id): JsonResponse
    {
        try {
            $kelas = $this->kelasService->update($id, $request->validated());

            return ResponseHelper::success($kelas, 'Kelas berhasil diupdate');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Kelas tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Remove the specified kelas
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->kelasService->delete($id);

            return ResponseHelper::success(null, 'Kelas berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Kelas tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 400);
        }
    }

    /**
     * Get statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = $this->kelasService->getStatistics();

            return ResponseHelper::success($stats, 'Statistik kelas berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}