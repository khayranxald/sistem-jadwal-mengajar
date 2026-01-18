<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MataPelajaran\StoreMataPelajaranRequest;
use App\Http\Requests\MataPelajaran\UpdateMataPelajaranRequest;
use App\Services\MataPelajaranService;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MataPelajaranController extends Controller
{
    protected $mataPelajaranService;

    public function __construct(MataPelajaranService $mataPelajaranService)
    {
        $this->mataPelajaranService = $mataPelajaranService;
    }

    /**
     * Display a listing of mata pelajaran
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['jenis', 'is_active', 'search', 'sort_by', 'sort_order', 'per_page']);
            $mataPelajaran = $this->mataPelajaranService->getAll($filters);

            return ResponseHelper::success($mataPelajaran, 'Data mata pelajaran berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Store a newly created mata pelajaran
     */
    public function store(StoreMataPelajaranRequest $request): JsonResponse
    {
        try {
            $mataPelajaran = $this->mataPelajaranService->create($request->validated());

            return ResponseHelper::success($mataPelajaran, 'Mata pelajaran berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Display the specified mata pelajaran
     */
    public function show($id): JsonResponse
    {
        try {
            $mataPelajaran = $this->mataPelajaranService->getById($id);

            return ResponseHelper::success($mataPelajaran, 'Data mata pelajaran berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Mata pelajaran tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Update the specified mata pelajaran
     */
    public function update(UpdateMataPelajaranRequest $request, $id): JsonResponse
    {
        try {
            $mataPelajaran = $this->mataPelajaranService->update($id, $request->validated());

            return ResponseHelper::success($mataPelajaran, 'Mata pelajaran berhasil diupdate');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Mata pelajaran tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Remove the specified mata pelajaran
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->mataPelajaranService->delete($id);

            return ResponseHelper::success(null, 'Mata pelajaran berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Mata pelajaran tidak ditemukan', null, 404);
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
            $stats = $this->mataPelajaranService->getStatistics();

            return ResponseHelper::success($stats, 'Statistik mata pelajaran berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}