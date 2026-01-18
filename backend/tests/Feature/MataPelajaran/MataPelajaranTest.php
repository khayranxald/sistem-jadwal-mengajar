<?php

namespace Tests\Feature\MataPelajaran;

use Tests\TestCase;
use App\Models\User;
use App\Models\MataPelajaran;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MataPelajaranTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->token = $this->admin->createToken('auth_token')->plainTextToken;
    }

    /** @test */
    public function admin_can_get_all_mata_pelajaran()
    {
        // Arrange
        MataPelajaran::factory()->count(5)->create();

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->getJson('/api/admin/mata-pelajaran');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         '*' => [
                             'id',
                             'kode',
                             'nama',
                             'kategori',
                             'jam_per_minggu'
                         ]
                     ]
                 ]);
    }

    /** @test */
    public function admin_can_create_mata_pelajaran()
    {
        // Arrange
        $data = [
            'kode' => 'MTK',
            'nama' => 'Matematika',
            'kategori' => 'Wajib',
            'jam_per_minggu' => 4
        ];

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/admin/mata-pelajaran', $data);

        // Assert
        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Mata pelajaran berhasil ditambahkan'
                 ]);

        $this->assertDatabaseHas('mata_pelajaran', [
            'kode' => 'MTK',
            'nama' => 'Matematika'
        ]);
    }

    /** @test */
    public function admin_can_update_mata_pelajaran()
    {
        // Arrange
        $mapel = MataPelajaran::factory()->create([
            'nama' => 'Matematika Lama'
        ]);

        $data = [
            'kode' => 'MTK',
            'nama' => 'Matematika Baru',
            'kategori' => 'Wajib',
            'jam_per_minggu' => 5
        ];

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->putJson("/api/admin/mata-pelajaran/{$mapel->id}", $data);

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Mata pelajaran berhasil diperbarui'
                 ]);

        $this->assertDatabaseHas('mata_pelajaran', [
            'id' => $mapel->id,
            'nama' => 'Matematika Baru'
        ]);
    }

    /** @test */
    public function admin_can_delete_mata_pelajaran()
    {
        // Arrange
        $mapel = MataPelajaran::factory()->create();

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->deleteJson("/api/admin/mata-pelajaran/{$mapel->id}");

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Mata pelajaran berhasil dihapus'
                 ]);

        $this->assertDatabaseMissing('mata_pelajaran', [
            'id' => $mapel->id
        ]);
    }

    /** @test */
    public function validation_fails_when_creating_without_required_fields()
    {
        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/admin/mata-pelajaran', []);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['kode', 'nama', 'kategori', 'jam_per_minggu']);
    }

    /** @test */
    public function validation_fails_when_kode_already_exists()
    {
        // Arrange
        MataPelajaran::factory()->create(['kode' => 'MTK']);

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/admin/mata-pelajaran', [
                             'kode' => 'MTK',
                             'nama' => 'Matematika',
                             'kategori' => 'Wajib',
                             'jam_per_minggu' => 4
                         ]);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['kode']);
    }

    /** @test */
    public function guru_cannot_create_mata_pelajaran()
    {
        // Arrange
        $guru = User::factory()->create(['role' => 'guru']);
        $token = $guru->createToken('auth_token')->plainTextToken;

        // Act
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/admin/mata-pelajaran', [
                             'kode' => 'MTK',
                             'nama' => 'Matematika',
                             'kategori' => 'Wajib',
                             'jam_per_minggu' => 4
                         ]);

        // Assert
        $response->assertStatus(403);
    }
}