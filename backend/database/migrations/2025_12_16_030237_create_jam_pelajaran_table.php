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
        Schema::create('jam_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jam', 50); // Contoh: Jam ke-1, Jam ke-2
            $table->integer('urutan'); // 1, 2, 3, dst
            $table->time('jam_mulai'); // 07:00
            $table->time('jam_selesai'); // 07:45
            $table->integer('durasi_menit')->default(45); // Durasi dalam menit
            $table->boolean('is_istirahat')->default(false); // Jam istirahat atau tidak
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index untuk query cepat
            $table->index('urutan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jam_pelajaran');
    }
};