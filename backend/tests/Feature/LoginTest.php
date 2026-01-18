<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_login_with_correct_credentials()
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'role' => 'admin'
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password123'
        ]);

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => [
                             'id',
                             'nama',
                             'email',
                             'role'
                         ],
                         'token'
                     ]
                 ]);
    }

    /** @test */
    public function user_cannot_login_with_incorrect_password()
    {
        // Arrange
        User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password123')
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword'
        ]);

        // Assert
        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Email atau password salah'
                 ]);
    }

    /** @test */
    public function user_cannot_login_with_nonexistent_email()
    {
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@test.com',
            'password' => 'password123'
        ]);

        // Assert
        $response->assertStatus(401)
                 ->assertJson([
                     'success' => false
                 ]);
    }

    /** @test */
    public function login_validation_fails_without_email()
    {
        // Act
        $response = $this->postJson('/api/login', [
            'password' => 'password123'
        ]);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function login_validation_fails_without_password()
    {
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com'
        ]);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function user_can_logout()
    {
        // Arrange
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/logout');

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Logout berhasil'
                 ]);
    }

    /** @test */
    public function authenticated_user_can_get_profile()
    {
        // Arrange
        $user = User::factory()->create([
            'nama' => 'John Doe',
            'email' => 'john@test.com'
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/profile');

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'nama' => 'John Doe',
                         'email' => 'john@test.com'
                     ]
                 ]);
    }
}