<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\HealthCheckController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Guru\GuruDashboardController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =======================
// Public Routes
// =======================

// Health Check
Route::get('/health', [HealthCheckController::class, 'index']);

// Authentication (Public)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// =======================
// Protected Routes
// =======================
Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    /*
    |--------------------------------------------------------------------------
    | Profile (All Roles)
    |--------------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);

    /*
    |--------------------------------------------------------------------------
    | Notifications (All Roles)  🔔  <-- UPDATE 5.8
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Global Search (All Roles)  🔍  <-- UPDATE 5.8
    |--------------------------------------------------------------------------
    */
    Route::get('/search', [SearchController::class, 'search']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('role:admin')->group(function () {

        // Dashboard
        Route::get('/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to Admin Dashboard',
                'user' => auth()->user()->only(['id', 'name', 'email', 'role'])
            ]);
        });

        // Guru Management
        Route::prefix('guru')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\GuruController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Admin\GuruController::class, 'store']);
            Route::get('/statistics', [App\Http\Controllers\Admin\GuruController::class, 'statistics']);
            Route::get('/{id}', [App\Http\Controllers\Admin\GuruController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\Admin\GuruController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Admin\GuruController::class, 'destroy']);
        });

        // Mata Pelajaran
        Route::prefix('mata-pelajaran')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\MataPelajaranController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Admin\MataPelajaranController::class, 'store']);
            Route::get('/statistics', [App\Http\Controllers\Admin\MataPelajaranController::class, 'statistics']);
            Route::get('/{id}', [App\Http\Controllers\Admin\MataPelajaranController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\Admin\MataPelajaranController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Admin\MataPelajaranController::class, 'destroy']);
        });

        // Kelas
        Route::prefix('kelas')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\KelasController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Admin\KelasController::class, 'store']);
            Route::get('/statistics', [App\Http\Controllers\Admin\KelasController::class, 'statistics']);
            Route::get('/{id}', [App\Http\Controllers\Admin\KelasController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\Admin\KelasController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Admin\KelasController::class, 'destroy']);
        });

        // Jam Pelajaran
        Route::prefix('jam-pelajaran')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\JamPelajaranController::class, 'index']);
            Route::post('/', [App\Http\Controllers\Admin\JamPelajaranController::class, 'store']);
            Route::get('/statistics', [App\Http\Controllers\Admin\JamPelajaranController::class, 'statistics']);
            Route::get('/{id}', [App\Http\Controllers\Admin\JamPelajaranController::class, 'show']);
            Route::put('/{id}', [App\Http\Controllers\Admin\JamPelajaranController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Admin\JamPelajaranController::class, 'destroy']);
        });

        // Scheduling (Jadwal)
        Route::prefix('scheduling')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\SchedulingController::class, 'index']);
            Route::post('/generate', [App\Http\Controllers\Admin\SchedulingController::class, 'generate']);
            Route::post('/clear', [App\Http\Controllers\Admin\SchedulingController::class, 'clear']);
            Route::get('/statistics', [App\Http\Controllers\Admin\SchedulingController::class, 'statistics']);
            Route::get('/kelas/{kelasId}', [App\Http\Controllers\Admin\SchedulingController::class, 'getByKelas']);
            Route::get('/guru/{guruId}', [App\Http\Controllers\Admin\SchedulingController::class, 'getByGuru']);
            Route::put('/{id}', [App\Http\Controllers\Admin\SchedulingController::class, 'update']);
            Route::delete('/{id}', [App\Http\Controllers\Admin\SchedulingController::class, 'destroy']);
        });

        // Ketersediaan Guru
        Route::prefix('ketersediaan')->group(function () {
            Route::get('/guru/{guruId}', [App\Http\Controllers\Admin\KetersediaanGuruController::class, 'getByGuru']);
            Route::post('/bulk-set', [App\Http\Controllers\Admin\KetersediaanGuruController::class, 'bulkSet']);
            Route::post('/toggle', [App\Http\Controllers\Admin\KetersediaanGuruController::class, 'toggle']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Guru Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('guru')->middleware('role:guru')->group(function () {

        Route::get('/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to Guru Dashboard',
                'user' => auth()->user()->only(['id', 'name', 'email', 'role', 'nip'])
            ]);
        });

        Route::get('/ketersediaan', [App\Http\Controllers\Admin\KetersediaanGuruController::class, 'index']);
        Route::post('/ketersediaan', [App\Http\Controllers\Admin\KetersediaanGuruController::class, 'store']);
    });

        // / Routes untuk Guru
    Route::middleware(['auth:sanctum', 'checkrole:guru'])->prefix('guru')->group(function () {
        // Dashboard
        Route::get('/dashboard', [GuruDashboardController::class, 'index']);
        
        // Jadwal
        Route::get('/jadwal', [GuruDashboardController::class, 'jadwal']);
        
        // Ketersediaan
        Route::get('/ketersediaan', [GuruDashboardController::class, 'ketersediaan']);
        Route::post('/ketersediaan', [GuruDashboardController::class, 'updateKetersediaan']);
        
        // Profil
        Route::get('/profil', [ProfileController::class, 'show']);
        Route::put('/profil', [ProfileController::class, 'update']);
        Route::put('/profil/password', [ProfileController::class, 'updatePassword']);
    });

    /*
    |--------------------------------------------------------------------------
    | Kepala Sekolah Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('kepsek')->middleware('role:kepsek')->group(function () {

        Route::get('/dashboard', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome to Kepala Sekolah Dashboard',
                'user' => auth()->user()->only(['id', 'name', 'email', 'role', 'nip'])
            ]);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Shared User Info
    |--------------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    });
});
