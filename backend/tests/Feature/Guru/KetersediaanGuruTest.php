<?php

namespace Tests\Feature\Guru;

use Tests\TestCase;
use App\Models\User;
use App\Models\JamPelajaran;
use App\Models\KetersediaanGuru;
use Illuminate\Foundation\Testing\RefreshDatabase;

class KetersediaanGuruTest extends TestCase
{
    use RefreshDatabase;

    protected $guru;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create guru user
        $this->guru = User::factory()->create(['role' => 'guru']);
        $this->token = $this->guru->createToken('auth_token')->plainTextToken;
        
        // Create jam pelajaran
        JamPelajaran::factory()->count(10)->create();
    }

    /** @test */
    public function guru_can_get_their_ketersediaan()
    {
        // Arrange
        KetersediaanGuru::factory()->count(5)->create([
            'guru_id' => $this->guru->id
        ]);

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->getJson('/api/guru/ketersediaan');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => [
                             'id',
                             'hari',
                             'jam_id',
                             'tersedia'
                         ]
                     ]
                 ]);
    }

    /** @test */
    public function guru_can_update_ketersediaan()
    {
        // Arrange
        $data = [
            'ketersediaan' => [
                [
                    'hari' => 1,
                    'jam_id' => 1,
                    'tersedia' => true
                ],
                [
                    'hari' => 1,
                    'jam_id' => 2,
                    'tersedia' => false
                ],
                [
                    'hari' => 2,
                    'jam_id' => 1,
                    'tersedia' => true
                ]
            ]
        ];

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/guru/ketersediaan', $data);

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Ketersediaan berhasil diperbarui'
                 ]);

        $this->assertDatabaseHas('ketersediaan_guru', [
            'guru_id' => $this->guru->id,
            'hari' => 1,
            'jam_id' => 1,
            'tersedia' => true
        ]);
    }

    /** @test */
    public function guru_cannot_set_ketersediaan_for_invalid_hari()
    {
        // Arrange
        $data = [
            'ketersediaan' => [
                [
                    'hari' => 7, // Invalid (only 1-6)
                    'jam_id' => 1,
                    'tersedia' => true
                ]
            ]
        ];

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/guru/ketersediaan', $data);

        // Assert
        $response->assertStatus(422);
    }

    /** @test */
    public function guru_cannot_set_ketersediaan_for_nonexistent_jam()
    {
        // Arrange
        $data = [
            'ketersediaan' => [
                [
                    'hari' => 1,
                    'jam_id' => 999, // Non-existent
                    'tersedia' => true
                ]
            ]
        ];

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/guru/ketersediaan', $data);

        // Assert
        $response->assertStatus(422);
    }

    /** @test */
    public function admin_cannot_access_guru_ketersediaan_endpoint()
    {
        // Arrange
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('auth_token')->plainTextToken;

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/guru/ketersediaan');

        // Assert
        $response->assertStatus(403);
    }

    /** @test */
    public function ketersediaan_updates_override_previous_data()
    {
        // Arrange - Initial data
        KetersediaanGuru::create([
            'guru_id' => $this->guru->id,
            'hari' => 1,
            'jam_id' => 1,
            'tersedia' => true
        ]);

        // Act - Update with new data
        $data = [
            'ketersediaan' => [
                [
                    'hari' => 1,
                    'jam_id' => 1,
                    'tersedia' => false // Changed to false
                ]
            ]
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/guru/ketersediaan', $data);

        // Assert
        $response->assertStatus(200);
        
        $this->assertDatabaseHas('ketersediaan_guru', [
            'guru_id' => $this->guru->id,
            'hari' => 1,
            'jam_id' => 1,
            'tersedia' => false
        ]);
    }
}