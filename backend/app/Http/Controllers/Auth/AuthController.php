<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login user
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        
        $result = $this->authService->login($credentials);

        if (!$result) {
            return ResponseHelper::error(
                'Email atau password salah',
                null,
                401
            );
        }

        if (isset($result['error'])) {
            return ResponseHelper::error(
                $result['error'],
                null,
                403
            );
        }

        return ResponseHelper::success(
            $result,
            'Login berhasil',
            200
        );
    }

    /**
     * Logout user (current device)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return ResponseHelper::success(
            null,
            'Logout berhasil',
            200
        );
    }

    /**
     * Logout dari semua device
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());

        return ResponseHelper::success(
            null,
            'Logout dari semua device berhasil',
            200
        );
    }

    /**
     * Get authenticated user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->getUserInfo($request->user());

        return ResponseHelper::success(
            $user,
            'User info retrieved successfully',
            200
        );
    }
}