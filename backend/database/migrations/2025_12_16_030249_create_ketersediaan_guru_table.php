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
        Schema::create('ketersediaan_guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->foreignId('jam_pelajaran_id')->constrained('jam_pelajaran')->onDelete('cascade');
            $table->boolean('is_available')->default(true); // true = tersedia, false = tidak tersedia
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Unique constraint: satu guru tidak bisa punya duplikat hari + jam
            $table->unique(['guru_id', 'hari', 'jam_pelajaran_id']);
            
            // Index untuk query
            $table->index(['guru_id', 'hari']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ketersediaan_guru');
    }
};