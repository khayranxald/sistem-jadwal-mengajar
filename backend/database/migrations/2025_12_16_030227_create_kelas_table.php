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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas', 50); // Contoh: X IPA 1, XI IPS 2
            $table->enum('tingkat', ['X', 'XI', 'XII']); // Tingkat kelas
            $table->enum('jurusan', ['IPA', 'IPS', 'Bahasa', 'Umum'])->nullable();
            $table->integer('kapasitas')->default(36);
            $table->string('ruangan')->nullable();
            $table->foreignId('wali_kelas_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};