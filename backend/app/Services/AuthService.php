<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Login user dan generate token
     *
     * @param array $credentials
     * @return array|null
     */
    public function login(array $credentials): ?array
    {
        // Cari user by email
        $user = User::where('email', $credentials['email'])->first();

        // Cek user exists dan password match
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        // Cek user aktif
        if (!$user->is_active) {
            return [
                'error' => 'Account is inactive. Please contact administrator.'
            ];
        }

        // Generate token dengan Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'nip' => $user->nip,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ];
    }

    /**
     * Logout user (revoke token)
     *
     * @param User $user
     * @return bool
     */
    public function logout(User $user): bool
    {
        // Revoke current token
        $user->currentAccessToken()->delete();
        
        return true;
    }

    /**
     * Logout dari semua device (revoke all tokens)
     *
     * @param User $user
     * @return bool
     */
    public function logoutAll(User $user): bool
    {
        // Revoke all tokens
        $user->tokens()->delete();
        
        return true;
    }

    /**
     * Get authenticated user info
     *
     * @param User $user
     * @return array
     */
    public function getUserInfo(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'nip' => $user->nip,
            'phone' => $user->phone,
            'address' => $user->address,
            'is_active' => $user->is_active,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
        ];
    }
}