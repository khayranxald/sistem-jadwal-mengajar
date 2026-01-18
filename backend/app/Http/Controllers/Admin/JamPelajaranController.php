<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\JamPelajaran\StoreJamPelajaranRequest;
use App\Http\Requests\JamPelajaran\UpdateJamPelajaranRequest;
use App\Services\JamPelajaranService;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JamPelajaranController extends Controller
{
    protected $jamPelajaranService;

    public function __construct(JamPelajaranService $jamPelajaranService)
    {
        $this->jamPelajaranService = $jamPelajaranService;
    }

    /**
     * Display a listing of jam pelajaran
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['is_istirahat', 'is_active', 'search', 'sort_by', 'sort_order', 'per_page']);
            $jamPelajaran = $this->jamPelajaranService->getAll($filters);

            return ResponseHelper::success($jamPelajaran, 'Data jam pelajaran berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Store a newly created jam pelajaran
     */
    public function store(StoreJamPelajaranRequest $request): JsonResponse
    {
        try {
            $jamPelajaran = $this->jamPelajaranService->create($request->validated());

            return ResponseHelper::success($jamPelajaran, 'Jam pelajaran berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Display the specified jam pelajaran
     */
    public function show($id): JsonResponse
    {
        try {
            $jamPelajaran = $this->jamPelajaranService->getById($id);

            return ResponseHelper::success($jamPelajaran, 'Data jam pelajaran berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Jam pelajaran tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Update the specified jam pelajaran
     */
    public function update(UpdateJamPelajaranRequest $request, $id): JsonResponse
    {
        try {
            $jamPelajaran = $this->jamPelajaranService->update($id, $request->validated());

            return ResponseHelper::success($jamPelajaran, 'Jam pelajaran berhasil diupdate');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Jam pelajaran tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Remove the specified jam pelajaran
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->jamPelajaranService->delete($id);

            return ResponseHelper::success(null, 'Jam pelajaran berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Jam pelajaran tidak ditemukan', null, 404);
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
            $stats = $this->jamPelajaranService->getStatistics();

            return ResponseHelper::success($stats, 'Statistik jam pelajaran berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}