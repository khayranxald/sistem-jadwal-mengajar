<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class GuruController extends Controller
{
    /**
     * Display a listing of guru
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::where('role', 'guru')->with(['mataPelajaran']);

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nip', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            // Sort
            $sortBy = $request->input('sort_by', 'name');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $guru = $query->paginate($perPage);

            return ResponseHelper::success($guru, 'Data guru berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Store a newly created guru
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'nip' => 'required|string|unique:users,nip',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'mata_pelajaran_ids' => 'nullable|array',
                'mata_pelajaran_ids.*' => 'exists:mata_pelajaran,id',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $guru = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'guru',
                'nip' => $request->nip,
                'phone' => $request->phone,
                'address' => $request->address,
                'is_active' => true,
            ]);

            // Attach mata pelajaran
            if ($request->has('mata_pelajaran_ids')) {
                $guru->mataPelajaran()->attach($request->mata_pelajaran_ids);
            }

            $guru->load('mataPelajaran');

            return ResponseHelper::success($guru, 'Guru berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Display the specified guru
     */
    public function show($id): JsonResponse
    {
        try {
            $guru = User::where('role', 'guru')
                ->with(['mataPelajaran', 'kelasWali', 'jadwal'])
                ->findOrFail($id);

            return ResponseHelper::success($guru, 'Data guru berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Guru tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Update the specified guru
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $guru = User::where('role', 'guru')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:6',
                'nip' => 'sometimes|string|unique:users,nip,' . $id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'is_active' => 'sometimes|boolean',
                'mata_pelajaran_ids' => 'nullable|array',
                'mata_pelajaran_ids.*' => 'exists:mata_pelajaran,id',
            ]);

            if ($validator->fails()) {
                return ResponseHelper::error('Validation failed', $validator->errors(), 422);
            }

            $updateData = $request->only(['name', 'email', 'nip', 'phone', 'address', 'is_active']);
            
            if ($request->has('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $guru->update($updateData);

            // Sync mata pelajaran
            if ($request->has('mata_pelajaran_ids')) {
                $guru->mataPelajaran()->sync($request->mata_pelajaran_ids);
            }

            $guru->load('mataPelajaran');

            return ResponseHelper::success($guru, 'Guru berhasil diupdate');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Guru tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Remove the specified guru
     */
    public function destroy($id): JsonResponse
    {
        try {
            $guru = User::where('role', 'guru')->findOrFail($id);

            // Check if guru is wali kelas
            if ($guru->kelasWali()->exists()) {
                return ResponseHelper::error('Guru tidak dapat dihapus karena masih menjadi wali kelas', null, 400);
            }

            // Check if guru has jadwal
            if ($guru->jadwal()->exists()) {
                return ResponseHelper::error('Guru tidak dapat dihapus karena masih memiliki jadwal mengajar', null, 400);
            }

            // Detach mata pelajaran
            $guru->mataPelajaran()->detach();

            $guru->delete();

            return ResponseHelper::success(null, 'Guru berhasil dihapus');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ResponseHelper::error('Guru tidak ditemukan', null, 404);
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }

    /**
     * Get guru statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_guru' => User::where('role', 'guru')->count(),
                'guru_active' => User::where('role', 'guru')->where('is_active', true)->count(),
                'guru_inactive' => User::where('role', 'guru')->where('is_active', false)->count(),
                'guru_wali_kelas' => User::where('role', 'guru')->has('kelasWali')->count(),
            ];

            return ResponseHelper::success($stats, 'Statistik guru berhasil diambil');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), null, 500);
        }
    }
}