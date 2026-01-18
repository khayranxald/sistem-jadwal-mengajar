<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->foreignId('jam_pelajaran_id')->constrained('jam_pelajaran')->onDelete('cascade');
            $table->string('ruangan')->nullable();
            $table->enum('semester', ['Ganjil', 'Genap'])->default('Ganjil');
            $table->string('tahun_ajaran', 20); // Contoh: 2024/2025
            $table->text('keterangan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Unique constraint: tidak boleh ada jadwal duplikat
            $table->unique(
            ['kelas_id', 'hari', 'jam_pelajaran_id', 'tahun_ajaran', 'semester'],
            'jadwal_unique'
            );
            
            // Index untuk query
            $table->index(['guru_id', 'hari']);
            $table->index(['kelas_id', 'hari']);
            $table->index(['tahun_ajaran', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};